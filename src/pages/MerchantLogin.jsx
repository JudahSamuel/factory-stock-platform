import { useNavigate } from "react-router-dom";

export default function MerchantLogin() {

  const navigate = useNavigate();

  return (
    <div style={{ padding: "30px" }}>

      <h1>Merchant Login</h1>

      <input placeholder="Email" />

      <br /><br />

      <input
        placeholder="Password"
        type="password"
      />

      <br /><br />

      <button
        onClick={() =>
          navigate("/merchant-dashboard")
        }
      >
        Login
      </button>

    </div>
  );
}