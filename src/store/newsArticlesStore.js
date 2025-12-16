// News Articles store - manages news articles
const STORAGE_KEY = 'tofu-news-articles';
const DRAFT_KEY = 'tofu-admin-news-draft';

const safeRead = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.warn('Failed to parse localStorage value', e);
    return fallback;
  }
};

const safeWrite = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to write localStorage value', e);
  }
};

/**
 * Get all news articles
 * @returns {Array} Array of article objects
 */
export const getArticles = () => {
  return safeRead(STORAGE_KEY, []);
};

/**
 * Get article by ID
 * @param {string} id - Article ID
 * @returns {Object|null} Article object or null
 */
export const getArticleById = (id) => {
  const articles = getArticles();
  return articles.find((article) => article.id === id) || null;
};

/**
 * Add a new article
 * @param {Object} article - Article object
 * @returns {Array} Updated articles array
 */
export const addArticle = (article) => {
  const articles = getArticles();
  const nextArticles = [article, ...articles];
  safeWrite(STORAGE_KEY, nextArticles);
  return nextArticles;
};

/**
 * Update article by ID
 * @param {string} id - Article ID
 * @param {Object} patch - Fields to update
 * @returns {Array} Updated articles array
 */
export const updateArticle = (id, patch) => {
  const articles = getArticles();
  const nextArticles = articles.map((article) =>
    article.id === id
      ? { ...article, ...patch, updatedAt: new Date().toISOString() }
      : article
  );
  safeWrite(STORAGE_KEY, nextArticles);
  return nextArticles;
};

/**
 * Delete article by ID
 * @param {string} id - Article ID
 * @returns {Array} Updated articles array
 */
export const deleteArticle = (id) => {
  const articles = getArticles();
  const nextArticles = articles.filter((article) => article.id !== id);
  safeWrite(STORAGE_KEY, nextArticles);
  return nextArticles;
};

/**
 * Get draft from localStorage
 * @returns {Object|null} Draft object or null
 */
export const getDraft = () => {
  return safeRead(DRAFT_KEY, null);
};

/**
 * Save draft to localStorage
 * @param {Object} draft - Draft object
 */
export const saveDraft = (draft) => {
  safeWrite(DRAFT_KEY, draft);
};

/**
 * Clear draft from localStorage
 */
export const clearDraft = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.warn('Failed to clear draft', e);
  }
};

