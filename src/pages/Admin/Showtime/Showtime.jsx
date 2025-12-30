import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, DatePicker, InputNumber, Select, Button, message } from "antd";
import dayjs from "dayjs";
import { api } from "../../../services/api"; // Đảm bảo đường dẫn đúng tới file cấu hình api của bạn

export default function Showtime() {
  const { id } = useParams(); // Lấy mã phim từ URL
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // State lưu dữ liệu
  const [movieDetail, setMovieDetail] = useState(null);
  const [heThongRap, setHeThongRap] = useState([]);
  const [cumRap, setCumRap] = useState([]);

  // --- 1. GỌI API LẤY THÔNG TIN BAN ĐẦU ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song: Lấy chi tiết phim & Lấy danh sách hệ thống rạp
        const [movieRes, heThongRes] = await Promise.all([
          api.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`),
          api.get("/QuanLyRap/LayThongTinHeThongRap"),
        ]);

        setMovieDetail(movieRes.data.content);
        setHeThongRap(heThongRes.data.content);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, [id]);

  // --- 2. XỬ LÝ KHI CHỌN HỆ THỐNG RẠP ---
  const handleChangeHeThongRap = async (value) => {
    // Reset ô Cụm rạp khi đổi Hệ thống rạp
    form.setFieldsValue({ maCumRap: null });

    try {
      const result = await api.get(
        `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${value}`
      );
      setCumRap(result.data.content);
    } catch (error) {
      console.error("Lỗi lấy cụm rạp:", error);
    }
  };

  // --- 3. XỬ LÝ SUBMIT (TẠO LỊCH CHIẾU) ---
  const onFinish = async (values) => {
    try {
      // 1. Tìm cụm rạp đã chọn trong danh sách
      const selectedCum = cumRap.find((c) => c.maCumRap === values.maCumRap);

      // 2. Lấy mã rạp (phòng chiếu) đầu tiên
      // Lưu ý: Đôi khi rạp đầu tiên bị lỗi, nên ta thử log ra kiểm tra
      const maRapChinhXac = selectedCum?.danhSachRap?.[0]?.maRap;

      if (!maRapChinhXac) {
        message.error("Không tìm thấy phòng chiếu trong cụm rạp này!");
        return;
      }

      // 3. Chuẩn bị dữ liệu gửi đi (ÉP KIỂU VỀ SỐ)
      const dataSubmit = {
        maPhim: parseInt(id), // Chuyển chuỗi ID từ URL thành số
        ngayChieuGioChieu: dayjs(values.ngayChieuGio).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        maRap: parseInt(maRapChinhXac), // Chuyển mã rạp thành số (quan trọng)
        giaVe: parseInt(values.giaVe), // Chuyển giá vé thành số
      };

      console.log("Dữ liệu gửi đi:", dataSubmit); // F12 để xem log này

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.accessToken;

      await api.post("/QuanLyDatVe/TaoLichChieu", dataSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Tạo lịch chiếu thành công!");
      navigate("/admin/films");
    } catch (error) {
      console.error(error);
      // Hiển thị lỗi chi tiết
      message.error(
        error.response?.data?.content || "Tạo lịch chiếu thất bại!"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h3 className="text-2xl font-bold mb-8 text-gray-800">
        Tạo lịch chiếu -{" "}
        <span className="text-blue-600">{movieDetail?.tenPhim}</span>
      </h3>

      <div className="flex flex-col md:flex-row gap-10">
        {/* CỘT TRÁI: HÌNH ẢNH POSTER */}
        <div className="w-full md:w-1/3 flex justify-center items-start">
          {movieDetail ? (
            <img
              src={movieDetail.hinhAnh}
              alt={movieDetail.tenPhim}
              className="w-full h-auto rounded-lg shadow-md object-cover"
              style={{ minHeight: "350px", maxHeight: "450px" }}
            />
          ) : (
            <div className="w-full h-80 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Loading...
            </div>
          )}
        </div>

        {/* CỘT PHẢI: FORM NHẬP LIỆU */}
        <div className="w-full md:w-2/3">
          <Form
            form={form}
            name="showtime_form"
            labelCol={{ span: 8 }} // Nhãn chiếm 8 phần
            wrapperCol={{ span: 16 }} // Input chiếm 16 phần
            onFinish={onFinish}
            initialValues={{ giaVe: 75000 }}
            size="large"
            labelAlign="left" // Canh lề trái cho nhãn
          >
            <Form.Item
              label={<span className="font-semibold">Hệ thống rạp</span>}
              name="heThongRap"
              rules={[
                { required: true, message: "Vui lòng chọn hệ thống rạp!" },
              ]}
            >
              <Select
                placeholder="Chọn hệ thống rạp"
                onChange={handleChangeHeThongRap}
                options={heThongRap.map((ht) => ({
                  label: ht.tenHeThongRap,
                  value: ht.maHeThongRap,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Cụm rạp</span>}
              name="maCumRap"
              rules={[{ required: true, message: "Vui lòng chọn cụm rạp!" }]}
            >
              <Select
                placeholder="Chọn cụm rạp"
                disabled={!cumRap.length}
                options={cumRap.map((cr) => ({
                  label: cr.tenCumRap,
                  value: cr.maCumRap,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-semibold">Ngày chiếu giờ chiếu</span>
              }
              name="ngayChieuGio"
              rules={[{ required: true, message: "Vui lòng chọn ngày giờ!" }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                className="w-full"
                placeholder="Chọn ngày và giờ"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Giá vé</span>}
              name="giaVe"
              rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
            >
              <InputNumber
                className="w-full"
                min={75000}
                step={5000}
                // CÁCH 1: Hiển thị chữ VNĐ ngay bên trong số tiền
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VNĐ"
                }
                parser={(value) => value.replace(/\s?VNĐ|(,*)/g, "")}
                // XÓA DÒNG NÀY ĐI: addonAfter="VNĐ"
              />
            </Form.Item>

            {/* Phần nút bấm chức năng */}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 -ml-24 w-24 text-right inline-block mr-6">
                  Chức năng:
                </span>

                <Button
                  type="default"
                  htmlType="submit"
                  className="border-gray-300 shadow-sm hover:border-blue-500 hover:text-blue-500"
                >
                  Tạo lịch chiếu
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
