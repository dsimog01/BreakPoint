const neo4j = require('neo4j-driver');
const express = require('express');
const port = process.env.port || 3001;
const app = express();
const bcrypt = require('bcrypt');
  
const uri = 'neo4j+s://b97dd18a.databases.neo4j.io';
const user = 'neo4j';
const password = '2q11olPZezAyb_JCkcn0QvHlUiPy7qKRQhLpCGGK2b0';
  
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { disableLosslessIntegers: true })
const session = driver.session()

app.get("/getRackets", (req, res) => {
  let query = `MATCH (r:Racket)
              RETURN r`;
  return getFromDB(query);
});

app.get("/getRatedRackets", (req, res) => {
  getRatedRackets().then(function(result){
    console.log(result[0]);
  });
});

app.get("/getRaters", (req, res) => {
  getRaters().then(function(result){
    console.log(result);
  });
});

async function getRaters() {

  let query = `MATCH (r:Racket), (u:User)
              WHERE (u)-[:RATED]->(r)
              RETURN u`;

  return getFromDB(query);
}

async function getRatedRackets() {

  let query = `MATCH (r:Racket), (u:User)
              WHERE (u)-[:RATED]->(r)
              RETURN r`;

  return getFromDB(query);
}

app.get("/getCollabTable", async (req, res) => {
    console.log(await getCollabTable());
});

async function getCollabTable() {
  
    let collabTable = {};

    let raters = await getRaters();      

    for(let rater of raters){
      let userRatings = {};
  
      let racketsRated = await getRacketsRatedByUser(rater._fields[0].properties.username);

        for(let racketRated of racketsRated){

          let rating = await getRating(racketRated._fields[0].properties.modelID, rater._fields[0].properties.username);
            userRatings[racketRated._fields[0].properties.modelID] = rating[0]._fields[0];
        }
    
        collabTable[rater._fields[0].properties.username] = userRatings;
    }

    return collabTable;
}

async function getRating(modelID, username) {
    
  let query = `MATCH (u:User)-[rt:RATED]->(r:Racket)
              WHERE u.username = '${username}' AND r.modelID = '${modelID}'
              RETURN rt.rating`;
  
  return getFromDB(query);
}

async function getFromDB(query){
  let result = await session.readTransaction(tx =>
    tx.run(query) 
  );

  return result.records;
}

async function getRacketsRatedByUser(username) {

  let query = `MATCH (u:User)-[:RATED]->(r:Racket)
              WHERE u.username = '${username}'
              RETURN r`;

  return getFromDB(query);
}

app.get("/getRacketsRatedByUser/", async (req, res) => {
  let rackets = await getRacketsRatedByUser(req.query.username);
  console.log(rackets);
});


app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});