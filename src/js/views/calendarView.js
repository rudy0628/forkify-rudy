import View from './View.js';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.calendar-window');
  //   _message = 'successfully upload the recipe!';
  _btnOpen = document.querySelector('.open__calendar');
  _btnClose = document.querySelector('.btn--close-calendar');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._parentElement.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerLoadCal(handler) {
    this._btnOpen.addEventListener('click', handler);
  }

  loadCalendar(bookmarks) {
    let count = 0;
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    let calendar = new Calendar(this._parentElement, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridWeek',
      },
      events: bookmarks.map(bm => {
        const now = Date.now() + 1000 * 60 * 60 * 24 * count;
        const dateFormat = new Intl.DateTimeFormat('default', options)
          .format(now)
          .replaceAll('/', '-'); //2021/MM/DD
        count++;
        return {
          title: bm.title,
          start: `${dateFormat}`,
          end: `${dateFormat}`,
          url: `http://localhost:1234/#${bm.id}`,
        };
      }),
      eventClick: function (info) {
        info.jsEvent.preventDefault(); // don't let the browser navigate

        if (info.event.url) {
          window.open(info.event.url);
        }
      },
    });
    calendar.render();
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
