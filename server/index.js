const neo4j = require('neo4j-driver');
const express = require('express');
const port = process.env.port || 3001;
const app = express();
const bcrypt = require('bcrypt');
var { jStat } = require('jstat');

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
  let collabTable = await getCollabTable();
  console.log(collabTable);
});

app.get("/getUsersCorrelation", async (req, res) => {
  let mainUserID = req.query.mainUserID;
  let collabTable = await getCollabTable();
  let correlations = await getUsersCorrelation(mainUserID, collabTable);
  console.log(correlations);
  res.send(correlations);
});

async function getUsersCorrelation(mainUserID, collabTable){
  
  let tmp = [], correlations = [];
  let correlation;


  for(let i = 0; i < collabTable.length; i++){

    correlation = [i+1, jStat.corrcoeff(collabTable[mainUserID-1], collabTable[i])];
    tmp.push(correlation);
  }

  correlations = [arrayColumn(tmp, 0), arrayColumn(tmp, 1)];

  //Current user row deleted
  correlations[0].splice(mainUserID-1, 1);
  correlations[1].splice(mainUserID-1, 1);

  return correlations;
  
}

const arrayColumn = (array, n) => array.map(x => x[n]);

async function getXMostSimilarUsers(mainUserID, collabTable, x){

  let correlations = await getUsersCorrelation(mainUserID, collabTable);
  let similarUsers = [];
  let maxValue, userID;

  for (let i = 0; i < x; i++) {
    maxValue = Math.max.apply(null, correlations[1]);
    userID = correlations[0][correlations[1].indexOf(maxValue)];
    similarUsers.push(userID);
    correlations[0].splice(userID-1, 1);
    correlations[1].splice(correlations[1].indexOf(maxValue), 1);
  }

  return similarUsers;
}

//Delete this (test function)
app.get("/getPrediction", async (req, res) => {

  let collabTable = [[3,5,2,0,0], [3.5,4,3,4.5,2], [5,2.5,5,2.5,5]];
  let correlations = [[2,3],[0.981,-0.944]];

  let prediction = getPrediction(collabTable, 1, 2, 4, correlations);

  console.log(prediction);

  res.send("OK");
});

function getPrediction(collabTable, user1, user2, racketID, correlations){
  
  let user1Ratings = collabTable[user1-1].filter(function(value){ return value > 0; });
  let user2Ratings = collabTable[user2-1].filter(function(value){ return value > 0; });

  let avg1 = user1Ratings.reduce((a, b) => a + b, 0) / user1Ratings.length;
  let avg2 = user2Ratings.reduce((a, b) => a + b, 0) / user2Ratings.length;

  let correlation = correlations[1][correlations[0].indexOf(user2)];

  let prediction = avg1 + (((collabTable[user2-1][racketID-1]-avg2)*correlation)/(correlation));

  return prediction;
}

app.get("/getSimilarUsers", async (req, res) => {
  
  let mainUserID = req.query.mainUserID;
  let similarUsers = await getXMostSimilarUsers(mainUserID, await getCollabTable(), 2);
  console.log(similarUsers);
  res.send(similarUsers);
  
});

async function getCollabTable() {

  let collabTable = [];
  
  let racketsNumber = (await getNumberOfRackets())[0].get(0);
  let usersNumber = (await getNumberOfUsers())[0].get(0);

  putZeros(collabTable, usersNumber, racketsNumber);

  let allRatings = await getAllRatings();

  allRatings.forEach(function(rating){
    collabTable[rating._fields[0].properties.userID-1][rating._fields[2].properties.modelID-1] = rating._fields[1].properties.rating;
  });

  return collabTable;
}

function putZeros(collabTable, usersNumber, racketsNumber){

  let userRatings = [];

  for(let j = 0; j < racketsNumber; j++){
    userRatings.push(0);
  }

  for(let i = 0; i < usersNumber; i++){

    collabTable.push(userRatings.slice());
  }
}


async function getAllRatings(){
  let query = `MATCH (u:User)-[rt:RATED]->(r:Racket)
              RETURN u,rt,r`;

  return getFromDB(query);
}

async function getNumberOfRackets() {

  let query = `MATCH (r:Racket)
              RETURN COUNT(r)`;

  return getFromDB(query);
}

async function getNumberOfUsers() {
  
    let query = `MATCH (u:User)
                RETURN COUNT(u)`;
  
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