import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { api } from "../../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  // 1. LẤY DANH SÁCH NGƯỜI DÙNG
  const fetchUsers = async (searchKey = "") => {
    setLoading(true);
    try {
      const url = searchKey
        ? `/QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=GP01&tuKhoa=${searchKey}`
        : `/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01`;

      const res = await api.get(url);
      setUsers(res.data.content);
    } catch (error) {
      console.log("Lỗi tải danh sách:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. TÌM KIẾM
  const handleSearch = (value) => {
    setKeyword(value);
    fetchUsers(value);
  };

  // 3. XÓA
  const handleDelete = async (taiKhoan) => {
    try {
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).accessToken : "";

      await api.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Xóa thành công!");
      fetchUsers(keyword);
    } catch (error) {
      message.error(error.response?.data?.content || "Không thể xóa!");
    }
  };

  // 4. MỞ MODAL
  const openModal = (user = null) => {
    setIsModalOpen(true);
    if (user) {
      setIsEditMode(true);
      form.setFieldsValue({ ...user, maNhom: "GP01" });
    } else {
      setIsEditMode(false);
      form.resetFields();
      form.setFieldsValue({ maNhom: "GP01", maLoaiNguoiDung: "KhachHang" });
    }
  };

  // 5. SUBMIT FORM
  const onFinish = async (values) => {
    try {
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).accessToken : "";
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditMode) {
        await api.post("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", values, {
          headers,
        });
        message.success("Cập nhật thành công!");
      } else {
        await api.post("/QuanLyNguoiDung/ThemNguoiDung", values, { headers });
        message.success("Thêm người dùng thành công!");
      }

      setIsModalOpen(false);
      fetchUsers(keyword);
    } catch (error) {
      message.error(error.response?.data?.content || "Có lỗi xảy ra!");
    }
  };

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1, align: "center" },
    { title: "Tài khoản", dataIndex: "taiKhoan", fontWeight: "bold" },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      render: (t) => <b className="text-blue-600">{t}</b>,
    },
    { title: "Email", dataIndex: "email" },
    { title: "Số ĐT", dataIndex: "soDt" },
    {
      title: "Loại ND",
      dataIndex: "maLoaiNguoiDung",
      render: (text) => (
        <Tag color={text === "QuanTri" ? "red" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            className="text-blue-500 border-blue-500"
          />
          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDelete(record.taiKhoan)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-3">
          Quản Lý Người Dùng
        </h2>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => openModal(null)}
        >
          Thêm người dùng
        </Button>
      </div>

      <div className="mb-4 w-full md:w-1/2">
        <Input.Search
          placeholder="Tìm tài khoản hoặc họ tên..."
          allowClear
          enterButton={<Button icon={<SearchOutlined />}>Tìm</Button>}
          size="large"
          onSearch={handleSearch}
        />
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="taiKhoan"
        loading={loading}
        bordered
        scroll={{ x: 700 }}
      />

      {/* MODAL FORM */}
      <Modal
        title={isEditMode ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden={true} // <--- ĐÃ SỬA DÒNG NÀY (Thay cho destroyOnClose)
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tài khoản"
            name="taiKhoan"
            rules={[{ required: true }]}
          >
            <Input disabled={isEditMode} placeholder="Nhập tài khoản" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="matKhau"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item label="Họ tên" name="hoTen" rules={[{ required: true }]}>
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="email@gmail.com" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="soDt"
            rules={[{ required: true, pattern: /^[0-9]+$/ }]}
          >
            <Input placeholder="090..." />
          </Form.Item>
          <Form.Item
            label="Loại người dùng"
            name="maLoaiNguoiDung"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="KhachHang">Khách Hàng</Select.Option>
              <Select.Option value="QuanTri">Quản Trị</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="maNhom" hidden>
            <Input />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
