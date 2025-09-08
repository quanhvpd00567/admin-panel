import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilePdf, FaFileWord, FaFileCode, FaSave, FaArrowLeft, FaLock, FaQrcode, FaCalendarAlt } from 'react-icons/fa'; // Import icons
import quizAPI from '../../../services/quizzes/quizAPI'; // Import quizAPI
import { showToast } from '../../../components/ui';

const Step4 = ({ basic, onBack }) => {
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false); // State for password toggle
  const [password, setPassword] = useState(''); // State for password
  const [isQRCode, setIsQRCode] = useState(false); // State for "Tạo mã QR tối đa"
  const [releaseDate, setReleaseDate] = useState(null); // State for release date
  const [isSaving, setIsSaving] = useState(false); // State for save button loading
  const navigate = useNavigate();

  const handleSaveQuiz = async () => {
    setIsSaving(true); // Set loading state
    try {
      const basicCopy = { ...basic };
      basicCopy.questions = basicCopy.questions.map((q) => q._id || q.id); // Ensure questions are IDs
      basicCopy.maxAttempts = parseInt(basicCopy.maxAttempts) || 0; // Ensure maxAttempts is set
      basicCopy.passingScore = parseInt(basicCopy.passingScore) || 0; // Ensure passingScore is set
      if (isPasswordEnabled) {
        basicCopy.password = password;
      }
      if (isQRCode) {
        basicCopy.isQrCode = true;
      }
      if (releaseDate) {
        basicCopy.releaseDate = releaseDate;
      }
      const response = await quizAPI.createQuiz(basicCopy); // Call createQuiz API
      if (response.success) {
        // redirect to quiz list use navigate
        navigate('/quizzes');
      } else {
        showToast.error(response.message || 'Đã xảy ra lỗi khi lưu bài kiểm tra.');
      }
    } catch (error) {
      showToast.error('Đã xảy ra lỗi khi lưu bài kiểm tra.');
    } finally {
      setIsSaving(false); // Reset loading state
    }
  };

  return (
    <Card title="Bước 4: Xuất bài kiểm tra">
      <div className="space-y-8">
        {/* Thông tin Quiz */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Thông tin bài kiểm tra</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Bạn có thể lưu bài kiểm tra hoặc xuất dưới các định dạng khác nhau.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            disabled
            className="flex items-center justify-center w-full py-3"
          >
            <FaFilePdf className="w-5 h-5 mr-2 text-red-500" />
            Xuất PDF
          </Button>
          <Button
            variant="outline"
            disabled
            className="flex items-center justify-center w-full py-3"
          >
            <FaFileWord className="w-5 h-5 mr-2 text-blue-500" />
            Xuất Word
          </Button>
          <Button
            variant="outline"
            disabled
            className="flex items-center justify-center w-full py-3"
          >
            <FaFileCode className="w-5 h-5 mr-2 text-green-500" />
            Xuất HTML
          </Button>
        </div>

        {/* Security Options */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaLock className="w-5 h-5 mr-2 text-purple-500" />
            Tùy chọn bảo mật
          </h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPasswordEnabled}
                onChange={(e) => setIsPasswordEnabled(e.target.checked)}
                className="mr-2"
              />
              Đặt mật khẩu cho bài kiểm tra
            </label>
            {isPasswordEnabled && (
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* QR Code Generation */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaQrcode className="w-5 h-5 mr-2 text-purple-500" />
            Tạo mã QR
          </h3>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isQRCode}
              onChange={(e) => setIsQRCode(e.target.checked)}
              className="mr-2"
            />
            Tạo mã QR để người dùng truy cập bài kiểm tra với số lượng tối đa
          </label>
        </div>

        {/* Release Date */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaCalendarAlt className="w-5 h-5 mr-2 text-purple-500" />
            Đặt lịch phát hành bài kiểm tra
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Chọn ngày và giờ để bài kiểm tra được phát hành tự động.
          </p>
          <DatePicker
            selected={releaseDate}
            onChange={(date) => {
              const now = new Date();
              const deadline = basic.deadline ? new Date(basic.deadline) : null;

              if (date < now) {
                alert('Ngày phát hành không được nhỏ hơn ngày hiện tại.');
                return;
              }

              if (deadline && date > deadline) {
                alert('Ngày phát hành không được lớn hơn hạn chót.');
                return;
              }

              setReleaseDate(date);
            }}
            placeholderText="Chọn ngày và giờ"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Thời gian"
            dateFormat="dd/MM/yyyy HH:mm"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            minDate={new Date()} // Không cho chọn ngày trước ngày hiện tại
            maxDate={basic.deadline ? new Date(basic.deadline) : null} // Không cho chọn ngày sau deadline
          />
        </div>

        {/* Back and Save Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center px-6 py-2"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveQuiz}
            disabled={isSaving}
            className="flex items-center px-6 py-3"
          >
            {isSaving ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <FaSave className="w-5 h-5 mr-2" />
                Lưu
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Step4;
