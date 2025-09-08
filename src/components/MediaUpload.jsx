import React, { useState, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import {
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Badge,
} from '../components/ui';
import { 
  FaUpload, 
  FaTrash, 
  FaImage, 
  FaVideo, 
  FaFileAudio, 
  FaFile,
  FaEdit,
  FaDownload,
  FaExternalLinkAlt,
  FaCode,
  FaCopy
} from 'react-icons/fa';

const MediaUpload = ({ 
  onMediaChange, 
  initialMedia = null, 
  allowedTypes = ['image', 'video', 'audio', 'document'],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  className = ''
}) => {
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const fileInputRef = useRef(null);

  const allowedFileTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
    document: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  const getFileTypeFromMime = (mimeType) => {
    for (const [type, mimes] of Object.entries(allowedFileTypes)) {
      if (mimes.includes(mimeType)) return type;
    }
    return 'document';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <FaImage className="w-8 h-8 text-blue-500" />;
      case 'video':
        return <FaVideo className="w-8 h-8 text-purple-500" />;
      case 'audio':
        return <FaFileAudio className="w-8 h-8 text-green-500" />;
      default:
        return <FaFile className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize) {
      alert(`File quá lớn. Kích thước tối đa cho phép: ${formatFileSize(maxFileSize)}`);
      return false;
    }

    // Check file type
    const fileType = getFileTypeFromMime(file.type);
    if (!allowedTypes.includes(fileType)) {
      alert(`Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleFileUpload = useCallback(async (file) => {
    if (!validateFile(file)) return;

    setUploading(true);
    try {
      // Simulate file upload - replace with actual upload logic
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - replace with actual API call
      const mockUrl = URL.createObjectURL(file);
      
      const mediaData = {
        id: Date.now().toString(),
        type: getFileTypeFromMime(file.type),
        name: file.name,
        url: mockUrl,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        description: '',
        alt: '',
      };

      setMedia(mediaData);
      onMediaChange && onMediaChange(mediaData);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Có lỗi xảy ra khi upload file');
    } finally {
      setUploading(false);
    }
  }, [maxFileSize, allowedTypes, onMediaChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDeleteMedia = () => {
    if (media && media.url && media.url.startsWith('blob:')) {
      URL.revokeObjectURL(media.url);
    }
    setMedia(null);
    onMediaChange && onMediaChange(null);
  };

  const handleMediaUpdate = (field, value) => {
    const updatedMedia = { ...media, [field]: value };
    setMedia(updatedMedia);
    onMediaChange && onMediaChange(updatedMedia);
  };

  const handleCodeAdd = () => {
    if (!codeContent.trim()) return;

    const codeMedia = {
      id: Date.now().toString(),
      type: 'code',
      name: `Code Block (${codeLanguage})`,
      content: codeContent,
      language: codeLanguage,
      description: '',
      createdAt: new Date().toISOString(),
    };

    setMedia(codeMedia);
    onMediaChange && onMediaChange(codeMedia);
    setShowCodeEditor(false);
    setCodeContent('');
  };

  const copyCodeToClipboard = () => {
    if (media && media.content) {
      navigator.clipboard.writeText(media.content);
      alert('Code đã được copy vào clipboard');
    }
  };

  const renderMediaPreview = () => {
    if (!media) return null;

    switch (media.type) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={media.url}
              alt={media.alt || media.name}
              className="max-w-full max-h-64 object-contain rounded-lg"
            />
          </div>
        );

      case 'video':
        return (
          <video
            src={media.url}
            controls
            className="max-w-full max-h-64 rounded-lg"
          >
            Trình duyệt không hỗ trợ video
          </video>
        );

      case 'audio':
        return (
          <audio
            src={media.url}
            controls
            className="w-full"
          >
            Trình duyệt không hỗ trợ audio
          </audio>
        );

      case 'code':
        return (
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{media.language}</Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={copyCodeToClipboard}
              >
                <FaCopy className="w-4 h-4" />
              </Button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{media.content}</code>
            </pre>
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            {getFileIcon(media.type)}
            <div className="flex-1">
              <p className="font-medium">{media.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(media.size)} • {media.mimeType}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(media.url, '_blank')}
            >
              <FaExternalLinkAlt className="w-4 h-4" />
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FaUpload className="w-5 h-5 mr-2" />
          Media & Content
        </CardTitle>
        <CardDescription>
          Upload hình ảnh, video, audio hoặc thêm code block cho câu hỏi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!media ? (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Đang upload...</span>
                </div>
              ) : (
                <>
                  <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Kéo thả file vào đây hoặc click để chọn
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Hỗ trợ: {allowedTypes.join(', ')} • Tối đa: {formatFileSize(maxFileSize)}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaUpload className="w-4 h-4 mr-2" />
                    Chọn file
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept={Object.values(allowedFileTypes).flat().join(',')}
                  />
                </>
              )}
            </div>

            {/* Code Editor Option */}
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">hoặc</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCodeEditor(true)}
                className="mt-4"
              >
                <FaCode className="w-4 h-4 mr-2" />
                Thêm Code Block
              </Button>
            </div>

            {/* Code Editor Modal */}
            {showCodeEditor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                  <h3 className="text-lg font-semibold mb-4">Thêm Code Block</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="codeLanguage">Ngôn ngữ</Label>
                      <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                        <option value="">Chọn ngôn ngữ</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="sql">SQL</option>
                        <option value="php">PHP</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="typescript">TypeScript</option>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="codeContent">Code</Label>
                      <Textarea
                        id="codeContent"
                        value={codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        placeholder="Nhập code của bạn..."
                        rows={10}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCodeEditor(false);
                        setCodeContent('');
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCodeAdd}
                      disabled={!codeContent.trim()}
                    >
                      Thêm Code
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Media Preview & Edit */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center">
                {getFileIcon(media.type)}
                <span className="ml-2">{media.name}</span>
              </h4>
              <div className="flex space-x-2">
                {media.type === 'code' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCodeContent(media.content);
                      setCodeLanguage(media.language);
                      setShowCodeEditor(true);
                    }}
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteMedia}
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Media Preview */}
            <div className="border rounded-lg p-4">
              {renderMediaPreview()}
            </div>

            {/* Media Metadata */}
            <div className="space-y-3">
              {media.type === 'image' && (
                <div>
                  <Label htmlFor="alt">Alt text (cho accessibility)</Label>
                  <Input
                    id="alt"
                    value={media.alt || ''}
                    onChange={(e) => handleMediaUpdate('alt', e.target.value)}
                    placeholder="Mô tả ngắn gọn về hình ảnh..."
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={media.description || ''}
                  onChange={(e) => handleMediaUpdate('description', e.target.value)}
                  placeholder="Mô tả chi tiết về nội dung media..."
                  rows={2}
                />
              </div>

              {media.size && (
                <div className="text-sm text-gray-500">
                  Kích thước: {formatFileSize(media.size)}
                  {media.mimeType && ` • Loại: ${media.mimeType}`}
                </div>
              )}
            </div>

            {/* Code Editor Modal for editing */}
            {showCodeEditor && media.type === 'code' && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                  <h3 className="text-lg font-semibold mb-4">Chỉnh sửa Code Block</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="codeLanguage">Ngôn ngữ</Label>
                      <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                        <option value="">Chọn ngôn ngữ</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="sql">SQL</option>
                        <option value="php">PHP</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="typescript">TypeScript</option>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="codeContent">Code</Label>
                      <Textarea
                        id="codeContent"
                        value={codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        placeholder="Nhập code của bạn..."
                        rows={10}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCodeEditor(false);
                        setCodeContent('');
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        const updatedMedia = {
                          ...media,
                          content: codeContent,
                          language: codeLanguage,
                          name: `Code Block (${codeLanguage})`
                        };
                        setMedia(updatedMedia);
                        onMediaChange && onMediaChange(updatedMedia);
                        setShowCodeEditor(false);
                        setCodeContent('');
                      }}
                      disabled={!codeContent.trim()}
                    >
                      Cập nhật
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaUpload;
