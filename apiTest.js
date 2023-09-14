const glassResultSection = document.getElementById("glassResult");
const ingredientResultSection = document.getElementById("ingredientResult");
const cocktailResultSection = document.getElementById("cocktailResult");

const getResult = async () => {
    //const endpoint = "http://13.41.54.243/";
    const glassEndpoint = 'http://localhost:5000/v1/cocktail-glasses'
    const ingredientEndpoint = 'http://localhost:5000/v1/cocktail-ingredients'
    const cocktailEndpoint = 'http://localhost:5000/cocktail-recipes?alcoholic=false&ingredients=orange';
    try {
        const glassResponse = await fetch(glassEndpoint, {
            method: "GET"
        });
        const ingredientResponse = await fetch(ingredientEndpoint, {
            method: "GET"
        });
        const cocktailResponse = await fetch(cocktailEndpoint, {
            method: "GET"
        });

        if (glassResponse.ok) {
            const glassResultText = await glassResponse.json();
            glassResultSection.innerHTML = glassResultText;
            }
        
        if (ingredientResponse.ok) {
            const ingredientResultText = await ingredientResponse.json();
            ingredientResultSection.innerHTML = ingredientResultText;
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