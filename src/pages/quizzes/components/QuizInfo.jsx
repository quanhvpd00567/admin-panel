import React from 'react';
import Card from '../../../components/ui/Card';
import { FaEye } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { getClassByCode } from '../../../constants/classes';

const QuizInfo = ({ quiz, totalPoints, showQRCode, setShowQRCode }) => {
  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">{quiz.title}</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
          Mô tả
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          rows="4"
          value={quiz.description || 'Không có mô tả'}
          readOnly
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
          Tổng điểm: <span className="text-red-500">{totalPoints || 0}</span>
        </label>
      </div>
      <div className="grid grid-cols-6 gap-3 text-left">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Lớp
          </label>
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-300 text-left">
            {getClassByCode(quiz.class)?.name || quiz.class}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Thời gian làm bài
          </label>
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-300 text-left">{quiz.timeLimit} phút</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Ngày tạo
          </label>
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-300 text-left">
            {quiz.createdAt
              ? format(new Date(quiz.createdAt), 'dd/MM/yyyy HH:mm')
              : 'Không xác định'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Có mã QR
          </label>
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-300 text-left">
            {quiz.isQrCode ? (
              <span className="text-green-600">Có</span>
            ) : (
              <span className="text-red-600">Không</span>
            )}
          </p>
        </div>
        {quiz.isQrCode && (
          <>
            <div className="mt-4 flex">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                Mã QR
              </label>
              <FaEye
                onClick={() => setShowQRCode((prev) => !prev)}
                className="cursor-pointer text-green-500"
              />
            </div>
            {quiz.dataQrCode && showQRCode && (
              <div className="flex justify-center mt-4">
                <div className="p-4 border-2 border-gray-300 dark:border-gray-700 rounded-md">
                  <QRCode value={quiz.dataQrCode} size={128} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default QuizInfo;
