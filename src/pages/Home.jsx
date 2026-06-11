import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px"
      }}
    >
      <h1>Factory Stock Platform</h1>

      <Link to="/factory-login">
        <button>Factory Login</button>
      </Link>

      <Link to="/merchant-login">
        <button>Merchant Login</button>
      </Link>

      <Link to="/admin-login">
        <button>Admin Login</button>
      </Link>
    </div>
  );
}