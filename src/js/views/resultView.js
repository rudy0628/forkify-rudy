import View from './View.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _sortBtn = document.querySelector('.btn--sort');
  _errorMessage = 'No recipe found for your query! Please try again!';
  _message = '';

  _generateMarkup() {
    return `
    ${this._data.map(result => previewView.render(result, false)).join('')}
    `;
  }

  renderButton() {
    this._sortBtn.style.display = 'block';
  }

  addHandlerSort(handler) {
    this._sortBtn.addEventListener('click', handler);
  }
}

export default new ResultView();
