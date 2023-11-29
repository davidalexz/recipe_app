const meals = document.getElementById('meals');

getRandomMel();
fetchFavMeals();

// Get random meal; new meal on every refresh
async function getRandomMel() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    // loadRandomMeal();
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

// Create div.meal element dynamicaly
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
    });
    meals.appendChild(meal);
}

function addMealSL(mealId) {
    const mealIds = getMealSL();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealSL(mealId) {
    const mealIds = getMealSL();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealSL() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    const mealIds = getMealSL();

    const mealsData = [];

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        mealsData.push(meal);
    }

    console.log(mealsData);
}
