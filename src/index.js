const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const fs = require("fs");
const papa = require('papaparse')
let cocktailDatabase;
let formattedDatabase = [];
let searchName;
let searchAlcoholic;
let searchGlass;
let searchIngredients;
let allGlasses;
let searchMinIngredients;
let searchMaxIngredients;

const formatRecipe = (rawRecipe) => {
  let recipe = {};
  recipe.name = rawRecipe.Name;
  if (rawRecipe.Alcoholic.toLowerCase() === "alcoholic") {
    recipe.alcoholic = true;
  }
  else {
    recipe.alcoholic = false;
  }
  recipe.glass = rawRecipe.Glass.toLowerCase();
  recipe.photoUrl = rawRecipe.Photo;
  let ingredients = {};
  for (let i = 0; i < 16; i++) {
      for (const [key, value] of Object.entries(rawRecipe)){
          if (key === 'Ingredient ' + i) {
              if (value) {
                  ingredients[value.toLowerCase()] = rawRecipe['Measurement ' + i].toLowerCase();
              }
          }      
      }
  }
  recipe.ingredients = ingredients;
  recipe.method = rawRecipe.Method;
  return recipe;
} 

const formatDatabase = (database) => {
  for (const recipe of database) {
    if (recipe.Name) {
      formattedDatabase.push(formatRecipe(recipe));
    }
  }
  return formattedDatabase;
}

fs.readFile("all_drinks.csv", "utf-8", (err, data) => {
  if (err) {
    console.log(err)}
  else {
    cocktailDatabase = papa.parse(data, {header:true});
    formatDatabase(cocktailDatabase.data);
}
})

const generateResults = (database) => {
  
  const checkName = (inputName, recipe) => {
    if (!inputName) {
      return true;
    }
    else {
      return recipe.name.toLowerCase().includes(inputName);
    }
  };

  const checkAlcohol = (inputAlcohol, recipe) => {
    if (!inputAlcohol) {
      return true;
    }
    else {
      let alcoholPreference = true;
    if (inputAlcohol === 'false') {
      alcoholPreference = false;
    }
    return recipe.alcoholic === alcoholPreference;
    }
  };

  const checkGlass = (inputGlass, recipe) => {
    if (!inputGlass) {
      return true;
    }
    else {
      return recipe.glass.toLowerCase().includes(inputGlass);
    }
  };

  const checkIngredients = (inputIngredients, recipe) => {
    if (!inputIngredients) {
      return true;
    }
    else {
      const ingredientsArray = inputIngredients.split(',');
      for (const ingredient of ingredientsArray) {
        let included = false;
        for (const property in recipe.ingredients) {
          if (property.includes(ingredient)) {
            included = true;
          }
        }
        if (included === false) {
          return false;
        }     
      }
      return true;
    }
  }

  const checkNumOfIngredients = (inputMinIngredients, inputMaxIngredients, recipe) => {
    if (!inputMinIngredients && !inputMaxIngredients) {
      return true;
    }
    else {
      let minIngredients = 1;
      let maxIngredients = Infinity;
      if (inputMinIngredients) {
        minIngredients = inputMinIngredients;
      }
      if (inputMaxIngredients) {
        maxIngredients = inputMaxIngredients;
      }
      return Object.keys(recipe.ingredients).length >= minIngredients && Object.keys(recipe.ingredients).length <= maxIngredients;

    }
  };

  let results = [];
  for (const cocktail of database) {
    if (checkName(searchName, cocktail) && checkAlcohol(searchAlcoholic, cocktail) && checkGlass(searchGlass, cocktail) && checkIngredients(searchIngredients, cocktail) && checkNumOfIngredients(searchMinIngredients, searchMaxIngredients, cocktail)) {
      results.push(cocktail);
    }
  }
  return results;
} 

const returnAll = (param, database) => {
  const resultSet = new Set();
  for (recipe of database) {
    resultSet.add(recipe[param].toLowerCase());
  }
  const resultArray = [...resultSet];
  return resultArray;
}


const returnAllIngredients = (database) => {
  const resultSet = new Set();
  for (recipe of database) {
    for (ingredient in recipe.ingredients) {
      resultSet.add(ingredient.toLowerCase());
    }
  }
  const resultArray = [...resultSet];
  return resultArray;
} 



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST"
  );
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/v1/add-cocktail', (req,res) => {
  let response = [];
  if (!req.body.name) {
    response.push('name key required(value must be a String)');
  }
  else if (typeof req.body.name !== "string") {
    response.push('value of name key must be a String');
  }
  if (!req.body.alcoholic) {
    response.push('alcoholic key required(value must be a Boolean)');
  }
  else if (typeof req.body.alcoholic !== "boolean") {
    response.push('value of alcoholic key must be a Boolean');
  }
  if (req.body.glass) {
    if (typeof req.body.glass !== "string") {
      response.push('value of glass key must be a String');
    }
  }
  console.log(response);
  if (response.length === 0) {
    formattedDatabase.push(req.body);
  }
  res.send(response);
}
)

/*
Object properties: <br>
            photoUrl (string - valid url) optional <br>
            ingredients (object containing one or more keys of data-type string) required <br>
            method (string) required <br></br>

            res.send(response???
                Code 200 Description successful operation <br>
        Code 405 Description Invalid input)
*/


app.get('/cocktail-recipes', (req, res) => {
  if (req.query.name) {
    searchName = req.query.name.toLowerCase();
  }
  if (req.query.alcoholic) {
    searchAlcoholic = req.query.alcoholic;
  }
  if (req.query.ingredients) {
    searchIngredients = req.query.ingredients.toLowerCase();
  }
  if (req.query.glass) {
    searchGlass = req.query.glass.toLowerCase();
  }
  if (req.query.minIngredients) {
    searchMinIngredients = req.query.minIngredients;
  }
  if (req.query.maxIngredients) {
    searchMaxIngredients = req.query.maxIngredients;
  }

  res.send(generateResults(formattedDatabase));
}
)

app.get('/v1/cocktail-glasses', (req, res) => {
  allGlasses = returnAll('glass', formattedDatabase);
  res.send(allGlasses);
}
)

app.get('/v1/cocktail-ingredients', (req, res) => {
  res.send(returnAllIngredients(formattedDatabase));
}
)


