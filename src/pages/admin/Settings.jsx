import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaCog, FaSave, FaUndo } from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Cài đặt</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'general'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('general')}
        >
          Cài đặt chung
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'security'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Bảo mật
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'preferences'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          Cài đặt cá nhân
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Cài đặt chung</h2>
          <div className="space-y-4">
            {/* Tên hệ thống */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Tên hệ thống
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập tên hệ thống"
              />
            </div>

            {/* Email liên hệ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Email liên hệ
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập email liên hệ"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Số điện thoại
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              <FaUndo className="mr-2" />
              Đặt lại
            </Button>
            <Button
              variant="primary"
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
            >
              <FaSave className="mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Bảo mật</h2>
          <div className="space-y-4">
            {/* Mật khẩu hiện tại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              <FaUndo className="mr-2" />
              Đặt lại
            </Button>
            <Button
              variant="primary"
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
            >
              <FaSave className="mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Cài đặt cá nhân</h2>
          <div className="space-y-4">
            {/* Ngôn ngữ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Ngôn ngữ
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                defaultValue="en"
              >
                <option value="en">Tiếng Anh</option>
                <option value="vi">Tiếng Việt</option>
                <option value="es">Tiếng Tây Ban Nha</option>
                <option value="fr">Tiếng Pháp</option>
                <option value="de">Tiếng Đức</option>
                <option value="ja">Tiếng Nhật</option>
                <option value="ko">Tiếng Hàn</option>
                <option value="zh">Tiếng Trung</option>
              </select>
            </div>

            {/* Múi giờ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Múi giờ
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                defaultValue="UTC"
              >
                <option value="UTC">UTC</option>
                <option value="GMT">GMT</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="CST">CST (Central Standard Time)</option>
                <option value="JST">JST (Japan Standard Time)</option>
                <option value="IST">IST (India Standard Time)</option>
              </select>
            </div>

            {/* Thông báo qua email */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                defaultChecked
              />
              <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Nhận thông báo qua email
              </label>
            </div>

            {/* Giao diện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Giao diện
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                defaultValue="light"
              >
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
                <option value="auto">Tự động</option>
              </select>
            </div>

            {/* Telegram ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Telegram ID
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập Telegram ID"
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              <FaUndo className="mr-2" />
              Đặt lại
            </Button>
            <Button
              variant="primary"
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
            >
              <FaSave className="mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;
