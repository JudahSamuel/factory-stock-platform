export default function OrderStatus({ status }) {

    const styles = {

        Pending:
            "bg-yellow-100 text-yellow-700",

        Processing:
            "bg-blue-100 text-blue-700",

        Shipped:
            "bg-purple-100 text-purple-700",

        Delivered:
            "bg-green-100 text-green-700",

        Cancelled:
            "bg-red-100 text-red-700",

    };

    return (

        <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}
        >

            {status}

        </span>

    );

}