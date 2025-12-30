import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api"; // Đảm bảo đường dẫn import api đúng

export default function FilmManagement() {
  const [films, setFilms] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // 1. LẤY DANH SÁCH PHIM
  const fetchFilms = async (searchName = "") => {
    try {
      const url = searchName.trim()
        ? `/QuanLyPhim/LayDanhSachPhim?maNhom=GP01&tenPhim=${searchName}`
        : `/QuanLyPhim/LayDanhSachPhim?maNhom=GP01`;

      const result = await api.get(url);
      setFilms(result.data.content);
    } catch (error) {
      console.log("Lỗi lấy danh sách phim:", error);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilms(keyword);
  };

  // 2. XÓA PHIM
  const handleDelete = async (maPhim) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này không?")) {
      try {
        // Lấy token từ localStorage (kiểm tra lại key lưu user của bạn)
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const token = user?.accessToken;

        await api.delete(`/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Token bắt buộc khi xóa
          },
        });

        alert("Xóa phim thành công!");
        fetchFilms(); // Load lại danh sách
      } catch (error) {
        console.log(error);
        alert(error.response?.data?.content || "Không thể xóa phim này!");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Quản lý Phim</h3>

      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/films/addnew")}
          className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition font-medium"
        >
          Thêm phim
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2 w-full">
        <input
          type="text"
          placeholder="Nhập tên phim cần tìm..."
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Tìm kiếm
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-600">Mã phim</th>
              <th className="px-6 py-4 font-bold text-gray-600">Hình ảnh</th>
              <th className="px-6 py-4 font-bold text-gray-600">Tên phim</th>
              <th className="px-6 py-4 font-bold text-gray-600">Mô tả</th>
              <th className="px-6 py-4 font-bold text-gray-600 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {films?.map((item) => (
              <tr key={item.maPhim} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-700">{item.maPhim}</td>
                <td className="px-6 py-4">
                  <img
                    src={item.hinhAnh}
                    alt={item.tenPhim}
                    className="w-12 h-16 object-cover rounded shadow-sm border border-gray-200"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.tenPhim}
                </td>
                <td className="px-6 py-4 text-gray-500 max-w-xs truncate overflow-hidden">
                  <span title={item.moTa}>
                    {item.moTa?.length > 50
                      ? item.moTa.substring(0, 50) + "..."
                      : item.moTa}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/films/edit/${item.maPhim}`)
                      }
                      className="text-blue-500 hover:text-blue-700"
                      title="Chỉnh sửa"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.maPhim)}
                      className="text-red-500 hover:text-red-700"
                      title="Xóa"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/showtime/${item.maPhim}/${item.tenPhim}`
                        )
                      }
                      className="text-green-600 hover:bg-green-50 p-2 rounded transition"
                      title="Tạo lịch chiếu"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
