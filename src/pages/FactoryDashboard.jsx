import { useState } from "react";
import * as XLSX from "xlsx";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function FactoryDashboard() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    try {
      if (!file) {
        alert("Please select an Excel file");
        return;
      }

      setUploading(true);

      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const rows =
        XLSX.utils.sheet_to_json(sheet);

      console.log("Excel Data:", rows);

      for (const row of rows) {
        const productName = row.Product;

        if (!productName) continue;

        await setDoc(
          doc(db, "inventory", productName),
          {
            product: row.Product,
            stock: Number(row.Stock) || 0,
            price: Number(row.Price) || 0,
            updatedAt: new Date().toISOString()
          }
        );
      }

      alert("Inventory uploaded successfully!");

      setFile(null);
      setUploading(false);

    } catch (error) {
      console.error(error);
      alert("Upload failed");

      setUploading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <h1>Factory Dashboard</h1>

      <p>
        Upload inventory Excel sheet
      </p>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <br />
      <br />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        {uploading
          ? "Uploading..."
          : "Upload Excel"}
      </button>

      <br />
      <br />

      <h3>Required Excel Format</h3>

      <table
        border="1"
        cellPadding="10"
      >
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Plastic</td>
            <td>500</td>
            <td>20</td>
          </tr>

          <tr>
            <td>Metal</td>
            <td>300</td>
            <td>35</td>
          </tr>

          <tr>
            <td>Paper</td>
            <td>700</td>
            <td>15</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}