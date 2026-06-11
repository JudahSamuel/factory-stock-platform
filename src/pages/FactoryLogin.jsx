import { useNavigate } from "react-router-dom";

export default function FactoryLogin() {

  const navigate = useNavigate();

  return (
    <div style={{ padding: "30px" }}>

      <h1>Factory Login</h1>

      <input placeholder="Email" />

      <br /><br />

      <input
        placeholder="Password"
        type="password"
      />

      <br /><br />

      <button
        onClick={() =>
          navigate("/factory-dashboard")
        }
      >
        Login
      </button>

    </div>
  );
}