import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { email, password });
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert("Error registering");
    }
  };

  const login = () => {
    // ✅ Use navigate for redirection
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md p-6 rounded-lg"
      >
        <h2 className="text-2xl mb-4">Register</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex flex-col gap-4">
          <button className="bg-blue-500 text-white w-full py-2">
            Register
          </button>
          <button onClick={login} className="bg-red-500 text-white w-full py-2">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
