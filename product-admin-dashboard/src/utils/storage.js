const LOCAL_PRODUCTS_KEY = 'app_local_products';
const LOCAL_EDITS_KEY = 'app_local_edits';
const LOCAL_DELETED_KEY = 'app_local_deleted';

export const getLocalAddedProducts = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addLocalProduct = (product) => {
  const current = getLocalAddedProducts();
  const updated = [product, ...current];
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
};

export const getLocalEdits = () => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_EDITS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveLocalEdit = (id, updates) => {
  const current = getLocalEdits();
  current[id] = { ...(current[id] || {}), ...updates };
  localStorage.setItem(LOCAL_EDITS_KEY, JSON.stringify(current));
};

export const getLocalDeleted = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_DELETED_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveLocalDelete = (id) => {
  const current = getLocalDeleted();
  const numericId = Number(id);
  if (!current.includes(numericId)) {
    const updated = [...current, numericId];
    localStorage.setItem(LOCAL_DELETED_KEY, JSON.stringify(updated));
  }
};