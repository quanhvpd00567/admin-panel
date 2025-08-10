/**
 * Blog Form Components
 * Reusable components for creating and editing blog posts
 */

import React from 'react';
import { Controller } from 'react-hook-form';
import { FaCog, FaTags, FaImage } from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { getTinyMCEConfig, TINYMCE_API_KEY, INITIAL_CONTENT } from '../../config/tinymceConfig';

// Title and Slug Form Component
export const TitleSlugForm = ({ control, errors }) => {
  return (
    <Card>
      <div className="p-6 space-y-4">
        <Controller
          name="title"
          control={control}
          rules={{ 
            required: 'Title is required',
            maxLength: { value: 200, message: 'Title must be less than 200 characters' }
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Post Title"
              placeholder="Enter post title..."
              error={errors.title?.message}
              variant="outlined"
            />
          )}
        />

        <Controller
          name="slug"
          control={control}
          rules={{ 
            required: 'Slug is required',
            pattern: { value: /^[a-z0-9-]+$/, message: 'Slug can only contain lowercase letters, numbers, and hyphens' }
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="URL Slug"
              placeholder="post-url-slug"
              error={errors.slug?.message}
              variant="outlined"
              helperText="This will be the URL of your post"
            />
          )}
        />
      </div>
    </Card>
  );
};

// Content Editor Component
export const ContentEditor = ({ editorRef, initialContent = INITIAL_CONTENT }) => {
  return (
    <Card>
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-left">
          Content
        </label>
        <div className="border rounded-lg overflow-hidden bg-white">
          <Editor
            apiKey={TINYMCE_API_KEY}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={initialContent}
            init={getTinyMCEConfig()}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Rich text editor with image upload, tables, code blocks, and advanced formatting
        </p>
      </div>
    </Card>
  );
};

// Excerpt Form Component
export const ExcerptForm = ({ control, errors }) => {
  return (
    <Card>
      <div className="p-6">
        <Controller
          name="excerpt"
          control={control}
          rules={{ 
            maxLength: { value: 300, message: 'Excerpt must be less than 300 characters' }
          }}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Excerpt
              </label>
              <textarea
                {...field}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Brief description of your post..."
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.excerpt.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {field.value?.length || 0}/300 characters
              </p>
            </div>
          )}
        />
      </div>
    </Card>
  );
};

// SEO Fields Component
export const SEOFields = ({ control, errors, showSeoFields, setShowSeoFields }) => {
  return (
    <Card>
      <div className="p-6">
        <button
          type="button"
          onClick={() => setShowSeoFields(!showSeoFields)}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <FaCog className="w-4 h-4" />
          <span className="font-medium">SEO Settings</span>
        </button>

        {showSeoFields && (
          <div className="space-y-4">
            <Controller
              name="seo.metaTitle"
              control={control}
              rules={{ maxLength: { value: 60, message: 'Meta title should be under 60 characters' }}}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Meta Title"
                  placeholder="SEO title for search engines"
                  error={errors.seo?.metaTitle?.message}
                  variant="outlined"
                  helperText={`${field.value?.length || 0}/60 characters`}
                />
              )}
            />

            <Controller
              name="seo.metaDescription"
              control={control}
              rules={{ maxLength: { value: 160, message: 'Meta description should be under 160 characters' }}}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                    Meta Description
                  </label>
                  <textarea
                    {...field}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Description that appears in search results"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {field.value?.length || 0}/160 characters
                  </p>
                </div>
              )}
            />

            <Controller
              name="seo.keywords"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Keywords"
                  placeholder="keyword1, keyword2, keyword3"
                  variant="outlined"
                  helperText="Comma-separated keywords for SEO"
                />
              )}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

// Category and Tags Component
export const CategoryTagsForm = ({ 
  control, 
  errors, 
  categoryOptions, 
  tagOptions, 
  selectedTags, 
  handleTagAdd, 
  handleTagRemove 
}) => {
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Category & Tags
        </h3>

        <Controller
          name="category"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <Select
              {...field}
              label="Category"
              options={categoryOptions}
              error={errors.category?.message}
              variant="outlined"
            />
          )}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
            Tags
          </label>
          <Select
            value=""
            onChange={handleTagAdd}
            options={tagOptions}
            variant="outlined"
          />
          
          {selectedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  <FaTags className="w-3 h-3 mr-1" />
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag.id)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Featured Image Component
export const FeaturedImageForm = ({ featuredImage, handleImageUpload, setFeaturedImage }) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Featured Image
        </h3>
        
        {featuredImage ? (
          <div className="space-y-3">
            <img
              src={featuredImage}
              alt="Featured"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFeaturedImage(null)}
            >
              Remove Image
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <FaImage className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Upload featured image
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="featured-image"
            />
            <label
              htmlFor="featured-image"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
            >
              Choose Image
            </label>
          </div>
        )}
      </div>
    </Card>
  );
};

// Publish Settings Component
export const PublishSettingsForm = ({ control, isEdit = false }) => {
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Publish Settings
        </h3>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' }
              ]}
              variant="outlined"
            />
          )}
        />

        <Controller
          name="publishDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="datetime-local"
              label="Publish Date"
              variant="outlined"
              helperText={isEdit ? "Leave empty to keep current date" : "Leave empty to publish immediately"}
            />
          )}
        />
      </div>
    </Card>
  );
};
