import React, { useState, useEffect, useMemo } from 'react';
import {
  getCommonCodes,
  createCommonCode,
  updateCommonCode,
  deleteCommonCode,
  activateCommonCode,
  deactivateCommonCode,
  getParentByCode,
  getSubCategoriesByParent,
  generateNextSubCategoryCode,
} from '../../store/commonCodesStore';
import Modal from '../../components/common/Modal';
import Toast from '../../components/delivery/Toast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const AdminCommonCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, 100, 200
  const [filters, setFilters] = useState({
    isActive: 'ALL',
    search: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    parentCode: '100',
    name: '',
    code: '',
    sortOrder: 100,
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCodes();
  }, [activeTab, filters]);

  const loadCodes = () => {
    const filterParams = {};
    
    // Filter by parent code (tab selection)
    if (activeTab !== 'ALL') {
      filterParams.parentCode = activeTab;
    }
    
    if (filters.isActive !== 'ALL') {
      filterParams.isActive = filters.isActive === 'ACTIVE';
    }
    if (filters.search) {
      filterParams.q = filters.search;
    }

    const allCodes = getCommonCodes(filterParams);
    setCodes(allCodes);
  };

  // Auto-generate code when parent or name changes
  useEffect(() => {
    if (!editingCode && formData.parentCode && formData.name) {
      const nextCode = generateNextSubCategoryCode(formData.parentCode);
      setFormData((prev) => ({
        ...prev,
        code: prev.code || nextCode,
      }));
    }
  }, [formData.parentCode, formData.name, editingCode]);

  const handleParentChange = (parentCode) => {
    const nextCode = generateNextSubCategoryCode(parentCode);
    setFormData({
      ...formData,
      parentCode,
      code: nextCode, // Auto-generate new code
    });
  };

  const handleOpenCreate = () => {
    setEditingCode(null);
    // Default to current tab's parent, or 100 (Real-Estate)
    const defaultParent = activeTab !== 'ALL' ? activeTab : '100';
    const nextCode = generateNextSubCategoryCode(defaultParent);
    setFormData({
      parentCode: defaultParent,
      name: '',
      code: nextCode,
      sortOrder: 100,
      isActive: true,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (code) => {
    setEditingCode(code);
    setFormData({
      parentCode: code.parentCode,
      name: code.name,
      code: code.code,
      sortOrder: code.sortOrder,
      isActive: code.isActive,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCode(null);
    setFormData({
      parentCode: '100',
      name: '',
      code: '',
      sortOrder: 100,
      isActive: true,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else {
      // Validate code format: parentCode-XX (e.g., 100-01, 200-03)
      const codePattern = new RegExp(`^${formData.parentCode}-\\d{2}$`);
      if (!codePattern.test(formData.code)) {
        newErrors.code = `Code must match format: ${formData.parentCode}-XX (e.g., ${formData.parentCode}-01)`;
      }
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'Sort order must be >= 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingCode) {
        // For update, don't include parentCode (parent cannot be changed)
        const updateData = {
          name: formData.name,
          code: formData.code,
          sortOrder: formData.sortOrder,
          isActive: formData.isActive,
        };
        updateCommonCode(editingCode.id, updateData);
        setToast({
          isVisible: true,
          message: 'Sub-category updated successfully',
          type: 'success',
        });
      } else {
        createCommonCode(formData);
        setToast({
          isVisible: true,
          message: 'Sub-category created successfully',
          type: 'success',
        });
      }
      loadCodes();
      handleCloseModal();
    } catch (error) {
      setToast({
        isVisible: true,
        message: error.message || 'An error occurred',
        type: 'error',
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this code?')) {
      try {
        deleteCommonCode(id);
        setToast({
          isVisible: true,
          message: 'Common code deleted successfully',
          type: 'success',
        });
        loadCodes();
      } catch (error) {
        setToast({
          isVisible: true,
          message: error.message || 'Cannot delete code',
          type: 'error',
        });
      }
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    try {
      if (currentStatus) {
        deactivateCommonCode(id);
        setToast({
          isVisible: true,
          message: 'Code deactivated',
          type: 'success',
        });
      } else {
        activateCommonCode(id);
        setToast({
          isVisible: true,
          message: 'Code activated',
          type: 'success',
        });
      }
      loadCodes();
    } catch (error) {
      setToast({
        isVisible: true,
        message: error.message || 'An error occurred',
        type: 'error',
      });
    }
  };

  // Get parent name for display
  const getParentName = (parentCode) => {
    if (!parentCode) return '-';
    if (parentCode === '100') return 'Real-Estate (100)';
    if (parentCode === '200') return 'Delivery (200)';
    return `Unknown (${parentCode})`;
  };

  const filteredCodes = useMemo(() => {
    return codes;
  }, [codes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-1">Manage sub-categories for Real-Estate (100) and Delivery (200)</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-dabang-primary transition-all shadow-lg hover:shadow-xl"
        >
          + Create Sub-Category
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'ALL'
                ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('100')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === '100'
                ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Real-Estate (100)
          </button>
          <button
            onClick={() => setActiveTab('200')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === '200'
                ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Delivery (200)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name or code..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Codes</div>
          <div className="text-3xl font-bold text-gray-900">{codes.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Active Codes</div>
          <div className="text-3xl font-bold text-green-600">
            {codes.filter((c) => c.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Real-Estate</div>
          <div className="text-3xl font-bold text-blue-600">
            {getSubCategoriesByParent('100', true).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Delivery</div>
          <div className="text-3xl font-bold text-purple-600">
            {getSubCategoriesByParent('200', true).length}
          </div>
        </div>
      </div>

      {/* Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Main Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sort Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Updated At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No sub-categories found. Create a new sub-category to get started.
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{code.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                          {code.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getParentName(code.parentCode)}
                      </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{code.sortOrder}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          code.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {code.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(code.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(code)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(code.id, code.isActive)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            code.isActive
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {code.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(code.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCode ? 'Edit Sub-Category' : 'Create Sub-Category'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            id="parentCode"
            label="Parent Category *"
            value={formData.parentCode}
            onChange={(e) => handleParentChange(e.target.value)}
            options={[
              { value: '100', label: 'Real-Estate (100)' },
              { value: '200', label: 'Delivery (200)' },
            ]}
            required
            error={errors.parentCode}
            disabled={!!editingCode} // Disable parent change when editing
          />
          {editingCode && (
            <p className="text-xs text-gray-500">
              Parent category cannot be changed after creation.
            </p>
          )}

          <Input
            id="name"
            label="Sub-Category Name *"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            error={errors.name}
            placeholder="e.g., One-room"
          />

          <Input
            id="code"
            label="Sub-Category Code *"
            value={formData.code}
            onChange={(e) => {
              // Allow manual editing but validate format
              const value = e.target.value;
              setFormData({
                ...formData,
                code: value,
              });
            }}
            required
            error={errors.code}
            placeholder={`e.g., ${formData.parentCode}-01`}
          />
          <p className="text-xs text-gray-500">
            Code is auto-generated. Format: {formData.parentCode}-XX (e.g., {formData.parentCode}-01)
          </p>

          <Input
            id="sortOrder"
            label="Sort Order"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 100 })}
            error={errors.sortOrder}
            min="0"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-dabang-primary transition-all"
            >
              {editingCode ? 'Update' : 'Create Sub-Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default AdminCommonCodesPage;

