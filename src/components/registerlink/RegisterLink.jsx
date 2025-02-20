import { useState } from "react";

const RegisterLink = ({ token, fetchLinks }) => {
  const [shortCode, setShortCode] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_BCKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!shortCode || !targetUrl) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          short_code: shortCode,
          target_url: targetUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Link rút gọn: 8dslink.com/${shortCode}`);
        setShortCode("");
        setTargetUrl("");
        // ✅ Refresh lại danh sách link sau khi tạo thành công
        fetchLinks();
      } else {
        setMessage(`❌ Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi request:", error);
      setMessage("❌ Không thể kết nối tới server!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Tạo Link Rút Gọn</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập short code (VD: google)"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
        <input
          type="url"
          placeholder="Nhập link gốc (VD: https://google.com)"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 mt-2 rounded"
        >
          Tạo Link
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default RegisterLink;
