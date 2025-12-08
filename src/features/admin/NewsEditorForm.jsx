import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const NewsEditorForm = ({ newsItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    status: 'Draft',
    thumbnail: ''
  });
  
  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || '',
        category: newsItem.category || '',
        description: newsItem.description || '',
        status: newsItem.status || 'Draft',
        thumbnail: newsItem.thumbnail || ''
      });
    }
  }, [newsItem]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave({
      ...formData,
      id: newsItem?.id
    });
  };
  
  const categoryOptions = [
    { value: 'Political', label: '정치' },
    { value: 'Business', label: '경제' },
    { value: 'Real Estate', label: '부동산' },
    { value: 'Tech', label: '기술' },
    { value: 'Lifestyle', label: '라이프스타일' },
    { value: 'Health', label: '건강' },
    { value: 'Weather', label: '날씨' },
    { value: 'General', label: '일반' }
  ];
  
  const statusOptions = [
    { value: 'Draft', label: '임시저장' },
    { value: 'Published', label: '게시' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="제목"
        id="title"
        name="title"
        placeholder="뉴스 제목을 입력하세요"
        value={formData.title}
        onChange={handleInputChange}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="카테고리"
          id="category"
          name="category"
          options={categoryOptions}
          value={formData.category}
          onChange={handleInputChange}
          placeholder="카테고리를 선택하세요"
          required
        />
        
        <Select
          label="상태"
          id="status"
          name="status"
          options={statusOptions}
          value={formData.status}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
          썸네일 이미지 URL
        </label>
        <input
          type="text"
          id="thumbnail"
          name="thumbnail"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
          placeholder="썸네일 이미지 URL을 입력하세요"
          value={formData.thumbnail}
          onChange={handleInputChange}
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <img src={formData.thumbnail} alt="Thumbnail preview" className="h-32 w-32 object-cover rounded-md" />
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          내용
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
          placeholder="뉴스 내용을 입력하세요"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          취소
        </Button>
        <Button
          type="submit"
        >
          저장
        </Button>
      </div>
    </form>
  );
};

export default NewsEditorForm;