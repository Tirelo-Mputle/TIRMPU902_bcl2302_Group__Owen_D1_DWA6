// @ts-check
import { books, authors, genres, BOOKS_PER_PAGE } from './modules/data.js';
import { html } from './modules/view.js';

let matches = books;
let page = 1;
const remainingBooks =
  matches.length - page * BOOKS_PER_PAGE > 0
    ? matches.length - page * BOOKS_PER_PAGE
    : 0;
/**
 * Copy of the entire books array
 */

const starting = document.createDocumentFragment();

/**
 * Creates book preview buttons from a slice of the matches array {@link matches}.
 * The buttons are them appended to a parent element.
 * @param {HTMLElement | DocumentFragment} parentElement - The parent element to which the preview will be attached
 * @param {number} startOfSlice - The starting array index number of the slice
 */
const createBookPreviewsButtons = (parentElement, startOfSlice, endOfSlice) => {
  //Todo: slice should increment.
  for (const { author, id, image, title } of matches.slice(
    startOfSlice,
    endOfSlice
  )) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
    parentElement.appendChild(element);
  }
};
createBookPreviewsButtons(starting, 0, BOOKS_PER_PAGE);
html.main.list.appendChild(starting);

const genreHtml = document.createDocumentFragment();
const authorsHtml = document.createDocumentFragment();
/**
 *Creates the "any" option element and appends it to a parent element *
 * @param {HTMLElement | DocumentFragment} fragment - parent element
 * @param {String} optionText - Text to display for the any option
 */
const createAnyItemOption = (fragment, optionText) => {
  const firstOption = document.createElement('option');
  firstOption.value = 'any';
  firstOption.innerText = `${optionText}`;
  fragment.appendChild(firstOption);
};

/**
 * Creates option element using data from an array.
 * The options are appended to a parent element
 * @param {Array} arrayName
 * @param {HTMLElement | DocumentFragment} parentElement - parent element
 */
const createNamedItemOption = (arrayName, parentElement) => {
  for (const [id, name] of Object.entries(arrayName)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    parentElement.appendChild(element);
  }
};

createAnyItemOption(genreHtml, 'All Genres');
createNamedItemOption(genres, genreHtml);
createAnyItemOption(authorsHtml, 'All Authors');
createNamedItemOption(authors, authorsHtml);

html.search.genres.appendChild(genreHtml);
html.search.authors.appendChild(authorsHtml);
//TODO TRY CATCH THIS STUFF

/**
 * Stores night and day mode settings
 */
const themeModes = {
  night: {
    colorLight: '10, 10, 20',
    colorDark: '255, 255, 255',
  },
  day: {
    colorDark: '10, 10, 20',
    colorLight: '255, 255, 255',
  },
};
/**
 * Toggles the theme settings
 * @param {string} theme - theme mode setting name
 */
const toggleThemeMode = (theme) => {
  if (html.settings.theme.value === `${theme}`) {
    const { colorLight, colorDark } = themeModes[theme];
    document.documentElement.style.setProperty('--color-dark', `${colorDark}`);
    document.documentElement.style.setProperty(
      '--color-light',
      `${colorLight}`
    );
  }
};

if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  html.settings.theme.value = 'night';
  toggleThemeMode('night');
} else {
  html.settings.theme.value = 'day';
  toggleThemeMode('day');
}

if (remainingBooks !== 0) {
  html.main.showMoreButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${remainingBooks})</span>
`;
} else {
  html.main.showMoreButton.disabled;
}

/**
 * Toggles the open or closed state of a modal
 * @param {HTMLElement} overlay
 */
const toggleOverlay = (overlay) => {
  overlay.open = !overlay.open;
};

//EVENT LISTENERS
html.search.cancel.addEventListener('click', () => {
  toggleOverlay(html.search.overlay);
});

html.settings.cancel.addEventListener('click', () => {
  toggleOverlay(html.settings.overlay);
});

html.header.search.addEventListener('click', () => {
  toggleOverlay(html.search.overlay);
  document.querySelector('[data-search-title]').focus();
});

html.header.settings.addEventListener('click', () => {
  toggleOverlay(html.settings.overlay);
});

html.list.close.addEventListener('click', () => {
  toggleOverlay(html.list.active);
});

html.settings.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === 'night') {
    toggleThemeMode('night');
  } else {
    toggleThemeMode('day');
  }

  html.settings.overlay.open = false;
});

document
  .querySelector('[data-search-form]')
  .addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
      let genreMatch = filters.genre === 'any';

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === '' ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    if (result.length < 1) {
      document
        .querySelector('[data-list-message]')
        .classList.add('list__message_show');
    } else {
      document
        .querySelector('[data-list-message]')
        .classList.remove('list__message_show');
    }

    document.querySelector('[data-list-items]').innerHTML = '';
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(
      0,
      BOOKS_PER_PAGE
    )) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);

      element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

      newItems.appendChild(element);
    }

    document.querySelector('[data-list-items]').appendChild(newItems);
    document.querySelector('[data-list-button]').disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('[data-search-overlay]').open = false;
  });

document.querySelector('[data-list-button]').addEventListener('click', () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    fragment.appendChild(element);
  }

  document.querySelector('[data-list-items]').appendChild(fragment);
  page += 1;
});

document
  .querySelector('[data-list-items]')
  .addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        let result = null;

        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }

        active = result;
      }
    }

    if (active) {
      document.querySelector('[data-list-active]').open = true;
      document.querySelector('[data-list-blur]').src = active.image;
      document.querySelector('[data-list-image]').src = active.image;
      document.querySelector('[data-list-title]').innerText = active.title;
      document.querySelector('[data-list-subtitle]').innerText = `${
        authors[active.author]
      } (${new Date(active.published).getFullYear()})`;
      document.querySelector('[data-list-description]').innerText =
        active.description;
    }
  });
