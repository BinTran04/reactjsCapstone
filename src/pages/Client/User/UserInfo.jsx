import React, { useEffect, useState } from "react";
import { Form, Input, Button, Tabs, Table, Tag, message } from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { api } from "../../../services/api";

export default function UserInfo() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // HÀM LẤY HEADER TOKEN (Giữ nguyên để fix lỗi 401)
  const getHeaders = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      };
    }
    return {};
  };

  // --- 1. LẤY DỮ LIỆU TỪ SERVER ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const result = await api.post(
          "/QuanLyNguoiDung/ThongTinTaiKhoan",
          null,
          getHeaders()
        );

        if (result.data.content) {
          setProfile(result.data.content);
          // LƯU Ý: Không điền form ở đây nữa để tránh lỗi Warning
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
        if (error.response?.status === 401) {
          message.error("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
        }
      } finally {
        setLoading(false); // Tắt loading để Form hiện ra
      }
    };
    fetchUserProfile();
  }, []);

  // --- 2. ĐIỀN DỮ LIỆU VÀO FORM (Chạy sau khi Form đã hiện) ---
  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        ...profile,
        soDt: profile.soDT, // Map dữ liệu chuẩn xác
      });
    }
  }, [profile, form]);

  // --- 3. CẬP NHẬT THÔNG TIN ---
  const onUpdate = async (values) => {
    try {
      if (!profile) return;
      const dataSubmit = {
        taiKhoan: profile.taiKhoan,
        matKhau: values.matKhau,
        email: values.email,
        soDt: values.soDt,
        hoTen: values.hoTen,
        maNhom: profile.maNhom,
        maLoaiNguoiDung: profile.maLoaiNguoiDung,
      };

      await api.put(
        "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        dataSubmit,
        getHeaders()
      );
      message.success("Cập nhật thành công! Vui lòng đăng nhập lại.");
      setTimeout(() => {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      message.error(error.response?.data?.content || "Cập nhật thất bại!");
    }
  };

  // --- BẢNG LỊCH SỬ ---
  const columns = [
    {
      title: <span className="text-gray-400">Mã vé</span>,
      dataIndex: "maVe",
      key: "maVe",
      render: (text) => (
        <span className="text-orange-500 font-bold">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-400">Tên Phim</span>,
      dataIndex: "tenPhim",
      key: "tenPhim",
      render: (text) => (
        <span className="text-white font-medium text-lg">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-400">Ngày đặt</span>,
      dataIndex: "ngayDat",
      key: "ngayDat",
      render: (date) => (
        <span className="text-gray-300">
          {moment(date).format("DD/MM/YYYY - HH:mm")}
        </span>
      ),
    },
    {
      title: <span className="text-gray-400">Rạp chiếu</span>,
      key: "rap",
      render: (_, record) => (
        <div>
          <p className="text-green-400 font-semibold mb-0">
            {record.danhSachGhe[0]?.tenHeThongRap}
          </p>
          <p className="text-xs text-gray-500">
            {record.danhSachGhe[0]?.tenCumRap}
          </p>
        </div>
      ),
    },
    {
      title: <span className="text-gray-400">Số ghế</span>,
      dataIndex: "danhSachGhe",
      key: "soGhe",
      render: (gheList) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {gheList.slice(0, 10).map((ghe, index) => (
            <Tag color="#f50" key={index} className="mr-0 mb-1 border-none">
              {ghe.tenGhe}
            </Tag>
          ))}
          {gheList.length > 10 && <Tag color="default">...</Tag>}
        </div>
      ),
    },
  ];

  // Class style Input
  const inputClass =
    "custom-input bg-gray-800 border-gray-700 text-white placeholder-gray-500 hover:border-orange-500 focus:border-orange-500 hover:bg-gray-700 transition-all duration-300";

  const items = [
    {
      key: "1",
      label: (
        <span className="text-base px-4 font-medium">
          <UserOutlined /> Hồ sơ
        </span>
      ),
      children: (
        <div className="max-w-3xl mx-auto py-8 px-4">
          <Form form={form} layout="vertical" onFinish={onUpdate} size="large">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <Form.Item
                label={
                  <span className="text-gray-400 font-semibold">Tài khoản</span>
                }
                name="taiKhoan"
              >
                <Input
                  prefix={
                    <SafetyCertificateOutlined className="text-gray-500" />
                  }
                  disabled
                  className="bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed hover:border-gray-800"
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-400 font-semibold">Email</span>
                }
                name="email"
                rules={[{ type: "email", required: true }]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-500" />}
                  className={inputClass}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-400 font-semibold">Họ tên</span>
                }
                name="hoTen"
                rules={[{ required: true }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-500" />}
                  className={inputClass}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-400 font-semibold">
                    Số điện thoại
                  </span>
                }
                name="soDt"
                rules={[{ required: true }]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-500" />}
                  className={inputClass}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-400 font-semibold">Mật khẩu</span>
                }
                name="matKhau"
                rules={[{ required: true }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-500" />}
                  className={inputClass}
                />
              </Form.Item>
            </div>
            <div className="text-right mt-8 pt-6 border-t border-gray-800">
              <Button
                type="primary"
                htmlType="submit"
                className="h-12 px-10 text-lg font-bold rounded-lg border-none transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
                style={{
                  background:
                    "linear-gradient(90deg, #ff8c00 0%, #ff4500 100%)",
                  boxShadow: "0 4px 15px rgba(255, 69, 0, 0.4)",
                }}
              >
                CẬP NHẬT
              </Button>
            </div>
            <Form.Item name="maNhom" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="maLoaiNguoiDung" hidden>
              <Input />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="text-base px-4 font-medium">
          <HistoryOutlined /> Lịch sử đặt vé
        </span>
      ),
      children: (
        <div className="py-4">
          <Table
            columns={columns}
            dataSource={profile?.thongTinDatVe || []}
            rowKey="maVe"
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            rowClassName={() =>
              "bg-gray-800 hover:bg-gray-700 transition-colors text-white border-b border-gray-700"
            }
            className="custom-dark-table overflow-hidden rounded-lg"
            locale={{
              emptyText: (
                <div className="text-gray-400 py-10">Bạn chưa đặt vé nào</div>
              ),
            }}
          />
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-orange-500 text-xl font-bold">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white relative font-sans pt-24 pb-10">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 to-black pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer">
            <div className="w-28 h-28 rounded-full border-2 border-orange-500 bg-gray-800 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <span className="text-4xl font-bold text-white">
                {profile?.hoTen?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 text-white tracking-wide">
            {profile?.hoTen}
          </h2>
          <p className="text-gray-400 text-sm mt-1">Thành viên thân thiết</p>
        </div>
        <div className="max-w-4xl mx-auto bg-[#111827] border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <Tabs
            defaultActiveKey="1"
            items={items}
            centered
            className="custom-tabs text-white pt-2"
            tabBarStyle={{ borderBottom: "1px solid #374151", marginBottom: 0 }}
          />
        </div>
      </div>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
            caret-color: white !important;
        }
        .custom-input {
            background-color: #1f2937 !important; color: white !important; border-color: #374151 !important;
        }
        .custom-input:hover, .custom-input:focus {
            border-color: #f97316 !important; background-color: #111827 !important;
        }
        .ant-tabs-tab { color: #9ca3af !important; margin: 12px 0 !important; padding: 12px 24px !important; }
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn { color: #f97316 !important; }
        .ant-tabs-ink-bar { background: #f97316 !important; height: 3px !important; }
        .custom-dark-table .ant-table { background: transparent !important; color: white !important; }
        .custom-dark-table .ant-table-thead > tr > th { background: #1f2937 !important; color: #9ca3af !important; border-bottom: 1px solid #374151 !important; }
        .custom-dark-table .ant-table-tbody > tr > td { border-bottom: 1px solid #374151 !important; }
        .custom-dark-table .ant-table-tbody > tr:hover > td { background: #374151 !important; }
        .ant-pagination-item a { color: white !important; }
        .ant-pagination-item-active { background: #f97316 !important; border-color: #f97316 !important; }
        .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link { color: white !important; }
      `}</style>
    </div>
  );
}
