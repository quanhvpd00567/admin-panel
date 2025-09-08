/**
 * Edit Post Page Component
 * Comprehensive form to edit existing blog posts with rich text editor using shared components
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { getPostById, getCategories, getTags } from '../../services/mockBlogData';
import {
  FaArrowLeft,
  FaEye,
  FaCheck,
  FaSave
} from 'react-icons/fa';

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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [categories] = useState(getCategories());
  const [tags] = useState(getTags());
  const [selectedTags, setSelectedTags] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [showSeoFields, setShowSeoFields] = useState(false);

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

  // Load post data
  useEffect(() => {
    if (id) {
      const foundPost = getPostById(parseInt(id));
      if (foundPost) {
        setPost(foundPost);
        
        // Populate form with post data
        setValue('title', foundPost.title);
        setValue('slug', foundPost.slug);
        setValue('excerpt', foundPost.excerpt);
        setValue('content', foundPost.content);
        setValue('status', foundPost.status);
        setValue('category', foundPost.category?.id?.toString() || '');
        setValue('publishDate', foundPost.publishDate || '');
        
        // SEO data
        setValue('seo.metaTitle', foundPost.seo?.metaTitle || '');
        setValue('seo.metaDescription', foundPost.seo?.metaDescription || '');
        setValue('seo.keywords', foundPost.seo?.keywords || '');
        
        // Tags
        if (foundPost.tags) {
          setSelectedTags(foundPost.tags);
        }
        
        // Featured image
        if (foundPost.featuredImage) {
          setFeaturedImage(foundPost.featuredImage);
        }
        
        // Set editor content after a delay to ensure editor is ready
        setTimeout(() => {
          if (editorRef.current && foundPost.content) {
            editorRef.current.setContent(foundPost.content);
          }
        }, 500);
        
        setLoading(false);
      } else {
        navigate('/posts');
      }
    }
  }, [id, setValue, navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && post) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchTitle, setValue, post]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Get content from TinyMCE editor
      const editorContent = editorRef.current ? editorRef.current.getContent() : '';
      
      const postData = {
        ...data,
        id: parseInt(id),
        content: editorContent,
        tags: selectedTags,
        featuredImage: featuredImage,
        updatedAt: new Date()
      };

      console.log('Updating post:', postData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/posts');
    } catch (error) {
      console.error('Error updating post:', error);
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
    if (!watch('publishDate')) {
      setValue('publishDate', new Date().toISOString());
    }
    handleSubmit(onSubmit)();
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

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading post...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
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
              Edit Post: {post?.title}
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
            icon={<FaCheck className="w-4 h-4" />}
          >
            {isLoading ? 'Updating...' : 'Update Post'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title and Slug */}
          <TitleSlugForm control={control} errors={errors} />

          {/* Content Editor */}
          <ContentEditor editorRef={editorRef} initialContent={post?.content} />

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
          <PublishSettingsForm control={control} isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditPost;
