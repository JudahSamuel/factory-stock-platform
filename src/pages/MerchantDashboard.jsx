import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export default function MerchantDashboard() {

  const [inventory, setInventory] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "inventory"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setInventory(data);

      }
    );

    return () => unsubscribe();

  }, []);

  return (
    <div style={{ padding: "30px" }}>

      <h1>Available Inventory</h1>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>

          {inventory.map(item => (

            <tr key={item.id}>

              <td>{item.product}</td>

              <td>{item.stock}</td>

              <td>{item.price}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}