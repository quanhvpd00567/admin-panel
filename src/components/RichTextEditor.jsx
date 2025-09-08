import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Badge,
} from '../components/ui';
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaImage,
  FaUndo,
  FaRedo,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaEye,
  FaEdit
} from 'react-icons/fa';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Nhập nội dung...', 
  minHeight = '200px',
  showPreview = false,
  className = ''
}) => {
  const [isPreview, setIsPreview] = useState(showPreview);
  const [selectedText, setSelectedText] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef(null);
  const linkDialogRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (linkDialogRef.current && !linkDialogRef.current.contains(event.target)) {
        setShowLinkDialog(false);
      }
    };

    if (showLinkDialog) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLinkDialog]);

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    setSelectedText(selection.toString());
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      document.execCommand('insertHTML', false, link);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      handleContentChange();
    }
  };

  const insertImage = () => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      const img = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, img);
      handleContentChange();
    }
  };

  const formatCode = () => {
    if (selectedText) {
      const code = `<code style="background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace;">${selectedText}</code>`;
      document.execCommand('insertHTML', false, code);
    } else {
      document.execCommand('formatBlock', false, 'pre');
    }
    handleContentChange();
  };

  const insertTable = () => {
    const rows = prompt('Số hàng:', '3');
    const cols = prompt('Số cột:', '3');
    if (rows && cols) {
      let table = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += i === 0 ? '<th>Header</th>' : '<td>Cell</td>';
        }
        table += '</tr>';
      }
      table += '</table><br>';
      document.execCommand('insertHTML', false, table);
      handleContentChange();
    }
  };

  const formatText = (tag, style = '') => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement(tag);
      if (style) wrapper.style.cssText = style;
      
      try {
        range.surroundContents(wrapper);
        selection.removeAllRanges();
        handleContentChange();
      } catch (e) {
        console.warn('Cannot wrap selection:', e);
      }
    }
  };

  const renderPreview = () => {
    return (
      <div 
        className="prose max-w-none p-4 border rounded-lg min-h-[200px]"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  };

  const toolbarButtons = [
    {
      group: 'format',
      buttons: [
        { icon: FaBold, command: 'bold', title: 'Bold (Ctrl+B)' },
        { icon: FaItalic, command: 'italic', title: 'Italic (Ctrl+I)' },
        { icon: FaUnderline, command: 'underline', title: 'Underline (Ctrl+U)' },
        { icon: FaStrikethrough, command: 'strikeThrough', title: 'Strikethrough' },
      ]
    },
    {
      group: 'align',
      buttons: [
        { icon: FaAlignLeft, command: 'justifyLeft', title: 'Align Left' },
        { icon: FaAlignCenter, command: 'justifyCenter', title: 'Align Center' },
        { icon: FaAlignRight, command: 'justifyRight', title: 'Align Right' },
        { icon: FaAlignJustify, command: 'justifyFull', title: 'Justify' },
      ]
    },
    {
      group: 'list',
      buttons: [
        { icon: FaListUl, command: 'insertUnorderedList', title: 'Bullet List' },
        { icon: FaListOl, command: 'insertOrderedList', title: 'Numbered List' },
        { icon: FaQuoteLeft, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
      ]
    },
    {
      group: 'insert',
      buttons: [
        { icon: FaLink, action: () => setShowLinkDialog(true), title: 'Insert Link' },
        { icon: FaImage, action: insertImage, title: 'Insert Image' },
        { icon: FaCode, action: formatCode, title: 'Code' },
      ]
    },
    {
      group: 'history',
      buttons: [
        { icon: FaUndo, command: 'undo', title: 'Undo (Ctrl+Z)' },
        { icon: FaRedo, command: 'redo', title: 'Redo (Ctrl+Y)' },
      ]
    }
  ];

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center space-x-1 flex-wrap bg-gray-50">
        {/* Format Selector */}
        <select
          onChange={(e) => executeCommand('formatBlock', e.target.value)}
          className="mr-2 px-2 py-1 border rounded text-sm"
          defaultValue=""
        >
          <option value="">Format</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="p">Paragraph</option>
          <option value="pre">Preformatted</option>
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => executeCommand('fontSize', e.target.value)}
          className="mr-2 px-2 py-1 border rounded text-sm"
          defaultValue=""
        >
          <option value="">Size</option>
          <option value="1">8pt</option>
          <option value="2">10pt</option>
          <option value="3">12pt</option>
          <option value="4">14pt</option>
          <option value="5">18pt</option>
          <option value="6">24pt</option>
          <option value="7">36pt</option>
        </select>

        {/* Color */}
        <input
          type="color"
          onChange={(e) => executeCommand('foreColor', e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
          title="Text Color"
        />

        <input
          type="color"
          onChange={(e) => executeCommand('hiliteColor', e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer ml-1"
          title="Background Color"
        />

        <div className="border-l mx-2 h-6"></div>

        {/* Toolbar Button Groups */}
        {toolbarButtons.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            {group.buttons.map((button, buttonIndex) => (
              <Button
                key={buttonIndex}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (button.action) {
                    button.action();
                  } else {
                    executeCommand(button.command, button.value);
                  }
                }}
                title={button.title}
                className="w-8 h-8 p-0"
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
            {groupIndex < toolbarButtons.length - 1 && (
              <div className="border-l mx-2 h-6"></div>
            )}
          </React.Fragment>
        ))}

        <div className="border-l mx-2 h-6"></div>

        {/* Custom Actions */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertTable}
          title="Insert Table"
          className="text-sm px-2"
        >
          Table
        </Button>

        <div className="border-l mx-2 h-6"></div>

        {/* Preview Toggle */}
        <Button
          type="button"
          variant={isPreview ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          title="Toggle Preview"
          className="w-8 h-8 p-0"
        >
          {isPreview ? <FaEdit className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div 
          ref={linkDialogRef}
          className="absolute z-10 bg-white border rounded-lg shadow-lg p-4 mt-2"
          style={{ minWidth: '300px' }}
        >
          <h4 className="font-medium mb-3">Thêm liên kết</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Văn bản hiển thị</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Nhập văn bản..."
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowLinkDialog(false)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={insertLink}
                disabled={!linkUrl || !linkText}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative">
        {isPreview ? (
          renderPreview()
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            className="p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: value }}
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t px-4 py-2 text-xs text-gray-500 bg-gray-50 flex justify-between">
        <div>
          {selectedText && (
            <Badge variant="secondary" className="text-xs">
              {selectedText.length} ký tự được chọn
            </Badge>
          )}
        </div>
        <div>
          {value.length} ký tự
        </div>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        [contenteditable] h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        [contenteditable] h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        [contenteditable] h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; }
        [contenteditable] h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; }
        [contenteditable] h6 { font-size: 0.75em; font-weight: bold; margin: 1.67em 0; }
        
        [contenteditable] p { margin: 1em 0; }
        [contenteditable] blockquote { 
          margin: 1em 0; 
          padding-left: 1em; 
          border-left: 4px solid #ccc; 
          font-style: italic; 
        }
        
        [contenteditable] ul, [contenteditable] ol { 
          margin: 1em 0; 
          padding-left: 2em; 
        }
        
        [contenteditable] pre { 
          background-color: #f4f4f4; 
          padding: 1em; 
          border-radius: 4px; 
          font-family: monospace; 
          overflow-x: auto; 
        }
        
        [contenteditable] table { 
          border-collapse: collapse; 
          width: 100%; 
          margin: 1em 0; 
        }
        
        [contenteditable] th, [contenteditable] td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        
        [contenteditable] th { 
          background-color: #f2f2f2; 
          font-weight: bold; 
        }
        
        [contenteditable] a { 
          color: #3b82f6; 
          text-decoration: underline; 
        }
        
        [contenteditable] img { 
          max-width: 100%; 
          height: auto; 
          margin: 0.5em 0; 
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
