const glassResultSection = document.getElementById("glassResult");
const ingredientResultSection = document.getElementById("ingredientResult");
const cocktailResultSection = document.getElementById("cocktailResult");
const postResultSection = document.getElementById("postResult");

const menuItem1 = document.getElementById('menuItem1');
const dropItem1 = document.getElementById('dropItem1');
const menuItem2 = document.getElementById('menuItem2');
const dropItem2 = document.getElementById('dropItem2');
const menuItem3 = document.getElementById('menuItem3');
const dropItem3 = document.getElementById('dropItem3');
const menuItem4 = document.getElementById('menuItem4');
const dropItem4 = document.getElementById('dropItem4');

const addDropdownOnClick = (menuItem, dropItem) => {
    menuItem.addEventListener("click", () => dropItem.classList.toggle("dropDownActive"));
};

addDropdownOnClick(menuItem1, dropItem1);
addDropdownOnClick(menuItem2, dropItem2);
addDropdownOnClick(menuItem3, dropItem3);
addDropdownOnClick(menuItem4, dropItem4);

const getResult = async () => {
    let ingredients = ['rum','vodka','orange','ice','cream'];
    //const endpoint = "http://13.41.54.243/";
    const glassEndpoint = 'http://localhost:5000/v1/cocktail-glasses'
    const ingredientEndpoint = 'http://localhost:5000/v1/cocktail-ingredients'
    const cocktailEndpoint = "http://localhost:5000/cocktail-recipes?name=new";
    const postEndpoint = "http://localhost:5000/v1/add-cocktail";
    try {

        let headers = new Headers();
        headers.append("Content-type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Origin", "http://localhost:3000");


        const glassResponse = await fetch(glassEndpoint, {
            method: "GET"
        });
        const ingredientResponse = await fetch(ingredientEndpoint, {
            method: "GET"
        });
    
        const postResponse = await fetch(postEndpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
            "name": "New cocktail",
            "alcoholic": true,
            "glass": "cocktail glass",
            "Ingredients": "rum, vodka, orange, coconut"
        })
        });

        const cocktailResponse = await fetch(cocktailEndpoint, {
            method: "GET"
        });


        if (glassResponse.ok) {
            const glassResultText = await glassResponse.json();
            glassResultSection.innerHTML = JSON.stringify(glassResultText);
            }
        
        if (ingredientResponse.ok) {
            const ingredientResultText = await ingredientResponse.json();
            ingredientResultSection.innerHTML = JSON.stringify(ingredientResultText);
            }

        if (postResponse.ok) {
            const postResultText = await postResponse.json();
            postResultSection.innerHTML = JSON.stringify(postResultText);  
            }
        
        
        if (cocktailResponse.ok) {
            const cocktailResultText = await cocktailResponse.json();
            cocktailResultSection.innerHTML = JSON.stringify(cocktailResultText, null, 4);
        }

    
        }


    
    catch (error) {
        console.log(error);
        throw new Error('Request failed!');
    };
}

getResult();