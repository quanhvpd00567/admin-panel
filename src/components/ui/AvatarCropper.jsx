/**
 * Avatar Cropper Component
 * Advanced avatar upload with cropping functionality
 */

import React, { useState, useRef, useCallback } from 'react';
import { FiUpload, FiRotateCw, FiZoomIn, FiZoomOut, FiMove, FiSave, FiX } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import { showToast } from '../../components/ui/Toast';

const AvatarCropper = ({ isOpen, onClose, onSave, currentAvatar }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB max for cropping)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate cropped image
  const generateCroppedImage = useCallback(async () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        // Set canvas size to desired output size
        const size = 200;
        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Calculate crop dimensions
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        
        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;
        const cropWidth = (canvas.width / zoom) * scaleX;
        const cropHeight = (canvas.height / zoom) * scaleY;

        // Apply transformations
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        
        // Draw the cropped image
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          -size / 2,
          -size / 2,
          size,
          size
        );
        
        ctx.restore();

        // Convert to blob
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setCroppedImage(url);
          resolve(url);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = image;
    });
  }, [image, crop, zoom, rotation]);

  // Handle save
  const handleSave = async () => {
    try {
      setLoading(true);
      const croppedUrl = await generateCroppedImage();
      if (croppedUrl) {
        onSave(croppedUrl);
        showToast.success('Avatar updated successfully!');
        onClose();
      }
    } catch (error) {
      showToast.error('Error processing image');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setImage(null);
    setCroppedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Crop Avatar
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!image ? (
            /* File Upload */
            <div className="text-center py-12">
              <FiUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload an image to crop
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose a high-quality image for the best results
              </p>
              
              <label className="cursor-pointer">
                <Button>
                  <FiUpload className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Supports JPG, PNG, WebP (Max: 5MB)
              </div>
            </div>
          ) : (
            /* Cropping Interface */
            <div className="space-y-6">
              {/* Preview Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Crop Area */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Adjust Image
                  </h3>
                  
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-video">
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Crop preview"
                      className="w-full h-full object-contain"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg) translate(${crop.x}px, ${crop.y}px)`
                      }}
                    />
                    
                    {/* Crop Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-4 border-white border-dashed rounded-full shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Preview
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Large Preview */}
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
                        {croppedImage ? (
                          <img
                            src={croppedImage}
                            alt="Cropped preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Preview
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Small Previews */}
                    <div className="flex justify-center space-x-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600">
                        {croppedImage && (
                          <img
                            src={croppedImage}
                            alt="Small preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600">
                        {croppedImage && (
                          <img
                            src={croppedImage}
                            alt="Tiny preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Adjust Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Zoom Control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Zoom: {zoom.toFixed(1)}x
                    </label>
                    <div className="flex items-center space-x-2">
                      <FiZoomOut className="w-4 h-4 text-gray-400" />
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <FiZoomIn className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Rotation Control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rotation: {rotation}°
                    </label>
                    <div className="flex items-center space-x-2">
                      <FiRotateCw className="w-4 h-4 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">{rotation}°</span>
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={crop.x}
                        onChange={(e) => setCrop(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={crop.y}
                        onChange={(e) => setCrop(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => generateCroppedImage()}
                  >
                    Update Preview
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                      setRotation(0);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRotation(prev => prev + 90)}
                  >
                    <FiRotateCw className="w-4 h-4 mr-1" />
                    Rotate
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {image && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={loading}
              disabled={!croppedImage}
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Avatar
            </Button>
          </div>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default AvatarCropper;
