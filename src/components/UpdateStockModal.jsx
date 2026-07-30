import { useState, useEffect } from "react";

export default function UpdateStockModal({

    open,

    product,

    onClose,

    onSave

}) {

    const [stock, setStock] = useState("");

    useEffect(() => {

        if (product) {

            setStock(product.stock);

        }

    }, [product]);

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white p-8 rounded-xl w-[420px]">

                <h2 className="text-2xl font-bold mb-6">

                    Update Stock

                </h2>

                <p className="mb-4">

                    <strong>Product:</strong> {product.product}

                </p>

                <input

                    type="number"

                    value={stock}

                    onChange={(e)=>setStock(e.target.value)}

                    className="border rounded-lg p-3 w-full"

                />

                <div className="flex justify-end gap-3 mt-6">

                    <button

                        onClick={onClose}

                        className="border px-5 py-2 rounded"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={()=>onSave(stock)}

                        className="bg-blue-600 text-white px-5 py-2 rounded"

                    >

                        Update

                    </button>

                </div>

            </div>

        </div>

    );

}