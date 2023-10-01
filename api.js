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
const path = require('path');

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
    for (const [key, value] of Object.entries(rawRecipe)) {
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

fs.readFile("./documentation/assets/data/all_drinks.csv", "utf-8", (err, data) => {
  if (err) {
    console.log(err)
  }
  else {
    cocktailDatabase = papa.parse(data, { header: true });
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

function isUrlValid(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.append("Access-Control-Allow-Origin", "*");
  res.append(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  res.append(
    "Access-Control-Allow-Methods",
    "GET, POST"
  );
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/v1/add-cocktail', (req, res) => {
  let responseBody = {
    "success": true,
    "errors": {}
  };

  if (!req.body.name) {
    responseBody.success = false;
    responseBody.errors.nameError = 'name(lowercase) property required(value must be a String)';
  }
  else if (typeof req.body.name !== "string") {
    responseBody.success = false;
    responseBody.errors.nameError = 'value of name property must be a String';
  }
  if (!req.body.alcoholic) {
    responseBody.success = false;
    responseBody.errors.alcoholicError = 'alcoholic(lowercase) property required(value must be a Boolean)';
  }
  else if (typeof req.body.alcoholic !== "boolean") {
    responseBody.success = false;
    responseBody.errors.alcoholicError = 'value of alcoholic property must be a boolean';
  }
  if (req.body.glass) {
    if (typeof req.body.glass !== "string") {
      responseBody.success = false;
      responseBody.errors.glassError = 'value of glass property must be a string';
    }
  }
  if (!req.body.method) {
    responseBody.success = false;
    responseBody.errors.methodError = 'method(lowercase) property required(value must be a string)';
  }
  else if (typeof req.body.method !== "string") {
    responseBody.success = false;
    responseBody.errors.methodError = 'value of method property must be a string';
  }
  if (req.body.photoUrl) {
    if (typeof req.body.photoUrl !== "string") {
      responseBody.success = false;
      responseBody.errors.photoUrlError = 'value of photoUrl property must be a string';
    }
    else if (isUrlValid(req.body.photoUrl) === false) {
      responseBody.success = false;
      responseBody.errors.photoUrlError = 'value of photoUrl property must be a valid URL';
    }
  }
  if (!req.body.ingredients) {
    responseBody.success = false;
    responseBody.errors.ingredientsError = 'ingredients(lowercase) property required(value must be an object with properties of the string-type)';
  }
  else if (typeof req.body.ingredients !== "object") {
    responseBody.success = false;
    responseBody.errors.ingredientsError = 'value of ingredients property must be an object with properties of the string-type';
  }
  else if (Object.keys(req.body.ingredients).length === 0) {
    responseBody.success = false;
    responseBody.errors.ingredientsError = 'ingredients object must have at least one property(of string-type)'
  }
  else for (const ingredient in req.body.ingredients) {
    if (typeof ingredient !== "string") {
      responseBody.success = false;
      responseBody.errors.ingredientsError = 'properties of ingredients object must be strings'
    }
  }

  if (req.body.maxIngredients) {
    if (typeof req.body.maxIngredients !== "number") {
      responseBody.success = false;
      responseBody.errors.maxIngredientsError = 'value of maxIngredients must be a number'
    }
  }

  if (req.body.minIngredients) {
    if (typeof req.body.minIngredients !== "number") {
      responseBody.success = false;
      responseBody.errors.minIngredientsError = 'value of minIngredients must be a number'
    }
  }

  else if (req.body.maxIngredients && req.body.minIngredients) {
    if (req.body.maxIngredients < req.body.minIngredients) {
      responseBody.success = false;
      responseBody.errors.minIngredientsError = 'value of minIngredients cannot be larger than value of maxIngredients)';
    }
  }
  if (responseBody.success === true) {
    formattedDatabase.push(req.body);
    res.status(201).send(responseBody);
  }
  else {
    res.status(400).send(responseBody);
  }
}
)

app.get('/v1/cocktail-recipes', (req, res) => {
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

app.use(express.static(__dirname + '/documentation'))

app.get('/v1/documentation', (req, res) => {
  res.sendFile(__dirname + '/documentation/index.html')
}
)
