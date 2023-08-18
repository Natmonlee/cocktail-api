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

const formatRecipe = (rawRecipe) => {
  let recipe = {};
  recipe.name = rawRecipe.Name;
  recipe.alcoholic = rawRecipe.Alcoholic;
  recipe.glass = rawRecipe.Glass;
  recipe.photoUrl = rawRecipe.Photo;
  let ingredients = {};
  for (let i = 0; i < 16; i++) {
      for (const [key, value] of Object.entries(rawRecipe)){
          if (key === 'Ingredient ' + i) {
              if (value) {
                  ingredients[value] = rawRecipe['Measurement ' + i];
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
    if (inputName === 'undefined') {
      return true;
    }
    else {
      return recipe.name.toLowerCase().includes(inputName);
    }
  };

  const checkAlcohol = (inputAlcohol, recipe) => {
    if (inputAlcohol === 'undefined') {
      return true;
    }
    else {
      let alcoholPreference = 'Alcoholic';
    if (inputAlcohol === 'false') {
      alcoholPreference = 'Non alcoholic';
    }
    return recipe.alcoholic === alcoholPreference;
    }
  };

  const checkGlass = (inputGlass, recipe) => {
    if (inputGlass === 'undefined') {
      return true;
    }
    else {
      return recipe.glass.toLowerCase().includes(inputGlass);
    }
  };

  // INGREDIENTS CHECK

  let results = [];
  for (const cocktail of database) {
    if (checkName(searchName, cocktail) && checkAlcohol(searchAlcoholic, cocktail) && checkGlass(searchGlass, cocktail)) {
      results.push(cocktail);
    }
  }
  return results;
} 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
  //const results = formatFetchedRecipe(database.data[search]);
  searchName = req.query.name.toLowerCase();
  searchAlcoholic = req.query.alcoholic;
  searchGlass = req.query.glass.toLowerCase();
  //searchIngredients = req.query.ingredients.toLowerCase();
  res.send(generateResults(formattedDatabase));
})