const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

getRandomMel();
fetchFavMeals();

//mealData parameter will represent the data.meal[0] when it's passed to the function when it's called.

// Get random meal; new meal on every refresh
async function getRandomMel() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    addMeal(data.meals[0], true);
}

//Get a meal by ID

async function getMealById(id) {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

    const data = await res.json();

    const meal = data.meals[0];
    return meal;
}

// Get mail by searching for name(term)

async function getMelsBySearch(term) {
    const meals = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + term);
}

// Create div.meal element dynamicaly for the Random recipe
function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `

	<div class="meal-header">
		${random ? `<span class="random"> Random recipe </span>` : ''}
		<img
			src="${mealData.strMealThumb}"
			alt="${mealData.strMeal}"
		/>
	</div>
	<div class="meal-body">
		<h4>${mealData.strMeal}</h4>
		<button class="fav-btn">
			<i class="fas fa-heart"></i>
		</button>
	</div>
	`;
    const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
            removeMealSL(mealData.idMeal);
            btn.classList.remove('active');
        } else {
            addMealSL(mealData.idMeal);

            btn.classList.add('active');
        }

        fetchFavMeals();
    });
    meals.appendChild(meal);
}

// Add mealId to localStorage based on what recipe we favorite
function addMealSL(mealId) {
    const mealIds = getMealSL();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

//Remove mealId from localStorage when we uncheck the favorite button
function removeMealSL(mealId) {
    const mealIds = getMealSL();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}
//Get the favorite meals ( if we have any ) from localStorage
function getMealSL() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

//Loop trough the mealIds that we added in localStorage; get the ID, pass the ID to the getMealById() function which then calls again the API to get that specific entire recipe

async function fetchFavMeals() {
    //clean the container first and then we add the meals
    favoriteContainer.innerHTML = '';

    const mealIds = getMealSL();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealToFav(meal);
    }
}

// Create li elements dynamicaly of favorite meals;

function addMealToFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
		<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
			<span>${mealData.strMeal}</span>
			<button class="clear">
				<i class="fa-solid fa-square-xmark"></i>
			</button>
	`;

    const btn = favMeal.querySelector('.clear');
    btn.addEventListener('click', () => {
        removeMealSL(mealData.idMeal);

        fetchFavMeals();
    });

    favoriteContainer.appendChild(favMeal);
}
