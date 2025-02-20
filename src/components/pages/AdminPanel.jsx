import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterLink from "../registerlink/RegisterLink";

const AdminPanel = () => {
  const [links, setLinks] = useState([]);
  const [token, setToken] = useState("");
  const API_URL = process.env.REACT_APP_BCKEND_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedRole = localStorage.getItem("userRole");

    if (!savedToken || savedRole !== "admin") {
      navigate("/"); // Chuyển về trang đăng nhập nếu không phải admin
    } else {
      setToken(savedToken);
      fetchLinks(savedToken);
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log("🔴 Đang đăng xuất...");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
    window.location.reload(); // Xóa cache và reload trang
  };

  const fetchLinks = async (token) => {
    try {
      console.log("📡 Gửi request tới backend..."); // Debug log

      const response = await fetch(`${API_URL}/links`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Kiểm tra nếu API trả về lỗi (404, 401, 500, ...)
      if (!response.ok) {
        console.error(`❌ Lỗi HTTP ${response.status}:`, response.statusText);
        if (response.status === 401) {
          console.log("🔑 Token đã hết hạn, đăng xuất...");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          window.location.href = "/"; // Chuyển về trang đăng nhập
        }
        // Kiểm tra nếu phản hồi là JSON hay không
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("❌ Chi tiết lỗi từ API:", errorData);
        } else {
          const errorText = await response.text();
          console.error("❌ Phản hồi từ server không phải JSON:", errorText);
        }
        return;
      }

      // Nếu phản hồi là JSON, parse nó
      const data = await response.json();
      console.log("🔥 Dữ liệu từ backend:", data);

      setLinks(data.links || []); // Tránh lỗi nếu `data.links` không tồn tại
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách link:", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto border rounded-lg shadow-lg">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 mt-2 rounded"
      >
        Đăng xuất
      </button>
      <h2 className="text-xl font-bold text-center">
        Admin Panel - Danh sách các link
      </h2>
      <RegisterLink token={token} fetchLinks={() => fetchLinks(token)} />
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">URLId</th>
            <th className="border p-2">Short Code</th>
            <th className="border p-2">Target URL</th>
            <th className="border p-2">UserId</th>
          </tr>
        </thead>
        <tbody>
          {links.length > 0 ? (
            links.map((link, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{link.urlId}</td>
                <td className="border p-2">{link.short_code}</td>
                <td className="border p-2">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.target_url}
                  </a>
                </td>
                <td className="border p-2">{link.userId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center p-4">
                Không có link nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
