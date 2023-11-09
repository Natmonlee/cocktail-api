let glassResultSection = document.getElementById("glassResult");
let ingredientResultSection = document.getElementById("ingredientResult");
let cocktailResultSection = document.getElementById("cocktailResult");
let postResultSection = document.getElementById("postResult");
let endpointText = document.getElementById("endpointText");
let example = document.getElementById("example");
let responseStatus = document.getElementById("responseStatus");
let responseBody = document.getElementById("responseBody");

const dropItem1 = document.getElementById('dropItem1');
const dropItem2 = document.getElementById('dropItem2');
const dropItem3 = document.getElementById('dropItem3');
const dropItem4 = document.getElementById('dropItem4');
const clickArea1 = document.getElementById('clickArea1');
const clickArea2 = document.getElementById('clickArea2');
const clickArea3 = document.getElementById('clickArea3');
const clickArea4 = document.getElementById('clickArea4');


const addDropdownOnClick = (clickArea, dropItem) => {
    clickArea.addEventListener("click", () => dropItem.classList.toggle("dropDownActive"));
};

addDropdownOnClick(clickArea1, dropItem1);
addDropdownOnClick(clickArea2, dropItem2);
addDropdownOnClick(clickArea3, dropItem3);
addDropdownOnClick(clickArea4, dropItem4);


const getResult = async () => {
    const glassEndpoint = 'http://13.41.54.243/v1/cocktail-glasses'
    const ingredientEndpoint = 'http://13.41.54.243/v1/cocktail-ingredients'
    try {
        let headers = new Headers();
        headers.append("Content-type", "application/json");
        headers.append("Accept", "application/json");

        const glassResponse = await fetch(glassEndpoint, {
            method: "GET"
        });
        const ingredientResponse = await fetch(ingredientEndpoint, {
            method: "GET"
        });
        if (glassResponse.ok) {
            const glassResultText = await glassResponse.json();
            glassResult.innerHTML = JSON.stringify(glassResultText);
        }
        if (ingredientResponse.ok) {
            const ingredientResultText = await ingredientResponse.json();
            ingredientResultSection.innerHTML = JSON.stringify(ingredientResultText);
        }
    }
    catch (error) {
        console.log(error);
        throw new Error('Request failed!');
    };
}

getResult();

const searchCocktails = async () => {
    let cocktailEndpoint = "http://13.41.54.243/v1/cocktail-recipes?";
    let nameInput = document.getElementById("name").value;
    let alcoholicTrueInput = document.getElementById("true").checked;
    let alcoholicFalseInput = document.getElementById("false").checked;
    let glassInput = document.getElementById("glass").value;
    let ingredientsInput = document.getElementById("ingredients").value;
    let minIngredientsInput = document.getElementById("minIngredients").options.selectedIndex;
    let maxIngredientsInput = document.getElementById("maxIngredients").options.selectedIndex;

    if (nameInput) {
        cocktailEndpoint += "name=" + nameInput + "&";
    }
    if (alcoholicTrueInput) {
        cocktailEndpoint += "alcoholic=true&";
    }
    if (alcoholicFalseInput) {
        cocktailEndpoint += "alcoholic=false&";
    }
    if (glassInput) {
        cocktailEndpoint += "glass=" + glassInput + "&";
    }
    if (ingredientsInput) {
        cocktailEndpoint += "ingredients=" + ingredientsInput + "&";
    }
    if (minIngredientsInput) {
        cocktailEndpoint += "minIngredients=" + minIngredientsInput + "&";
    }
    if (maxIngredientsInput) {
        cocktailEndpoint += "maxIngredients=" + maxIngredientsInput + "&";
    }

    try {
        let cocktailResponse = await fetch(cocktailEndpoint, {
            method: "GET"
        });

        if (cocktailResponse.ok) {
            let cocktailResultText = await cocktailResponse.json();
            endpointText.innerHTML = "Endpoint: " + cocktailEndpoint;
            example.innerHTML = "";
            cocktailResultSection.innerHTML = JSON.stringify(cocktailResultText, null, 4);
        }
    }
    catch (error) {
        console.log(error);
        throw new Error('Request failed!');
    };
}


const addCocktail = async () => {
    const postEndpoint = "http://13.41.54.243/v1/add-cocktail";
    try {
        let headers = new Headers();
        headers.append("Content-type", "application/json");
        headers.append("Accept", "application/json");

        let postInput = document.getElementById("postInput").innerHTML;
        let postInputFormatted = postInput.replaceAll('\n', '');
        let postResponse = await fetch(postEndpoint, {
            method: "POST",
            headers: headers,
            body: postInputFormatted
        });
        
        let postResponseBody = await postResponse.json();
        responseStatus.innerHTML = `${postResponse.status}<br>${postResponse.statusText}`;
        console.log(postResponseBody);
        responseBody.innerHTML = JSON.stringify(postResponseBody);
    }
    catch (error) {
        console.log(error);
        throw new Error('Request failed!');
    };
}

const getSubmitButton = document.getElementById("getCocktailSubmit");
getSubmitButton.addEventListener("click", searchCocktails);

const postSubmitButton = document.getElementById("postCocktailSubmit");
postSubmitButton.addEventListener("click", addCocktail);
