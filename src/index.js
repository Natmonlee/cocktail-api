const express = require('express')
const bodyParser = require('body-parser')
const url = require('url')
const querystring = require('querystring')
// const Article = require('./models').Article;
const app = express()
const port = 5000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const xlsxFile = require('read-excel-file/node');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const results = [
  {name: "bloody mary", ingredients: ["tomato juice", "vodka"]},
  {name: "cosmopoliton", ingredients: ["cranberry juice", "vodka"]},
  {name: "whiskey sour", ingredients: ["whiskey", "lemon juice"]}
];

xlsxFile('all_drinks.xls').then(
  (result) => {
    const database = result;
    console.log(database);
    return database;
  }
)


app.get('/', (req, res) => {
  let search = req.query.search;
  res.send(database);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log(xlsxFile('all_drinks.xls'));


/*
const getResult = async () => {
  const endpoint = "https://api.api-ninjas.com/v1/cocktail?" + searchMethod + "=" + textInputValue;
  try {
      const response = await fetch(endpoint, {
          method: "GET",
          headers: {
              "X-Api-Key": "E6CyLZAZwxU0FySnN6w0IQ==Afe3GoBzy0YapmO8"
          }
      });
      if (response.ok) {
          const finalResponse = await response.json();     
  }
  catch (error) {
      console.log(error);
      throw new Error('Request failed!');
  };
} */