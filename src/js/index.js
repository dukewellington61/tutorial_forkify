import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';


/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked reciped
 */ 
const state = {};

/**
 * SEARCH CONTROLLER
 * 
 */

const controlSearch = async () => {

    // 1) Get query from view
    const query = searchView.getInput();
   


    if (query) {
        // 2) CreatenNew search object and add to state object
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try { 
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);        
        } catch (err) {
            // console.log(err);
            clearLoader();
        };       
    };
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// event delegation --> closest method
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();   
        searchView.renderResults(state.search.result, goToPage)    
    };
});


/**
 * RECIPE CONTROLLER * 
 */

const controlRecipe = async () => {
     // Get ID from url
    const id = window.location.hash.replace('#','');
    // console.log(id);
    if (id) {
        // Prepare UI changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object and add to state object
        state.recipe = new Recipe(id);       

        try {
            // Get recipe data and parse ingredients            
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);           
        } catch (err) {
            console.log(err);
        };        
    };
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 * 
 */

const controlList = () => {
    // Create a new list of no list exists
    if (!state.list) {
        
        state.list = new List();

        // Add each ingredient to the list and UI
        state.recipe.ingredients.forEach(el => {
            const item = state.list.addItem(el.count, el.unit, el.ingredient);
            listView.renderItem(item);
        });
    };
};

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; // dataset accesses value of custom data attributes, that had been set to dom elements

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {          
        // Delete from state (model)
        state.list.deleteItem(id); 

        // Delete from view
        listView.deleteItem(id);    

    // Handle count update in the model
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    };      
});   

// Handling recipe button clicks --> event delegation
elements.recipe.addEventListener('click', e => {    
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { /* '*' (asterisk) means any child of .btn-decrease */
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        };
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { 
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    };
});
