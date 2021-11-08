import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import shoppingListView from './views/shoppingListView.js';
import calendarView from './views/calendarView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

import { CLOSE_MODAL_SECOND } from './config.js';
if (module.hot) {
  module.hot.accept();
}
///////////////////////////////////////

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  try {
    // 0.update result view to mark selected result search
    resultView.update(model.getSearchResultPage());
    recipeView.renderSpinner(); // view
    // updating the bookmark view
    bookmarkView.update(model.state.bookmarks);
    shoppingListView.render(model.state.shoppingList);

    // 1. loading recipe
    await model.loadRecipe(id); // model

    // 2. rendering recipe
    // data flow : model -> view
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResult = async function () {
  try {
    // 1) get search input value
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load the search result
    await model.loadSearchResult(query);

    // 3) render the search result
    resultView.renderSpinner();
    resultView.render(model.getSearchResultPage());
    resultView.renderButton();

    // 4) render the initial pagination buttons
    console.log(model.state.search);
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) render the search result model -> view
  resultView.render(model.getSearchResultPage(goToPage));

  // 4) render the pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // update the recipe servings(in state)
  model.updateServings(newServing);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // 1) add and remove bookmark、shopping list
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else if (model.state.recipe.bookmarked) {
    model.removeBookMark(model.state.recipe.id);
  }

  // 2) update the bookmark icon
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarkView.render(model.state.bookmarks);
  shoppingListView.render(model.state.shoppingList);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //render spinner
    addRecipeView.renderSpinner();

    //render the recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //change the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //close the form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SECOND * 1000);
  } catch (err) {
    addRecipeView.renderErrorMessage(err);
  }
};

const controlSortResult = function () {
  //change the current sort state
  model.resultSort();
  //render the current search result page
  resultView.render(model.getSearchResultPage());
};

const controlCalendar = function () {
  calendarView.loadCalendar(model.state.bookmarks);
};

const init = function () {
  // subscriber, pass the handler into the render function
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerAddBookMark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
  resultView.addHandlerSort(controlSortResult);
  calendarView.addHandlerLoadCal(controlCalendar);
};
init();
