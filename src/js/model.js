import 'regenerator-runtime/runtime';
import {
  API_URL,
  RESULT_PER_PAGE,
  KEY,
  API_URL_SPOON,
  KEY_SPOON,
} from './config.js';
import { AJAX } from './helper.js';

const createRecipeObject = function (data, dataSpoon) {
  const { recipe } = data.data;

  let cal = 'no cal';
  console.log(dataSpoon.results);
  //get data of calories
  if (dataSpoon.results.length) {
    const [result] = dataSpoon.results;
    const { amount } = result.nutrition.nutrients[0];
    cal = amount;
  }

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    calories: cal,
  };
};

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    isSorted: false,
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
  shoppingList: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    const dataSpoon = await AJAX(
      `${API_URL_SPOON}?query=${data.data.recipe.title}&number=1&minCalories=50&apiKey=${KEY_SPOON}`
    );

    //put the data into the state.recipe
    state.recipe = createRecipeObject(data, dataSpoon);

    console.log(state.recipe);

    //check if the bookmarked array have the current recipe(use id to check)
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    )
      ? true
      : false;
  } catch (err) {
    // temp error handling
    // console.error(`${err} 🤬🤬`);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    //origin search result
    state.search.result = data.data.recipes.map(rec => {
      const rank = Math.trunc(Math.random() * 100) + 1;
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
        rank,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage; // 0
  const end = page * state.search.resultPerPage; // 10
  const result = state.search.isSorted
    ? state.search.result.slice().sort((a, b) => a.rank - b.rank)
    : state.search.result;

  return result.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    //newQt = oldQt * (newServing / oldServing)
    ing.quantity = ing.quantity * (newServing / state.recipe.servings);
  });

  //update new serving
  state.recipe.servings = newServing;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // store bookmarks in local storage
  persistBookmark();

  sameIngCalc();
};

export const removeBookMark = function (id) {
  // use findIndex method to find the id we want to remove
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as not bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // store bookmarks in local storage
  persistBookmark();

  sameIngCalc();
};

const sameIngCalc = function () {
  //adding total quantity with same ingredients
  state.shoppingList = [];
  for (const list of state.bookmarks) {
    for (const ing of list.ingredients) {
      // if (ing.description === 'Rice') count += ing.quantity;
      const arrIng = state.shoppingList.find(
        el => el.description === ing.description
      );
      if (!arrIng) {
        state.shoppingList.push({
          description: ing.description,
          quantity: ing.quantity,
          unit: ing.unit,
        });
      } else {
        arrIng.quantity += ing.quantity;
      }
    }
  }
};

const init = function () {
  const bookmarkStorage = localStorage.getItem('bookmarks');
  if (bookmarkStorage) state.bookmarks = JSON.parse(bookmarkStorage);

  sameIngCalc();
};
init();

/*convert object to an array, and filter the ingredient and check whether is empty string, and then use map create the array, destructing the quantity, unit and description from the ing[1], and put into the object, in the array*/

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('wrong ingredient format!');
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    //set the current recipe to new recipe
    state.recipe = createRecipeObject(data);

    //store the recipe into bookmark
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const resultSort = function () {
  //change the resultSort array
  state.search.isSorted = !state.search.isSorted;
};
