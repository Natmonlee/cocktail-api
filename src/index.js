const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

fs.readFile("data.csv", "utf-8", (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});


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




app.get('/', (req, res) => {
  //let search = req.query.search;
  res.send("hello");
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