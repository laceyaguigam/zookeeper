//these two are required to set up the server to start express (const express&app)
const express = require('express');

//this one sets an environmental variable (heroku uses port 80 but this allows it to use whatevers needed)
const PORT = process.env.PORT || 3001;
const app = express();

const { animals } = require(`./:data/animals`);

//handles the filter functionality without being in .get()
//this takes req.query as an argument and filters through the animals accordingly
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
   
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
     
        // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
     
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
       
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

  //takes in the id and array of animals and returns a single animal object
  function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }


//route that the front-end can request data from
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
  
  app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
        //sends the 404 error code
      res.send(404);
    }
  });
  
  app.post(`/api/animals`, (re, res) => {});

//to make the server listen 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


