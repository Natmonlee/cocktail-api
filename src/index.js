const express = require('express')
const app = express()
const port = 5000

app.use(function(req, res, next) {
  req.header("Access-Control-Allow-Origin", "*");
  req.header(
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
  res.send(results);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



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