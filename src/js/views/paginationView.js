import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //when pagination button click
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );
    console.log(numPages);

    // page 1, and there are other page
    if (curPage === 1 && numPages > 1) {
      return `
      <h3 class="page__num">page:${curPage}</h3>
      ${this._generateMarkupButton(curPage + 1, 'next', 'right')}
      `;
    }

    // last page
    if (curPage === numPages && numPages > 1) {
      return `
      ${this._generateMarkupButton(curPage - 1, 'prev', 'left')}
      <h3 class="page__num">page:${curPage}</h3>
      `;
    }

    // other page
    if (curPage < numPages) {
      return `
        ${this._generateMarkupButton(curPage - 1, 'prev', 'left')}
        <h3 class="page__num">page:${curPage}</h3>
        ${this._generateMarkupButton(curPage + 1, 'next', 'right')}
      `;
    }
    // page 1, and there are not other page
    return '';
  }

  _generateMarkupButton(curPage, direction, iconArrow) {
    return `
        <button data-goto="${curPage}" class="btn--inline pagination__btn--${direction}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${iconArrow}"></use>
            </svg>
            <span>Page ${curPage}</span>
        </button>
      `;
  }
}

export default new PaginationView();
