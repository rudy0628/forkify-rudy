import icons from '../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    // if not data or data is an array and is empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data) return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup(); // string

    //create a new Dom as same as the newMarkup;
    const newDom = document.createRange().createContextualFragment(newMarkup); // dom
    // create the NodeList of the curDom and the virtual Dom(newDom)
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    // compare the NodeList where is different
    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];

      // check if the node is different and the node child(text) is string and not empty
      // if the newEl first child is not the text, it will be null, and the if statement will not true
      //update change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //update change attributes
      if (!newEl.isEqualNode(curEl)) {
        // convert the newEl.attributes object to array, and loop over set into the curEl(set the data-update-to to the curEl(current DOM))
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
