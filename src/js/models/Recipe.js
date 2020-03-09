import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.title;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;            
        } catch (error) {
            // console.log(error);
            // alert('Something went wrong.');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for every 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() { 
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce','teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        // 1) Uniform units   
        // my take on this
        /*
        var newIngredients = [];   
        
        this.ingredients.map(el => { 
            
            
            
            let elArr = el.split(' ');           

            let checker = (arr1, arr2) => arr2.some(el => arr1.includes(el));           

            if (checker(elArr, unitsLong)) {

                for (let i = 0; i <= elArr.length; i++) {  
                    if (unitsLong.includes(elArr[i])) {                  
                        let word = elArr[i];
                        let index = unitsLong.indexOf(word);  
                        elArr[elArr.indexOf(word)] = unitsShort[index]; 
                    };
                };     
                newIngredients.push(elArr.join(" ")); 
            } else newIngredients.push(el); 

            console.log(newIngredients);   
       
        }); 
        
        */        
        // how this is actually done

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units  
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            
            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit (cups, ounce etc.) in the recipe string
                const arrCount = arrIng.slice(0, unitIndex); // everything before the unit 
                
                let count;
                if (arrCount.length === 1) { //
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                };
               
                objIng = {
                    count, /*e.g. 3 1/2 = 3.5 */
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is No unit but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };

            } else if (unitIndex === -1) {
                // is No unit and No number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            };

            return objIng;
        });
        
        this.ingredients = newIngredients;
      
    };   

    updateServings(type) {
        
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        });

        this.servings = newServings;
    };   
};