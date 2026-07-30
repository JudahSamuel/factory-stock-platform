import { useEffect, useState } from "react";

export default function EditProductModal({
    open,
    product,
    onClose,
    onSave
}) {

    const [form, setForm] = useState({
        product: "",
        category: "",
        stock: 0,
        unit: "",
        hsn: "",
        gst: "",
        price: ""
    });

    useEffect(() => {

        if (product) {

            setForm({

                product: product.product || "",

                category: product.category || "",

                stock: product.stock || 0,

                unit: product.unit || "",

                hsn: product.hsn || "",

                gst: product.gst || "",

                price: product.price || ""

            });

        }

    }, [product]);

    if (!open) return null;

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-[500px] p-8">

                <h2 className="text-2xl font-bold mb-6">
                    Edit Product
                </h2>

                <div className="space-y-4">

                    <input
                        name="product"
                        value={form.product}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                        placeholder="Unit"
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        name="hsn"
                        value={form.hsn}
                        onChange={handleChange}
                        placeholder="HSN"
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        name="gst"
                        value={form.gst}
                        onChange={handleChange}
                        placeholder="GST (%)"
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full border rounded-lg p-3"
                    />

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSave(form)}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>

    );

}