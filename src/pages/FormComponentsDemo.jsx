/**
 * Form Components Demo Page
 * Showcase beautiful form designs
 */

import { useState } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import Input from '../components/ui/Input.jsx';
import TextArea from '../components/ui/TextArea.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

const FormComponentsDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accountType: '',
    description: '',
    password: '',
    search: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = field => e => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.accountType)
      newErrors.accountType = 'Please select an account type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Form Elements
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Beautiful, modern form components with dark mode support.
        </p>
      </div>

      {/* Default Variant Forms */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Default Variant
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Clean and professional form design
          </p>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input with Icon */}
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                leftIcon={<FaUser />}
                required
              />

              {/* Email Input with Icon */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                leftIcon={<FaEnvelope />}
                required
              />

              {/* Phone Input */}
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                leftIcon={<FaPhone />}
                helperText="Include country code"
              />

              {/* Account Type Select */}
              <Select
                label="Account Type"
                value={formData.accountType}
                onChange={handleInputChange('accountType')}
                error={errors.accountType}
                placeholder="Select account type"
                required
              >
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </Select>
            </div>

            {/* Password Input with Toggle */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              leftIcon={<FaLock />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
              helperText="Must be at least 8 characters"
            />

            {/* Description TextArea */}
            <TextArea
              label="Description"
              placeholder="Tell us about yourself..."
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={4}
              helperText="Optional: Provide additional information"
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="lg">
                Create Account
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* Filled Variant */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Filled Variant
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Modern filled background design
          </p>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              variant="filled"
              label="Search"
              type="text"
              placeholder="Search for anything..."
              value={formData.search}
              onChange={handleInputChange('search')}
              leftIcon={<FaSearch />}
            />

            <Select
              variant="filled"
              label="Category"
              placeholder="Select category"
            >
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </Select>
          </div>

          <TextArea
            variant="filled"
            label="Comments"
            placeholder="Share your thoughts..."
            rows={3}
            className="mt-6"
          />
        </Card.Body>
      </Card>

      {/* Outlined Variant */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Outlined Variant
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bold outlined design for emphasis
          </p>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              variant="outlined"
              label="First Name"
              placeholder="John"
              size="lg"
            />

            <Input
              variant="outlined"
              label="Last Name"
              placeholder="Doe"
              size="lg"
            />

            <Select
              variant="outlined"
              label="Country"
              placeholder="Select country"
              size="lg"
            >
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
            </Select>
          </div>
        </Card.Body>
      </Card>

      {/* Size Variants */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Size Variants
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Different sizes for various use cases
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            <Input
              size="sm"
              label="Small Input"
              placeholder="Small size input"
            />

            <Input
              size="md"
              label="Medium Input (Default)"
              placeholder="Medium size input"
            />

            <Input
              size="lg"
              label="Large Input"
              placeholder="Large size input"
            />
          </div>
        </Card.Body>
      </Card>

      {/* Disabled State */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Disabled State
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Form elements in disabled state
          </p>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Disabled Input"
              placeholder="This input is disabled"
              disabled
              value="Jane Doe"
            />

            <Select label="Disabled Select" disabled value="option1">
              <option value="option1">Selected Option</option>
              <option value="option2">Option 2</option>
            </Select>
          </div>

          <TextArea
            label="Disabled TextArea"
            placeholder="This textarea is disabled"
            disabled
            value="This is some disabled content..."
            className="mt-6"
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default FormComponentsDemo;
