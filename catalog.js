'use strict';

function normalizeSearch(value = '') {
  return String(value).trim().replace(/\s+/g, ' ').toLowerCase();
}

function filterDesigns(designs, { category = 'All', query = '' } = {}) {
  const needle = normalizeSearch(query);
  return designs.filter((design) => {
    const categoryMatches = category === 'All' || design.category === category;
    const searchable = [design.title, design.category, ...(design.tags || [])].join(' ');
    return categoryMatches && (!needle || normalizeSearch(searchable).includes(needle));
  });
}

function toggleFavorite(favorites, id) {
  return favorites.includes(id)
    ? favorites.filter((favoriteId) => favoriteId !== id)
    : [...favorites, id];
}

if (typeof module !== 'undefined') {
  module.exports = { filterDesigns, toggleFavorite, normalizeSearch };
}

if (typeof window !== 'undefined') {
  window.CardCatalog = { filterDesigns, toggleFavorite, normalizeSearch };
}
