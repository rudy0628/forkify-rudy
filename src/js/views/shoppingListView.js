import View from './View.js';
import previewView from './previewView.js';

class shoppingListView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage = 'No shopping list yet, Find a nice recipe and bookmark it!!';
  _message = '';

  //   addHandlerRender(handler) {
  //     window.addEventListener('load', handler);
  //   }

  //   _generateMarkup() {
  //     return this._data
  //       .map(bookmark => previewView.render(bookmark, false))
  //       .join('');
  //   }

  _generateMarkup() {
    return this._data
      .map(ing => {
        return `
            <li class="shopping__ingredient">
                <div class="shopping__name">
                    <h2>${ing.description}</h2>
                </div>
                <div class="shopping__amount">
                    <h2>${
                      ing.quantity === null || ing.quantity === 0
                        ? ''
                        : ing.quantity
                    }<span class="unit">${
          ing.unit.length === 0 ? '' : ` / ${ing.unit}`
        }</span></h2>
                </div>
            </li>
            `;
      })
      .join('');
  }
}

export default new shoppingListView();
