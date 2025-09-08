/**
 * SubjectForm Component
 * Shared form component for creating and editing subjects
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiBook, FiTag, FiSave, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { FaPalette } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import ClassSelector from '../../../components/ui/ClassSelector';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { showToast } from '../../../components/ui/Toast';
import { subjectAPI } from '../../../services/subjectAPI';
import { ROUTES } from '../../../constants/routes';
import { getClassesByCodes, getClassByCode } from '../../../constants/classes';

// Predefined colors for subjects
const subjectColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE',
  '#FD79A8', '#E17055', '#00B894', '#00CEC9', '#6C5CE8'
];

// Common subject icons
const subjectIcons = [
  { value: 'FaBook', label: '📚 Book' },
  { value: 'FaCalculator', label: '🧮 Calculator' },
  { value: 'FaLaptopCode', label: '💻 Code' },
  { value: 'FaAtom', label: '⚛️ Atom' },
  { value: 'FaFlask', label: '🧪 Flask' },
  { value: 'FaGlobe', label: '🌍 Globe' },
  { value: 'FaLanguage', label: '🗣️ Language' },
  { value: 'FaPaintBrush', label: '🎨 Art' },
  { value: 'FaMusic', label: '🎵 Music' },
  { value: 'FaRunning', label: '🏃 Sports' },
  { value: 'FaHistory', label: '📜 History' },
  { value: 'FaMicroscope', label: '🔬 Science' },
];

const SubjectForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = mode === 'edit' && id;

  const [loading, setLoading] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState(isEditMode);
  const [subject, setSubject] = useState(null);
  const [selectedColor, setSelectedColor] = useState(subjectColors[0]);
  const [selectedIcon, setSelectedIcon] = useState('FaBook');
  const [selectedClass, setSelectedClass] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      code: '',
      description: '',
      isActive: true,
      class: null,
    },
  });

  // Watch form values
  const nameValue = watch('name');
  const descriptionValue = watch('description');
  const codeValue = watch('code');

  // Load subject data for edit mode
  useEffect(() => {
    if (!isEditMode) {
      setLoadingSubject(false);
      return;
    }

    const loadSubject = async () => {
      try {
        setLoadingSubject(true);
        const response = await subjectAPI.getSubject(id);
        
        if (response.success) {
          const subjectData = response.data.subject;
          setSubject(subjectData);
          
          // Populate form with existing data
          reset({
            name: subjectData.name || '',
            code: subjectData.code || '',
            description: subjectData.description || '',
            isActive: subjectData.isActive !== undefined ? subjectData.isActive : true,
            class: subjectData.class || null,
          });
          
          // Set color, icon, and class
          setSelectedColor(subjectData.color || subjectColors[0]);
          setSelectedIcon(subjectData.icon || 'FaBook');
          setSelectedClass(subjectData.class || null);
        } else {
          throw new Error(response.error || 'Failed to load subject');
        }
      } catch (err) {
        console.error('Load subject error:', err);
        showToast.error('Failed to load subject details');
        navigate(ROUTES.SUBJECTS);
      } finally {
        setLoadingSubject(false);
      }
    };

    loadSubject();
  }, [id, isEditMode, reset, navigate]);

  // Auto-generate code from name (only for create mode or if code is empty)
  // useEffect(() => {
  //   if (nameValue && (!isEditMode || !codeValue)) {
  //     const generatedCode = nameValue
  //       .toUpperCase()
  //       .replace(/[^A-Z0-9\s]/g, '')
  //       .replace(/\s+/g, '')
  //       .substring(0, 10);
  //     setValue('code', generatedCode);
  //   }
  // }, [nameValue, setValue, isEditMode, codeValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const subjectData = {
        ...data,
        color: selectedColor,
        icon: selectedIcon,
        class: selectedClass,
      };

      let response;
      if (isEditMode) {
        response = await subjectAPI.updateSubject(id, subjectData);
      } else {
        response = await subjectAPI.createSubject(subjectData);
      }

      if (response.success) {
        showToast.success(
          `Subject ${isEditMode ? 'updated' : 'created'} successfully!`
        );
        // Navigate back to subjects list
        navigate(ROUTES.SUBJECTS);
      } else {
        // Handle validation errors
        if (response.errors && Array.isArray(response.errors)) {
          response.errors.forEach(error => {
            showToast.error(`${error.field}: ${error.message}`);
          });
        } 
        // Handle backend errors with specific error structure
        else if (response.error) {
          showToast.error(response.error);
        }
        // Fallback error message
        else {
          showToast.error(`Failed to ${isEditMode ? 'update' : 'create'} subject`);
        }
      }
    } catch (err) {
      console.error(`${isEditMode ? 'Update' : 'Create'} subject error:`, err);
      
      // Handle network errors or unexpected errors
      if (err.response?.data?.message) {
        showToast.error(err.response.data.message);
      } else if (err.message) {
        showToast.error(err.message);
      } else {
        showToast.error(`Failed to ${isEditMode ? 'update' : 'create'} subject. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle icon selection
  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
  };

  // Handle class selection
  const handleClassSelection = (classCode) => {
    setSelectedClass(classCode);
    setValue('class', classCode, { shouldValidate: true });
  };

  // Reset form to original values (edit mode only)
  const handleReset = () => {
    if (isEditMode && subject) {
      reset({
        name: subject.name || '',
        code: subject.code || '',
        description: subject.description || '',
        isActive: subject.isActive !== undefined ? subject.isActive : true,
        class: subject.class || null,
      });
      setSelectedColor(subject.color || subjectColors[0]);
      setSelectedIcon(subject.icon || 'FaBook');
      setSelectedClass(subject.class || null);
    } else {
      // Create mode reset
      reset({
        name: '',
        code: '',
        description: '',
        isActive: true,
        class: null,
      });
      setSelectedColor(subjectColors[0]);
      setSelectedIcon('FaBook');
      setSelectedClass(null);
    }
  };

  // Loading state for subject data
  if (loadingSubject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Subject not found (edit mode only)
  if (isEditMode && !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Subject Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The subject you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="primary" onClick={() => navigate(ROUTES.SUBJECTS)}>
            Back to Subjects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.SUBJECTS)}
            className="flex items-center"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Subject' : 'Create Subject'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isEditMode 
                ? 'Update subject information and settings'
                : 'Add a new subject to the curriculum'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject Name *
                    </label>
                    <Input
                      {...register('name', {
                        required: 'Subject name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                      placeholder="Enter subject name"
                      error={errors.name?.message}
                      icon={<FiBook className="h-4 w-4" />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject Code *
                    </label>
                    <Input
                      {...register('code', {
                        required: 'Subject code is required',
                        pattern: {
                          value: /^[A-Z0-9_]+$/,
                          message: 'Code must contain only uppercase letters, numbers, and underscores',
                        },
                        maxLength: {
                          value: 10,
                          message: 'Code must be at most 10 characters',
                        },
                      })}
                      placeholder="MATH101"
                      error={errors.code?.message}
                      icon={<FiTag className="h-4 w-4" />}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <TextArea
                    {...register('description')}
                    placeholder="Enter subject description (optional)"
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {descriptionValue?.length || 0}/500 characters
                  </p>
                </div>
              </div>

              {/* Class Assignment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Class Assignment
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Class
                  </label>
                  <ClassSelector
                    value={selectedClass}
                    onChange={handleClassSelection}
                    placeholder="Choose a class for this subject..."
                    multiple={false}
                    groupedView={true}
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Select which class will have access to this subject.
                  </p>
                </div>
              </div>

              {/* Appearance */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Appearance
                </h3>
                
                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Subject Color
                  </label>
                  
                  {/* Predefined Colors */}
                  <div className="grid grid-cols-10 gap-2 mb-4">
                    {subjectColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-gray-900 dark:border-white scale-110'
                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Custom Color Picker */}
                  <div className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <label htmlFor="colorPicker" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Custom Color:
                    </label>
                    <input
                      id="colorPicker"
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorSelect(e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      title="Choose custom color"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedColor}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center space-x-2">
                    <FaPalette className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Selected: {selectedColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Icon
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Subject Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {subjectIcons.map((icon) => (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => handleIconSelect(icon.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          selectedIcon === icon.value
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        title={icon.label}
                      >
                        <span className="text-lg">{icon.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Selected: {subjectIcons.find(icon => icon.value === selectedIcon)?.label || 'Book'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Status
                </h3>
                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active (subject will be visible to students)
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.SUBJECTS)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!isValid || loading}
                  className="flex items-center"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : isEditMode ? (
                    <FiSave className="mr-2 h-4 w-4" />
                  ) : (
                    <FiPlus className="mr-2 h-4 w-4" />
                  )}
                  {loading 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? 'Update Subject' : 'Create Subject')
                  }
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Live Preview Card */}
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Preview
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">How your subject will appear</p>
              </div>
              
              {/* Subject Card Preview */}
              <div className="p-4">
                <div className="relative rounded-xl overflow-hidden shadow-lg transform transition-transform duration-200">
                  {/* Gradient Header with color and icon */}
                  <div
                    className="h-10 flex items-center justify-center relative"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}dd)`,
                      boxShadow: `0 4px 20px ${selectedColor}30`
                    }}
                  >
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-1 right-1 w-8 h-8 rounded-full border border-white"></div>
                      <div className="absolute bottom-1 left-1 w-4 h-4 rounded-full border border-white"></div>
                      <div className="absolute top-1/3 left-1/5 w-2 h-2 rounded-full bg-white"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                          {nameValue || 'Subject Name'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {codeValue || 'CODE'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                        watch('isActive') 
                          ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
                          : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                      }`}>
                        {watch('isActive') ? '✓ Active' : '⨯ Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {descriptionValue || 'No description provided yet. Add a description to help students understand what this subject covers.'}
                    </p>

                    {/* Color and Icon indicators */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                      {/* Color Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: selectedColor }}
                          ></div>
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Color</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {selectedColor}
                        </span>
                      </div>

                      {/* Icon Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <span className="text-sm">
                              {subjectIcons.find(icon => icon.value === selectedIcon)?.label.split(' ')[0] || '📚'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Icon</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {subjectIcons.find(icon => icon.value === selectedIcon)?.label.split(' ').slice(1).join(' ') || 'Book'}
                        </span>
                      </div>

                      {/* Class Section */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <span className="text-sm">🏫</span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Class</span>
                        </div>
                        <div className="flex-1 ml-4">
                          {selectedClass ? (
                            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded">
                              {getClassByCode(selectedClass)?.name || selectedClass}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">No class selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Subject Stats (Edit mode only) */}
            {isEditMode && subject && (
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Statistics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {subject.totalStudents || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Students</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {subject.totalCourses || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Courses</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{subject.createdAt ? new Date(subject.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span>{subject.updatedAt ? new Date(subject.updatedAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={handleReset}
                >
                  <FiRefreshCw className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Reset Changes' : 'Clear Form'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => navigate(ROUTES.SUBJECTS)}
                >
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectForm;
