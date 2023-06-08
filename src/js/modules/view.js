// @ts-check
export const html = {
  header: {
    search: document.querySelector('[data-header-search]'),
    settings: document.querySelector('[data-header-settings]'),
  },
  main: {
    list: document.querySelector('[data-list-items]'),
    showMoreButton: document.querySelector('[data-list-button]'),
  },
  list: {
    close: document.querySelector('[data-list-close]'),
    active: document.querySelector('[data-list-active]'),
  },
  search: {
    cancel: document.querySelector('[data-search-cancel]'),
    overlay: document.querySelector('[data-search-overlay]'),
    genres: document.querySelector('[data-search-genres]'),
    authors: document.querySelector('[data-search-authors]'),
  },
  settings: {
    theme: document.querySelector('[data-settings-theme]'),
    overlay: document.querySelector('[data-settings-overlay]'),
    cancel: document.querySelector('[data-settings-cancel]'),
    form: document.querySelector('[data-settings-form]'),
  },
};
