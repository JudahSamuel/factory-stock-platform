export default function SearchOrders({

    search,

    setSearch,

    status,

    setStatus,

}) {

    return (

        <div className="bg-white rounded-2xl shadow p-5 mb-8 flex gap-5">

            <input

                type="text"

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                placeholder="Search Invoice / Product..."

                className="border rounded-xl px-4 py-3 flex-1"

            />

            <select

                value={status}

                onChange={(e)=>setStatus(e.target.value)}

                className="border rounded-xl px-4"

            >

                <option>All</option>

                <option>Pending</option>

                <option>Processing</option>

                <option>Shipped</option>

                <option>Delivered</option>

                <option>Cancelled</option>

            </select>

        </div>

    );

}