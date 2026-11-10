import prisma from "../config/prisma.js";

/**
 * Ensures that the InvoiceCounter table exists and is seeded with the initial counter value.
 * If the counter does not exist:
 *  - Inspects all existing Order.invoice values to find the maximum sequential number.
 *  - If maxSeq >= 221, initialize lastValue = maxSeq (so the next will be maxSeq + 1).
 *  - Otherwise, initialize lastValue = 220 (so the first new invoice receives 221).
 * If the counter already exists:
 *  - Preserves the counter value across restarts/empty orders/deletions.
 *  - Verifies that lastValue is at least as high as any existing invoice number in the DB.
 */
export const ensureInvoiceCounter = async (db = prisma) => {
  // 1. Ensure table exists in PostgreSQL
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "InvoiceCounter" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL UNIQUE DEFAULT 'invoice',
      "lastValue" INTEGER NOT NULL DEFAULT 220,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Check if the 'invoice' record exists
  const existing = await db.$queryRawUnsafe(`
    SELECT "id", "name", "lastValue" 
    FROM "InvoiceCounter" 
    WHERE "name" = 'invoice' 
    LIMIT 1;
  `);

  // 3. Scan existing orders to find highest sequential number
  const existingOrders = await db.order.findMany({
    select: { invoice: true },
  });

  let maxExisting = 0;
  for (const o of existingOrders) {
    if (!o.invoice) continue;
    const match = o.invoice.match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxExisting) {
        maxExisting = num;
      }
    }
  }

  if (!existing || existing.length === 0) {
    // Initialize counter record.
    // If there is already an invoice >= 221, start from that, otherwise 220 (so next is 221).
    const initialValue = maxExisting >= 221 ? maxExisting : 220;
    console.log(
      `[InvoiceCounter] Initializing counter with lastValue = ${initialValue} (max existing in DB: ${maxExisting})`
    );

    await db.$executeRawUnsafe(`
      INSERT INTO "InvoiceCounter" ("name", "lastValue", "updatedAt")
      VALUES ('invoice', ${initialValue}, CURRENT_TIMESTAMP)
      ON CONFLICT ("name") DO NOTHING;
    `);
  } else {
    // Record already exists. Ensure it never generates duplicates of existing orders.
    const currentLast = Number(existing[0].lastValue);
    if (maxExisting > currentLast) {
      console.log(
        `[InvoiceCounter] Advancing counter from ${currentLast} to ${maxExisting} to avoid duplicates`
      );
      await db.$executeRawUnsafe(`
        UPDATE "InvoiceCounter"
        SET "lastValue" = ${maxExisting}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "name" = 'invoice';
      `);
    }
  }
};

/**
 * Atomically increments the counter and returns the next formatted invoice string.
 * Must be executed within a Prisma transaction (`tx`) or default client.
 * 
 * Returns:
 * {
 *   sequenceNumber: 221,
 *   invoice: "29-10-2026-0221"
 * }
 */
export const allocateInvoiceNumber = async (tx = prisma) => {
  // Ensure the counter table and record are ready
  await ensureInvoiceCounter(tx);

  // Atomically increment and lock row in PostgreSQL
  const result = await tx.$queryRawUnsafe(`
    UPDATE "InvoiceCounter"
    SET "lastValue" = "lastValue" + 1, "updatedAt" = CURRENT_TIMESTAMP
    WHERE "name" = 'invoice'
    RETURNING "lastValue";
  `);

  if (!result || result.length === 0) {
    throw new Error(
      "Failed to allocate sequential invoice number from database."
    );
  }

  const sequenceNumber = Number(result[0].lastValue);
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const formattedSeq = String(sequenceNumber).padStart(4, "0");
  const invoice = `${day}-${month}-${year}-${formattedSeq}`;

  return {
    sequenceNumber,
    invoice,
  };
};

/**
 * Returns the next upcoming invoice number without incrementing or consuming the counter.
 * Safe to call repeatedly during invoice preview.
 */
export const getNextInvoiceNumber = async (db = prisma) => {
  await ensureInvoiceCounter(db);

  const existing = await db.$queryRawUnsafe(`
    SELECT "lastValue" 
    FROM "InvoiceCounter" 
    WHERE "name" = 'invoice' 
    LIMIT 1;
  `);

  const existingOrders = await db.order.findMany({
    select: { invoice: true },
  });

  let maxExisting = 0;
  for (const o of existingOrders) {
    if (!o.invoice) continue;
    const match = o.invoice.match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxExisting) {
        maxExisting = num;
      }
    }
  }

  const currentLast = existing && existing.length > 0 ? Number(existing[0].lastValue) : 220;
  const baseValue = Math.max(currentLast, maxExisting);
  const nextSeq = baseValue + 1;

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const formattedSeq = String(nextSeq).padStart(4, "0");
  const invoice = `${day}-${month}-${year}-${formattedSeq}`;

  return {
    sequenceNumber: nextSeq,
    invoice,
  };
};

