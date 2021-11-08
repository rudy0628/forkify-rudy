import View from './View.js';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'successfully upload the recipe!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _errorMessage = document.querySelector('.error--message');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      // convert array to object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  renderErrorMessage(err){
    this._errorMessage.style.display = 'block';
    this._errorMessage.textContent = err;
    setTimeout(() => {
      this._errorMessage.textContent = '';
      this._errorMessage.style.display = 'none';
    }, 2000)
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
