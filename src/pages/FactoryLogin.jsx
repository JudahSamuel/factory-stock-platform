import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";

export default function FactoryLogin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {

    try {

      const role =
        await loginUser(
          email,
          password
        );

      if (
        role === "factory"
      ) {

        navigate(
          "/factory-dashboard"
        );

      } else {

        alert(
          "Not a factory account"
        );

      }

    } catch {

      alert(
        "Login failed"
      );

    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="bg-white p-8 rounded-xl shadow w-[400px]">

        <h1 className="text-3xl font-bold mb-4">
          Factory Login
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
          className="w-full border p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-3 mb-4"
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-3 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
}