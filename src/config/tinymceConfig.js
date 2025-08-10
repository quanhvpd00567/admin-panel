/**
 * TinyMCE Editor Configuration
 * Centralized configuration for the rich text editor
 */

export const getTinyMCEConfig = () => ({
  height: 500,
  menubar: true,
  plugins: [
    'advlist',
    'autolink',
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount',
    'paste',
    'importcss',
    'autosave',
    'save',
    'directionality',
    'emoticons',
    'template',
    'codesample',
    'hr',
    'pagebreak',
    'nonbreaking',
    'toc',
    'imagetools',
    'quickbars',
  ],
  toolbar: [
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough',
    'link image media table | align lineheight | checklist numlist bullist indent outdent',
    'emoticons charmap | codesample | fullscreen preview | help',
  ].join(' | '),
  content_style: `
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
      font-size: 14px;
      line-height: 1.6;
      padding: 1rem;
      max-width: none;
    }
  `,
  skin: 'oxide',
  content_css: 'default',
  branding: false,
  promotion: false,
  resize: true,
  autosave_ask_before_unload: true,
  autosave_interval: '30s',
  autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  autosave_retention: '2m',
  image_advtab: false,
  image_uploadtab: false,
  file_picker_types: 'image media file',
  automatic_uploads: true,

  // Image upload handler - converts images to base64
  images_upload_handler: blobInfo => {
    return new Promise((resolve, reject) => {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = () => {
        // Return the base64 data URL
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject('Failed to convert image to base64');
      };
      reader.readAsDataURL(blobInfo.blob());
    });
  },

  // File picker callback for media uploads
  file_picker_callback: (callback, value, meta) => {
    // Create file input
    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    if (meta.filetype === 'image') {
      input.setAttribute('accept', 'image/*');
    } else if (meta.filetype === 'media') {
      input.setAttribute('accept', 'video/*,audio/*');
    } else {
      input.setAttribute('accept', '*/*');
    }

    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const url = reader.result;
          callback(url, {
            alt: file.name,
            title: file.name,
          });
        });
        reader.readAsDataURL(file);
      }
    });

    input.click();
  },

  // Paste configuration
  paste_data_images: true,
  paste_as_text: false,
  paste_webkit_styles: 'font-weight font-style color',
  paste_retain_style_properties: 'color font-size font-family background-color',

  // Quick bars configuration
  quickbars_selection_toolbar:
    'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  quickbars_insert_toolbar: 'quickimage quicktable | hr pagebreak',
  contextmenu: 'link image table',

  // Table configuration
  table_responsive_width: true,
  table_grid: false,
  table_class_list: [
    { title: 'None', value: '' },
    { title: 'Striped', value: 'table-striped' },
    { title: 'Bordered', value: 'table-bordered' },
    { title: 'Hover', value: 'table-hover' },
  ],

  // Link configuration
  link_default_target: '_blank',
  link_assume_external_targets: true,

  // Code sample languages
  codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'PHP', value: 'php' },
    { text: 'Ruby', value: 'ruby' },
    { text: 'Python', value: 'python' },
    { text: 'Java', value: 'java' },
    { text: 'C', value: 'c' },
    { text: 'C#', value: 'csharp' },
    { text: 'C++', value: 'cpp' },
  ],

  // Content templates
  templates: [
    {
      title: 'Blog Post Template',
      description: 'Standard blog post layout',
      content: `
        <h2>Introduction</h2>
        <p>Write your introduction here...</p>
        
        <h2>Main Content</h2>
        <p>Your main content goes here...</p>
        
        <h2>Conclusion</h2>
        <p>Wrap up your thoughts...</p>
      `,
    },
    {
      title: 'Article with Image',
      description: 'Article template with featured image',
      content: `
        <img src="https://via.placeholder.com/600x300" alt="Featured Image" style="width: 100%; height: auto;" />
        <h2>Article Title</h2>
        <p>Your article content...</p>
      `,
    },
  ],
});

// TinyMCE API Key - move to environment variables in production
export const TINYMCE_API_KEY =
  '8e6vpr0o6lgy9c7dlxta2wkxb8i8hu4vuilvxk0ccj7chqo4';

// Editor initial content
export const INITIAL_CONTENT = '<p>Start writing your post content here...</p>';
