/**
 * Create Post Page Component
 * Comprehensive form to create new blog posts with rich text editor
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaSave, FaEye } from 'react-icons/fa';

import Button from '../../components/ui/Button';
import { 
  TitleSlugForm,
  ContentEditor,
  ExcerptForm,
  SEOFields,
  CategoryTagsForm,
  FeaturedImageForm,
  PublishSettingsForm
} from '../../components/blog/BlogFormComponents';
import { getCategories, getTags } from '../../services/mockBlogData';

const CreatePost = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [categories] = useState(getCategories());
  const [tags] = useState(getTags());
  const [selectedTags, setSelectedTags] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [showRestoreDraft, setShowRestoreDraft] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      status: 'draft',
      publishDate: '',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        canonicalUrl: ''
      }
    }
  });

  const watchTitle = watch('title');

  // Check for existing draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog_post_draft');
    if (savedDraft) {
      setShowRestoreDraft(true);
    }
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchTitle, setValue]);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isDirty]);

  const handleAutoSave = async () => {
    setAutoSaving(true);
    try {
      // Get current content from TinyMCE editor
      const editorContent = editorRef.current ? editorRef.current.getContent() : '';
      
      // Get current form data
      const formData = watch();
      
      const draftData = {
        ...formData,
        content: editorContent,
        tags: selectedTags,
        featuredImage: featuredImage,
        lastSaved: new Date()
      };
      
      // Simulate auto-save API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage as backup
      localStorage.setItem('blog_post_draft', JSON.stringify(draftData));
      
      console.log('Auto-saved draft at:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Get content from TinyMCE editor
      const editorContent = editorRef.current ? editorRef.current.getContent() : '';
      
      const postData = {
        ...data,
        content: editorContent,
        tags: selectedTags,
        featuredImage: featuredImage,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Creating post:', postData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setValue('status', 'draft');
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    setValue('publishDate', new Date().toISOString());
    handleSubmit(async (data) => {
      await onSubmit(data);
      // Clear draft from localStorage after successful publish
      localStorage.removeItem('blog_post_draft');
    })();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagAdd = (tagId) => {
    const tag = tags.find(t => t.id === parseInt(tagId));
    if (tag && !selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem('blog_post_draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        
        // Restore form fields
        Object.keys(draftData).forEach(key => {
          if (key !== 'content' && key !== 'tags' && key !== 'featuredImage' && key !== 'lastSaved') {
            setValue(key, draftData[key]);
          }
        });
        
        // Restore other state
        if (draftData.tags) setSelectedTags(draftData.tags);
        if (draftData.featuredImage) setFeaturedImage(draftData.featuredImage);
        
        // Restore editor content after a short delay to ensure editor is ready
        setTimeout(() => {
          if (editorRef.current && draftData.content) {
            editorRef.current.setContent(draftData.content);
          }
        }, 500);
        
        setShowRestoreDraft(false);
        console.log('Draft restored successfully');
      } catch (error) {
        console.error('Failed to restore draft:', error);
        setShowRestoreDraft(false);
      }
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('blog_post_draft');
    setShowRestoreDraft(false);
  };

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  const tagOptions = [
    { value: '', label: 'Add Tag' },
    ...tags
      .filter(tag => !selectedTags.find(selected => selected.id === tag.id))
      .map(tag => ({ value: tag.id.toString(), label: tag.name }))
  ];

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
      {/* Restore Draft Banner */}
      {showRestoreDraft && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FaSave className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Draft Found
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We found an unsaved draft. Would you like to restore it?
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDiscardDraft}
              >
                Discard
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRestoreDraft}
              >
                Restore Draft
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/posts')}
            icon={<FaArrowLeft className="w-4 h-4" />}
          >
            Back to Posts
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Post
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              {autoSaving && (
                <span className="text-blue-600 dark:text-blue-400">Auto-saving...</span>
              )}
              {isDirty && !autoSaving && (
                <span className="text-orange-600 dark:text-orange-400">Unsaved changes</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={isLoading}
            icon={<FaSave className="w-4 h-4" />}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            disabled={isLoading}
            icon={<FaEye className="w-4 h-4" />}
          >
            {isLoading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title and Slug */}
          <TitleSlugForm control={control} errors={errors} />

          {/* Content Editor */}
          <ContentEditor editorRef={editorRef} />

          {/* Excerpt */}
          <ExcerptForm control={control} errors={errors} />

          {/* SEO Fields */}
          <SEOFields 
            control={control} 
            errors={errors} 
            showSeoFields={showSeoFields} 
            setShowSeoFields={setShowSeoFields} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & Tags */}
          <CategoryTagsForm
            control={control}
            errors={errors}
            categoryOptions={categoryOptions}
            tagOptions={tagOptions}
            selectedTags={selectedTags}
            handleTagAdd={handleTagAdd}
            handleTagRemove={handleTagRemove}
          />

          {/* Featured Image */}
          <FeaturedImageForm
            featuredImage={featuredImage}
            handleImageUpload={handleImageUpload}
            setFeaturedImage={setFeaturedImage}
          />

          {/* Publish Settings */}
          <PublishSettingsForm control={control} isEdit={false} />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
