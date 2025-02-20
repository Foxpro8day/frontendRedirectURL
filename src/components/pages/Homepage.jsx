import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BCKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");
    if (storedToken && storedRole) {
      storedRole === "admin" ? navigate("/admin") : navigate("/client");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    console.log(API_URL)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.role); // Lưu vai trò người dùng
        setMessage("Đăng nhập thành công!");
        console.log(data);
        data.role === "admin" ? navigate("/admin") : navigate("/dashboard");
      } else {
        setMessage(data.message || "Sai tài khoản hoặc mật khẩu!");
      }
    } catch (error) {
      setMessage("Lỗi kết nối đến server!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Đăng nhập</h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white p-2 mt-2 rounded"
      >
        Đăng nhập
      </button>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default Homepage;
