/**
 * Utility functions for working with Common Codes
 */
import { getSubCategoriesByParent } from '../../store/commonCodesStore';

/**
 * Get Real-Estate categories as options for dropdowns
 * @returns {Array} Array of { value, label } objects
 */
export const getRealEstateCategoryOptions = () => {
  const categories = getSubCategoriesByParent('100', true);
  return categories.map((code) => ({
    value: code.code, // Use numeric code (e.g., "100-01")
    label: code.name,
    id: code.id,
  }));
};

/**
 * Get Delivery categories as options for dropdowns
 * @returns {Array} Array of { value, label } objects
 */
export const getDeliveryCategoryOptions = () => {
  const categories = getSubCategoriesByParent('200', true);
  return categories.map((code) => ({
    value: code.code, // Use numeric code (e.g., "200-01")
    label: code.name,
    id: code.id,
  }));
};

/**
 * Get category name by code
 * @param {string} parentCode - Parent code ("100" or "200")
 * @param {string} code - Code value (e.g., "100-01")
 * @returns {string} Category name or code if not found
 */
export const getCategoryNameByCode = (parentCode, code) => {
  const categories = getSubCategoriesByParent(parentCode, true);
  const category = categories.find((c) => c.code === code);
  return category ? category.name : code;
};

/**
 * Get category by code
 * @param {string} parentCode - Parent code ("100" or "200")
 * @param {string} code - Code value (e.g., "100-01")
 * @returns {Object|null} Category object or null
 */
export const getCategoryByCode = (parentCode, code) => {
  const categories = getSubCategoriesByParent(parentCode, true);
  return categories.find((c) => c.code === code) || null;
};

