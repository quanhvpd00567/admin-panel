import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import { FaUserCircle } from 'react-icons/fa';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { showToast } from '../../../components/ui';
import { parentAPI } from '../../../services/parentAPI';

const ChildInfoModal = ({ isOpen, onClose, child, isAddNew }) => {


  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      defaultPassword: 'Abc@12345'
    },
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Update form data when `child` changes
  useEffect(() => {
    if (isAddNew) {
      setIsChangingPassword(false);
      reset({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        defaultPassword: 'Abc@12345',
      });
    } else if (child) {
      reset({
        firstName: child.firstName || '',
        lastName: child.lastName || '',
        username: child.username || '',
        email: child.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [isAddNew, child, reset]);

  const onSubmit = async (data) => {
    if (isChangingPassword && data.password !== data.confirmPassword) {
      showToast.error('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }
    let response = null;
    if (isAddNew) {
      data.password = data.defaultPassword; // Set default password for new child
      delete data.confirmPassword;
      delete data.defaultPassword;
      response = await parentAPI.addChild(data);
    } else {
      response = await parentAPI.updateChild(child._id, data);
    }

    if (response.success) {
        showToast.success(isAddNew ? 'Đã thêm con thành công!' : 'Thông tin đã được cập nhật!');
    } else {
      showToast.error(response.error);
    }
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <FaUserCircle className="w-16 h-16 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Chỉnh sửa thông tin
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cập nhật thông tin chi tiết của con.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Họ <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('lastName', { required: 'Họ là bắt buộc' })}
              placeholder="Nhập họ"
              error={errors.lastName?.message}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('firstName', { required: 'Tên là bắt buộc' })}
              placeholder="Nhập tên"
              error={errors.firstName?.message}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('username', { required: 'Tên đăng nhập là bắt buộc' })}
              readOnly={!isAddNew}
              disabled={!isAddNew}
              placeholder="Nhập tên đăng nhập"
              error={errors.username?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email (không bắt buộc)
            </label>
            <Input
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
              placeholder="Nhập email"
              error={errors.email?.message}
            />
          </div>

          {isAddNew && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu mặc định
              </label>
              <Input
                {...register('defaultPassword')}
                type="text"
                readOnly
              />
            </div>
          )}

          {/* Change Password Section */}
          {isChangingPassword && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('password', { required: 'Mật khẩu mới là bắt buộc' })}
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  error={errors.password?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('confirmPassword', { required: 'Xác nhận mật khẩu là bắt buộc' })}
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  error={errors.confirmPassword?.message}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center">
          {!isAddNew && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChangingPassword((prev) => !prev)}
              className="px-6 py-2"
            >
              {isChangingPassword ? 'Hủy đổi mật khẩu' : 'Đổi mật khẩu'}
            </Button>
          )}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6 py-2"
            >
              Lưu
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ChildInfoModal;
