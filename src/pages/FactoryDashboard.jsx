import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import AnimatedCard from "../components/AnimatedCard";
import AnimatedButton from "../components/AnimatedButton";
import * as XLSX from "xlsx";
import {

getProducts,

uploadProducts

} from "../api/product";

export default function FactoryDashboard() {
  const [file, setFile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    loadProducts();

}, []);

const loadProducts = async () => {

    try {

        const res = await getProducts();

        setInventory(res.data);

    } catch (err) {

        console.error(err);

    }

};

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

        console.log(rows);

      const products = rows.map(row => ({

    product: row.Product,

    category: row.Category || "",

    stock: Number(row.Stock) || 0,

    unit: row.Unit || "",

    price: Number(row.Price) || 0,

    gst: Number(row.GST) || 0,

    hsn: String(row.HSN || "")

}));

console.log(products);

await uploadProducts(products);

await loadProducts();

      alert("Inventory uploaded successfully!");

      setFile(null);
      setUploading(false);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
      setUploading(false);
    }
  };

  const totalProducts = inventory.length;

  const totalStock = inventory.reduce(
    (sum, item) => sum + (item.stock || 0),
    0
  );

  const inventoryValue = inventory.reduce(
    (sum, item) =>
      sum + ((item.stock || 0) * (item.price || 0)),
    0
  );

  return (
  <AnimatedPage>

      <div className="min-h-screen bg-slate-100 p-8">


      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold tracking-tight">
          <p className="text-gray-500 mt-1">
Manage inventory, stock uploads and analytics.
</p>
          Factory Dashboard
        </h1>

        

      </div>

      {/* Analytics Cards */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

<AnimatedCard index={0}>
<div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">

<h3 className="text-lg font-semibold">
Total Products
</h3>

<p className="text-4xl font-bold mt-3">
{totalProducts}
</p>

</div>
</AnimatedCard>

<AnimatedCard index={1}>
<div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg">

<h3 className="text-lg font-semibold">
Total Stock
</h3>

<p className="text-4xl font-bold mt-3">
{totalStock}
</p>

</div>
</AnimatedCard>

<AnimatedCard index={2}>
<div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg">

<h3 className="text-lg font-semibold">
Inventory Value
</h3>

<p className="text-4xl font-bold mt-3">
₹{inventoryValue.toLocaleString()}
</p>

</div>
</AnimatedCard>

</div>

      {/* Upload Section */}

      <AnimatedCard index={3}>

<div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Upload Inventory Excel
        </h2>

        <input
    type="file"
    accept=".xlsx,.xls"
    onChange={(e) => setFile(e.target.files[0])}
    className="
        block
        w-full
        max-w-md
        text-sm
        text-gray-600
        file:mr-4
        file:py-2
        file:px-4
        file:rounded-lg
        file:border-0
        file:bg-blue-600
        file:text-white
        file:font-medium
        hover:file:bg-blue-700
        cursor-pointer
    "
/>
        <br />

        <AnimatedButton
    onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          {uploading
            ? "Uploading..."
            : "Upload Excel"}
        </AnimatedButton>

      </div>
      </AnimatedCard>

      {/* Inventory Table */}

      <AnimatedCard index={4}>

<div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="text-2xl font-semibold">
            Current Inventory
          </h2>

        </div>
        

        <table className="w-full">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-left">
                Unit
              </th>

              <th className="p-4 text-left">
    HSN
</th>

              <th className="p-4 text-left">
                Price
              </th>

            </tr>

          </thead>

          <tbody>

            {inventory.map((item) => (

              <tr
key={item.id}
className="
border-t
hover:bg-blue-50
transition-all
duration-300
"
>

                <td className="p-4">
                  {item.product}
                </td>

                <td className="p-4">
                  {item.category}
                </td>

                <td className="p-4">
                  {item.stock}
                </td>

                <td className="p-4">
                  {item.unit}
                </td>

                <td className="p-4">
    {item.hsn}
</td>

                <td className="p-4">
                  ₹{item.price}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
      </AnimatedCard>

        </div>

</AnimatedPage>
);
}