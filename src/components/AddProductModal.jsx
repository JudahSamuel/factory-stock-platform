import { useState } from "react";

export default function AddProductModal({
    open,
    onClose,
    onSave
}) {
    const [form, setForm] = useState({
        product: "",
        category: "",
        stock: "",
        unit: "",
        hsn: "",
        gst: "",
        price: ""
    });

    if (!open) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-8 w-[500px]">

                <h2 className="text-2xl font-bold mb-6">
                    Add Product
                </h2>

                <div className="grid gap-4">

                    <input
                        name="product"
                        placeholder="Product Name"
                        className="border rounded p-3"
                        onChange={handleChange}
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        className="border rounded p-3"
                        onChange={handleChange}
                    />

                    <input
                        name="stock"
                        placeholder="Stock"
                        className="border rounded p-3"
                        onChange={handleChange}
                    />

                    <input
                        name="unit"
                        placeholder="Unit"
                        className="border rounded p-3"
                        onChange={handleChange}
                    />

                    <input
                        name="hsn"
                        placeholder="HSN"
                        className="border rounded p-3"
                        onChange={handleChange}
                    />

                    <input
                        name="gst"
                        placeholder="GST %"
                        className="border rounded p-3"
                        onChange={handleChange}
                    />

                    <input
                        name="price"
                        placeholder="Price"
                        className="border rounded p-3"
                        onChange={handleChange}
                    />

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSave(form)}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>
    );
}