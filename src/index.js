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

const formatFetchedInfo = (fetchedInfo) => {
  let recipe = [];
  recipe.push(fetchedInfo.Name);
  recipe.push(fetchedInfo.Alcoholic);
  recipe.push(fetchedInfo.Glass);
  recipe.push(fetchedInfo.Photo);
  let fetchedIngredientsList = {};
  for (let i = 0; i < 16; i++) {
      for (const [key, value] of Object.entries(fetchedInfo)){
          if (key === 'Ingredient ' + i) {
              if (value) {
                  fetchedIngredientsList[value] = fetchedInfo['Measurement ' + i];
              }
          }      
      }
  }
  recipe.push(fetchedIngredientsList);
  recipe.push(fetchedInfo.Method);
  return recipe;
}


app.get('/', (req, res) => {
  let search = req.query.search;
  let currentRecipe = database.data[search];
  res.send(formatFetchedInfo(currentRecipe));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


