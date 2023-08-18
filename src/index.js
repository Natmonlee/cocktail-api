const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const fs = require("fs");
const papa = require('papaparse')
let database;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

fs.readFile("all_drinks.csv", "utf-8", (err, data) => {
  if (err) {
    console.log(err)}
  else {
    database = papa.parse(data, {header:true});
}
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let searchName;
let searchAlcoholic;
let searchGlass;
let searchIngredients;

const generateResults =  (database) => {
  let results = [];
  for (const recipe of database) {
    if (recipe.Name.toLowerCase().includes(searchName.toLowerCase()) === true) {
      results.push(recipe);
    }
  }
  return results;
}



const formatFetchedRecipe = (fetchedRecipe) => {
  let recipe = {};
  recipe.name = fetchedRecipe.Name;
  recipe.alcoholic = fetchedRecipe.Alcoholic === 'Alcoholic' ? true : false;
  recipe.glass = fetchedRecipe.Glass;
  recipe.photoUrl = fetchedRecipe.Photo;
  let ingredients = {};
  for (let i = 0; i < 16; i++) {
      for (const [key, value] of Object.entries(fetchedRecipe)){
          if (key === 'Ingredient ' + i) {
              if (value) {
                  ingredients[value] = fetchedRecipe['Measurement ' + i];
              }
          }      
      }
  }
  recipe.ingredients = ingredients;
  recipe.method = fetchedRecipe.Method;
  return recipe;
}


app.get('/', (req, res) => {
  //const results = formatFetchedRecipe(database.data[search]);
  searchName = req.query.name;
  searchAlcoholic = req.query.alcoholic;
  searchGlass = req.query.glass;
  searchIngredients = req.query.ingredients;
  res.send(generateResults(database.data));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


