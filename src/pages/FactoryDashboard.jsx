import { useState, useEffect } from "react";
import AnimatedPage from "../components/AnimatedPage";
import AnimatedCard from "../components/AnimatedCard";
import AnimatedButton from "../components/AnimatedButton";
import AdminSidebar from "../components/AdminSidebar";
import AddProductModal from "../components/AddProductModal";
import UpdateStockModal from "../components/UpdateStockModal";
import EditProductModal from "../components/EditProductModal";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import {

getProducts,

uploadProducts,

addProduct,

updateStock,

updateProduct,

deleteProduct

} from "../api/product";

export default function FactoryDashboard() {
  const [file, setFile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showStockModal,setShowStockModal]=useState(false);

const [selectedProduct,setSelectedProduct]=useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const [selectedEditProduct, setSelectedEditProduct] = useState(null);

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

      toast.success("Inventory imported");

      setFile(null);
      setUploading(false);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
      setUploading(false);
    }
  };

  const exportInventory = () => {

    const data = inventory.map(item => ({

        Product: item.product,
        Category: item.category,
        Stock: item.stock,
        Unit: item.unit,
        HSN: item.hsn,
        GST: item.gst,
        Price: item.price

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Inventory"
    );

    XLSX.writeFile(
        workbook,
        "Inventory.xlsx"
    );

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

      <div className="min-h-screen flex bg-slate-100">

        <AdminSidebar />

    <div className="flex-1 p-8">


      {/* Header */}

      <div className="flex justify-between items-center mb-8">

    <div>

        <h1 className="text-4xl font-bold">
            Factory Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
            Manage inventory, stock updates and analytics.
        </p>

    </div>

    <div className="flex gap-3">

    <AnimatedButton
        onClick={exportInventory}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg"
    >
        Export Excel
    </AnimatedButton>

    <AnimatedButton
        onClick={() => setShowAddProduct(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
    >
        + Add Product
    </AnimatedButton>

</div>

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

      

      {/* Inventory Table */}

      <AnimatedCard index={4}>

<div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="p-5 border-b">

          <div className="flex justify-between items-center">

<h2 className="text-2xl font-semibold">
Current Inventory
</h2>

<p className="text-sm text-gray-500">
Manage products individually
</p>

</div>

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

              <th className="p-4 text-left">
GST
</th>

<th className="p-4 text-center">
Actions
</th>

            </tr>

          </thead>

          <tbody>

            {inventory.map((item) => (

              <tr
    key={item.id}
    className={`border-t hover:bg-blue-50 transition-all duration-300 ${
        item.stock <= 10 ? "bg-red-50" : ""
    }`}
>

                <td className="p-4">
                  {item.product}
                </td>

                <td className="p-4">
                  {item.category}
                </td>

                <td className="p-4">
    <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
            item.stock <= 10
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
        }`}
    >
        {item.stock}
    </span>
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

<td className="p-4">
{item.gst}%
</td>

<td className="p-4">

<div className="flex gap-2 justify-center">

<button

onClick={()=>{

setSelectedProduct(item);

setShowStockModal(true);

}}

className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"

>

Update

</button>

<button
    onClick={() => {
        setSelectedEditProduct(item);
        setShowEditModal(true);
    }}
    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg"
>
    Edit
</button>

<button
    onClick={async () => {

        const confirmDelete = window.confirm(
            `Delete "${item.product}"?`
        );

        if (!confirmDelete) return;

        try {

            await deleteProduct(item.id);

            await loadProducts();

            toast.success("Product deleted");

        } catch (err) {

            console.error(err);

            alert("Delete failed.");

        }

    }}
    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
>
    Delete
</button>

</div>

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
      </AnimatedCard>

      <AnimatedCard index={3}>

<div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <div className="flex justify-between items-center mb-5">

    <div>

        <h2 className="text-2xl font-bold">
Import Inventory (Optional)
</h2>

<p className="text-gray-500 mt-2 mb-5">
Bulk upload products using an Excel sheet.
</p>

    </div>

</div>

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
            : "Import Excel"}
        </AnimatedButton>

      </div>
      </AnimatedCard>

        </div>

        </div>

        <AddProductModal
    open={showAddProduct}
    onClose={() => setShowAddProduct(false)}
    onSave={async (formData) => {

        try {

            const payload = {

                product: formData.product,

                category: formData.category,

                stock: Number(formData.stock),

                unit: formData.unit,

                hsn: formData.hsn,

                gst: Number(formData.gst),

                price: Number(formData.price)

            };

            console.log("Sending:", payload);

            await addProduct(payload);

            await loadProducts();

            setShowAddProduct(false);

            toast.success("Product added successfully");

        } catch (err) {

            console.error(err);

            console.error(err.response?.data);

            alert(err.response?.data?.message || err.message);

        }

    }}
/>

<UpdateStockModal

open={showStockModal}

product={selectedProduct}

onClose={()=>setShowStockModal(false)}

onSave={async(stock)=>{

try{

await updateStock(

selectedProduct.id,

stock

);

await loadProducts();

setShowStockModal(false);

toast.success("Stock updated");

}

catch(err){

console.log(err);

toast.error("Operation failed");

}

}}

/>

<EditProductModal
    open={showEditModal}
    product={selectedEditProduct}
    onClose={() => setShowEditModal(false)}
    onSave={async (formData) => {
        try {

            await updateProduct(
                selectedEditProduct.id,
                formData
            );

            await loadProducts();

            setShowEditModal(false);

            toast.success("Product updated");

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to update product."
            );

        }
    }}
/>

</AnimatedPage>
);
}