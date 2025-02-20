import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ClientPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "client") {
      navigate("/"); // Chuyển về trang đăng nhập nếu không phải client
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="p-4 max-w-lg mx-auto border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center">Client Panel</h2>
      <p className="text-center">Chào mừng bạn đến khu vực khách hàng!</p>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white p-2 mt-4 rounded"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default ClientPanel;
