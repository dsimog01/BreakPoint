const neo4j = require('neo4j-driver');
const express = require('express');
const port = process.env.port || 3001;
var bodyParser = require('body-parser');
const app = express();
var { jStat, create } = require('jstat');
const { compareSync } = require('bcrypt');
var jsonParser = bodyParser.json();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST' | 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

////////// -- NEO4J -- //////////
const uri = 'neo4j+s://810f4585.databases.neo4j.io';
const user = 'neo4j';
const password = 'UliD-L2_x9nE8czZXxOzi-s8bBVwwy2hDPL5CnaoZqk';
  
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { disableLosslessIntegers: true })
const session = driver.session()

////////// -- HTTP GET INFO FROM DB -- //////////

app.get("/getHeadSizes", async (req, res) => {

  try{
    let headSizes = await getHeadSizes(req.query.brand);
    res.json({message: JSON.stringify(headSizes)});
  }catch(err){
    console.log(err);
  }

  //res.send(headSizes);
});

app.get("/getRacketBrands", async (req, res) => {

  try{
    let brands = await getRacketBrands();

    res.json({message: JSON.stringify(brands)});
  }catch(err){
    console.log(err);
  }

});

app.get("/getRacketLengths", async (req, res) => {
  
    try{
      let lengths = await getRacketLengths(req.query.brand, req.query.headSize);
      res.json({message: JSON.stringify(lengths)});
    }catch(err){
      console.log(err);
    }
  
});

app.get("/getRacketWeights", async (req, res) => {
  
    try{
      let weights = await getRacketWeights(req.query.brand, req.query.headSize, req.query.length);
      res.json({message: JSON.stringify(weights)});
    }catch(err){
      console.log(err);
    }
  
});

app.get("/setRacketRating", async (req, res) => {
  try{
    await saveRacketRaterRating(req.query.username, req.query.brand, req.query.headSize, req.query.length, req.query.weight, req.query.rating);
    res.json({message: "Success"});
  }catch(err){
    console.log(err);
    res.json({message: "Error"});

  }
});

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

app.get("/getContentRecommendation", async (req, res) => {
  console.log(req.query.username + " has requested a content recommendation");
  let contentRecommendation = await getContentRecommendation(req.query.username);
  let bestRackets = getXMostSimilar(contentRecommendation, 3);
  console.log(bestRackets);
  //Model IDs sent
  res.send(bestRackets);
});

app.get("/getCollaborativeRecommendation", async (req, res) => {
  console.log(req.query.username + " has requested a collaborative recommendation");
  let collaborativeRecommendation = await getCollaborativeRecommendation(req.query.username);
  let bestRackets = getXMostSimilar(collaborativeRecommendation, 3);
  console.log(bestRackets);
  //Model IDs sent
  res.send(bestRackets);
});

app.get("/getHybridRecommendation", async (req, res) => {
  console.log(req.query.username + " has requested a hybrid recommendation");
  let hybridRecommendation = await getHybridRecommendation(req.query.username);
  let bestRackets = getXMostSimilar(hybridRecommendation, 3);
  console.log(bestRackets);
  //Model IDs sent
  res.send(bestRackets);
});

app.get("/getStringRecommendation", async (req, res) => {

  let username = req.query.username;
  let selectedPlayerName = req.query.selectedPlayer;
  let selectedRacketID = parseInt(req.query.selectedRacketID);
  let userWeight = parseInt(req.query.userWeight);
  let userHeight = parseFloat(req.query.userHeight);

  console.log(username + " has requested a string recommendation");

  let stringsUsedWithSelectedRacket = await getStringsUsedWithRacket(selectedRacketID);

  let stringRecommendation = await getStringRecommendation(username, selectedPlayerName, userHeight, userWeight, stringsUsedWithSelectedRacket);
  let bestStrings = getXMostSimilar(stringRecommendation, 3);
  console.log(bestStrings);
  //Model IDs sent
  res.send(bestStrings);
});

app.post("/postRacketRatings", jsonParser, async (req,res) => {

  console.log(req.query.username + " has posted new racket ratings");

  [username, modelIDs, ratingValues] = getRequestArrays(req.body, req.query.username);

  await saveRacketRatings(username, modelIDs, ratingValues);
  res.send('');
});

app.post('/getRacketsDetails', jsonParser, async (req, res) => {
  let modelIDs = req.body;
  let query = `MATCH (b:Brand)<-[:IS_OF_BRAND]-(r:Racket)-[:HAS_DIMENSIONS]->(d:Dimension)
              WHERE r.modelID IN [${modelIDs}] AND r.flex IS NOT NULL
              RETURN r.modelID, b.brandName, r.price_Dol, d.headSize_in2, d.length_in, r.stringPattern_VxH, d.weightUnstrung_g`;
  let result = await getFromDB(query);
  res.send(result);
});

app.post('/getStringsDetails', jsonParser, async (req, res) => {
  let modelIDs = req.body;
  let query = `MATCH (b:Brand)<-[:IS_OF_BRAND]-(s:String)-[:HAS_DIMENSIONS]->(d:Dimension)
              WHERE s.modelID IN [${modelIDs}] AND s.type IS NOT NULL
              RETURN s.modelID, b.brandName, s.type, s.composition, d.gauge_mm`;
  let result = await getFromDB(query);
  res.send(result);
});

app.post("/postStringRatings", jsonParser, async (req,res) => {
  console.log(req.query.username + " has posted new string ratings");

  [username, modelIDs, ratingValues] = getRequestArrays(req.body, req.query.username);

  await saveStringRatings(username, modelIDs, ratingValues);
  res.send('');
});

function getRequestArrays(ratings, userEmail){
  let modelIDs = Object.keys(ratings);
  modelIDs = modelIDs.map((x) => {return parseInt(x, 10)});
  let ratingValues = Object.values(ratings);
  ratingValues = ratingValues.map((x) => {return parseInt(x, 10)});
  let username = userEmail.split("@")[0];

  return [username, modelIDs, ratingValues];
}

app.get("/getTopPlayersNames", async (req, res) => {

  res.send(await getTopPlayersNames());
});

////////// -- QUERIES FOR DB -- //////////
async function saveRacketRatings(username, modelIDs, ratings){
  saveRatings(username, modelIDs, ratings, "Racket");
}

async function saveStringRatings(username, modelIDs, ratings){
  saveRatings(username, modelIDs, ratings, "String");
}

async function saveRatings(username, modelIDs, ratings, type) {
  let model, rating, query;
  if(!(await userExists(username))){
    await createUser(username);
  }

  for(let i = 0; i < modelIDs.length; i++){
    model = modelIDs[i];
    rating = ratings[i];
    query = `MATCH (r:${type}), (u:User)
            WHERE r.modelID =toInteger('${model}') AND u.username = '${username}'
            MERGE (u)-[:RATES {rating: toInteger('${rating}')}]->(r)`;
    await updateDB(query);
  }
}

async function saveRacketRaterRating(username, brand, headSize, length, weight, rating){
  if(!(await userExists(username))){
    await createUser(username);
  }

  console.log(brand);
  console.log(headSize);
  console.log(length);
  console.log(weight);
  console.log(rating);
  console.log(username);

  let query = `MATCH (b:Brand)<-[:IS_OF_BRAND]-(r:Racket)-[:HAS_DIMENSIONS]->(d:Dimension), (u:User)
  WHERE b.brandName = '${brand}' AND d.headSize_in2 = toInteger('${headSize}') AND d.length_in = toInteger('${length}') AND d.weightUnstrung_g = toInteger('${weight}') AND u.username = '${username}'
  MERGE (u)-[:RATES {rating: toInteger('${rating}')}]->(r)`;

  return await updateDB(query);
}


async function createUser(username) {
  let query = `CREATE (u:User {username: '${username}'})`;
  return await updateDB(query);
}

async function userExists(username){
  let query = `MATCH (u:User)
              WHERE u.username = '${username}'
              RETURN COUNT(u)`;

  let count = (await getFromDB(query))[0]._fields[0];

  return (count!=0);
}

async function getAllHeadSizes(){
  let query = `MATCH (d:Dimension)
  WHERE d.headSize_in2 IS NOT NULL
  RETURN DISTINCT d.headSize_in2 ORDER BY d.headSize_in2`;

  let result = await getFromDB(query);

  let headSizes = [];

  result.forEach(head => {
    headSizes.push(head._fields[0]);
  });

  return headSizes;
}

async function getStringsUsedWithRacket(racketID){
  let query = `MATCH (r:Racket)<-[:USES_RACKET]-(tp:TopPlayer)-[:USES_STRING]->(s:String)
              WHERE r.modelID = toInteger('${racketID}')
              RETURN DISTINCT s.modelID`;

  let result = await getFromDB(query); 

  let strings = [];

  result.forEach(string => {
    strings.push(string._fields[0]);
  });

  return strings;
}

async function getAllStringCompositions(){
  let query = `MATCH (s:String)
  RETURN DISTINCT s.composition`;

  let result = await getFromDB(query);

  let compositions = [];

  result.forEach(composition => {
    compositions.push(composition._fields[0]);
  });

  return compositions;
}

async function getAllGauges(){
  let query = `MATCH (s:String)-[:HAS_DIMENSIONS]->(d:Dimension)
              RETURN DISTINCT d.gauge_mm`;

  let result = await getFromDB(query);

  let gauges = [];

  result.forEach(gauge => {
    gauges.push(gauge._fields[0]);
  });

  return gauges;
}

async function getPlayerStrings(){
  let query = `MATCH (tp:TopPlayer)-[:USES_STRING]->(s:String)
  RETURN s.modelID, tp.playerName ORDER BY s.modelID`;

  let result = await getFromDB(query);

  let stringsCount = await getStringsCount();
  let stringDict = {};

  for (let i=1; i<=stringsCount; i++){
    stringDict[i] = [];
  }
  
  result.forEach(stringPlayer => {
    stringDict[stringPlayer._fields[0]].push(stringPlayer._fields[1]);
  });

  return stringDict;
}

async function getTopPlayersComplexionData(){
  let query = `MATCH (tp:TopPlayer)
  RETURN tp.playerName, tp.height_m, tp.weight_kg`;

  let result = await getFromDB(query);

  let topPlayers = [];

  result.forEach(topPlayer => {
    topPlayers.push({
      playerName: topPlayer._fields[0],
      height: topPlayer._fields[1],
      weight: topPlayer._fields[2]
    });
  });

  return topPlayers;
}

async function getStringsCount(){
  let query = `MATCH (s:String)
  RETURN COUNT(s)`;

  let result = await getFromDB(query);

  return result[0]._fields[0];
}

async function getRatedRackets() {

  let query = `MATCH (r:Racket), (u:User)
              WHERE (u)-[:RATED]->(r)
              RETURN r`;

  return getFromDB(query);
}

async function getAllRatings(){
  let query = `MATCH (u:User)-[rt:RATES]->(r:Racket)
              RETURN u,rt,r ORDER BY u.username`;

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

async function getRacketBrands() {

  let query = `MATCH (r:Racket)-[:IS_OF_BRAND]->(b:Brand)
              RETURN DISTINCT b.brandName`;

  let result = await getFromDB(query);

  let brands = [];

  result.forEach(function(brand){
    brands.push(brand._fields[0]);
  });

  return brands;
}

async function getStringBrands() {

  let query = `MATCH (s:String)-[:IS_OF_BRAND]->(b:Brand)
              RETURN DISTINCT b.brandName`;

  let result = await getFromDB(query);

  let brands = [];

  result.forEach(function(brand){
    brands.push(brand._fields[0]);
  });

  return brands;
}

async function getAllStringTypes(){
  let query = `MATCH (s:String)
  RETURN DISTINCT s.type`;

  let result = await getFromDB(query);

  let types = [];

  result.forEach(function(type){
    types.push(type._fields[0]);
  });

  return types;
}

async function getHeadSizes(brand) {
  
    let query = `MATCH (b:Brand)<-[:IS_OF_BRAND]-(r:Racket)-[:HAS_DIMENSIONS]->(d:Dimension)
    WHERE b.brandName = '${brand}' AND d.headSize_in2 IS NOT NULL
    RETURN DISTINCT d.headSize_in2`;
  
    let result = await getFromDB(query);
    
    let headSizes = [];

    result.forEach(head => {
      headSizes.push(head._fields[0]);
    });

    return headSizes;
}

async function getRacketLengths(brand, headSize){
  let query = `MATCH (b:Brand)<-[:IS_OF_BRAND]-(r:Racket)-[:HAS_DIMENSIONS]->(d:Dimension)
  WHERE b.brandName = '${brand}' AND d.headSize_in2 = toInteger('${headSize}') AND d.length_in IS NOT NULL
  RETURN DISTINCT d.length_in`;

  let result = await getFromDB(query);

  let lengths = [];

  result.forEach(length => {
    lengths.push(length._fields[0]);
  });

  return lengths;

}

async function getRacketWeights(brand, headSize, length){
  let query = `MATCH (b:Brand)<-[:IS_OF_BRAND]-(r:Racket)-[:HAS_DIMENSIONS]->(d:Dimension)
  WHERE b.brandName = '${brand}' AND d.headSize_in2 = toInteger('${headSize}') AND d.length_in = toInteger('${length}') AND d.weightUnstrung_g IS NOT NULL
  RETURN DISTINCT d.weightUnstrung_g`;

  let result = await getFromDB(query);

  let weights = [];

  result.forEach(weight => {
    weights.push(weight._fields[0]);
  });

  return weights;
}

async function getTopPlayersNames(){
  let query = `MATCH (tp:TopPlayer)
              RETURN tp.playerName`;
  
  let result = await getFromDB(query);

  return result.map((player) => {return player._fields[0]});
}

async function getContentProperties(){

    let query = `MATCH (d:Dimension)<-[:HAS_DIMENSIONS]-(r:Racket)-[:IS_OF_BRAND]->(b:Brand)
    RETURN r.modelID, d.weightUnstrung_g, d.headSize_in2, r.flex, r.stringPattern_VxH, r.price_Dol, b.brandName ORDER BY r.modelID`;
  
    return await getFromDB(query);
}

async function getStringContentProperties(){
  let query = `MATCH (d:Dimension)<-[:HAS_DIMENSIONS]-(s:String)-[:IS_OF_BRAND]->(b:Brand)
  RETURN s.modelID, b.brandName, s.modelName, s.type, s.composition, d.gauge_mm ORDER BY s.modelID`;

  return await getFromDB(query);
}

async function getUserRatings(user) {
    
  let query = `MATCH (u:User {username: "${user}"})-[rt:RATES]->(r:Racket)
  RETURN r.modelID, rt.rating ORDER BY r.modelID`;

  return await getFromDB(query);

}

async function getUserStringRatings(user) {
    
  let query = `MATCH (u:User {username: "${user}"})-[rt:RATES]->(s:String)
  RETURN s.modelID, rt.rating ORDER BY s.modelID`;

  return await getFromDB(query);

}

async function getAllPatterns(){
    
  let query = `MATCH (r:Racket)
  RETURN DISTINCT r.stringPattern_VxH`;

  let result = await getFromDB(query);

  let patterns = [];

  result.forEach(function(pattern){
    patterns.push(pattern._fields[0]);
  });

  return patterns;
}

async function getUsernamesList(){
  let query = `MATCH (u:User)
              RETURN DISTINCT u.username ORDER BY u.username`;
  
  let result = await getFromDB(query);

  let usernames = [];

  result.forEach(function(username){
    usernames.push(username._fields[0]);
  });

  return usernames;
}

////////// -- UNIVERSAL QUERY -- //////////
async function getFromDB(query){

  let result = await session.readTransaction(tx =>
    tx.run(query) 
  );

  return result.records;
}

async function updateDB(query){

  let result = await session.writeTransaction(tx =>
    tx.run(query) 
  );

  return result;
}

////////// -- COLLABORATIVE ALGORITHM -- //////////
async function getCollaborativeRecommendation(currentUser){
  let usernamesList = await getUsernamesList();
  let collabTable = await getCollabTable(usernamesList);
  let similarUsers = await getXMostSimilarUsers(usernamesList, currentUser, collabTable, 3);
  return getCollaborativeRecommendationRank(collabTable, currentUser, usernamesList, similarUsers);
}

function getXMostSimilar(recommendations, x){
  //Array that contains modelIDs of the best x recommended rackets
  let mostSimilarRackets = [];
  let recommendationsCopy = recommendations.slice();
  let maxValue, index;

  for (let i = 0; i < x; i++) {
    maxValue = Math.max.apply(null, recommendationsCopy[1]);
    index = recommendationsCopy[1].indexOf(maxValue);
    mostSimilarRackets.push(recommendationsCopy[0][index]);
    recommendationsCopy[0].splice(index, 1);
    recommendationsCopy[1].splice(index, 1);
  }

  return mostSimilarRackets;
}

function getCollaborativeRecommendationRank(collabTable, currentUser, usernamesList, similarUsers){
  let recommendations = [[],[]];//[0] = modelID, [1] = rating
  let currentUserAverage = getAverage(collabTable[usernamesList.indexOf(currentUser)]);

  for(let i=0; i<collabTable[0].length; i++){

    if(collabTable[usernamesList.indexOf(currentUser)][i] == 0){

      let numerator = 0;
      let denominator = 0;

      for(let v=0; v<similarUsers[0].length; v++){
        let vRatingj = collabTable[usernamesList.indexOf(similarUsers[0][v])][i];
        let vAverage = getAverage(collabTable[usernamesList.indexOf(similarUsers[0][v])]);
        let correlationToV = similarUsers[1][v];
        numerator += correlationToV * (vRatingj - vAverage);
        denominator += Math.abs(correlationToV);
      }
      recommendations[0].push(i+1);
      recommendations[1].push(currentUserAverage + (numerator/denominator));
    }
  }

  return recommendations;

}

function getAverage(list){
  let sum = 0, counter = 0;
  for(let i = 0; i < list.length; i++){
    if(list[i] != 0){
      sum += list[i];
      counter++;
    }
  }
  return sum/counter;
}

async function getUsersCorrelation(usernamesList, currentUsername, collabTable){
  
  let correlations = [[],[]];
  let userIndex = usernamesList.indexOf(currentUsername);

  for(let i = 0; i < collabTable.length; i++){
    correlations[0].push(usernamesList[i]);
    //TODO omit 0s
    correlations[1].push(jStat.corrcoeff(collabTable[userIndex], collabTable[i]));
  }

  //Current user row deleted
  correlations[0].splice(userIndex, 1);
  correlations[1].splice(userIndex, 1);

  return correlations;
  
}

async function getXMostSimilarUsers(usernamesList, currentUsername, collabTable, x){

  let correlations = await getUsersCorrelation(usernamesList, currentUsername, collabTable);
  let similarUsers = [[],[]];
  let maxValue, user, index;

  for (let i = 0; i < x; i++) {
    maxValue = Math.max.apply(null, correlations[1]);
    user = correlations[0][correlations[1].indexOf(maxValue)];
    similarUsers[0].push(user);
    similarUsers[1].push(maxValue);
    index = correlations[1].indexOf(maxValue);
    correlations[0].splice(index, 1);
    correlations[1].splice(index, 1);
  }

  return similarUsers;
}

//DELETE THIS (test function)
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

async function getCollabTable(usernamesList) {

  let collabTable = [];
  let username;
  
  let racketsNumber = (await getNumberOfRackets())[0].get(0);
  let usersNumber = (await getNumberOfUsers())[0].get(0);

  putZeros(collabTable, usersNumber, racketsNumber);

  let allRatings = await getAllRatings();

  //collabTable rows ordered by username alphabetically

  allRatings.forEach(function(rating){
    username = rating._fields[0].properties.username;
    collabTable[usernamesList.indexOf(username)][rating._fields[2].properties.modelID-1] = rating._fields[1].properties.rating;
  });

  return collabTable;
}

function putZeros(table, usersNumber, racketsNumber){

  let userRatings = [];

  for(let j = 0; j < racketsNumber; j++){
    userRatings.push(0);
  }

  for(let i = 0; i < usersNumber; i++){

    table.push(userRatings.slice());
  }
}

////////// -- CONTENT ALGORITHM -- //////////
async function getContentTable(currentUser) {

  let contentTable = [];

  let racketProperties = await getContentProperties();

  let weights = [220,230,240,250,260,270,280,290,300,310,320,330];
  let headSizes = await getAllHeadSizes();
  let flexValues = [45, 50, 55, 60, 65, 70, 75];
  let patterns = await getAllPatterns();
  let prices = [80, 100, 120, 140, 160, 180, 200, 220, 240];
  let brands = await getRacketBrands();

  let headers = ["modelID"].concat(weights).concat(headSizes).concat(flexValues).concat(patterns).concat(prices).concat(brands).concat(["rating"]);
  
  let ratings = await getUserRatings(currentUser);

  contentTable.push(headers);

  racketProperties.forEach(function(racket){
  
    let row = [];

    row.push(racket._fields[0]);

    weights.forEach(function(weight){
      if(racket._fields[1] >= weight && racket._fields[1] < weight+10){
        row.push(3);
      }else{
        row.push(0);
      }
    });

    headSizes.forEach(function(size){
      if(racket._fields[2] == size){
        row.push(1);
      }else{
        row.push(0);
      }
    });

    flexValues.forEach(function(flex){
      if(racket._fields[3] >= flex && racket._fields[3] < flex+5){
        row.push(1);
      }else{
        row.push(0);
      }
    });

    patterns.forEach(function(pattern){
      if(racket._fields[4] == pattern){
        row.push(2);
      }else{
        row.push(0);
      }
    });

    prices.forEach(function(price){
      if(racket._fields[5] >= price && racket._fields[5] < price+20){
        row.push(2);
      }else{
        row.push(0);
      }
    });

    brands.forEach(function(brand){
      if(racket._fields[6] == brand){
        row.push(1);
      }else{
        row.push(0);
      }
    });

    row.push(0); //Rating added later
    contentTable.push(row);
  });

  ratings.forEach(function(rating){
    contentTable[rating._fields[0]][contentTable[0].length-1] = rating._fields[1];
  });

  return contentTable;
}

async function getContentRecommendation(user){
  let profile, frecuencies;
  let contentTable = await getContentTable(user);
  let reducedTable = reduceTableToUserRatings(contentTable);
  multiplyFeaturesByRating(reducedTable);
  [profile, frecuencies] = getUserProfile(reducedTable);
  let normalizedProfile = normalizeProfile(profile, frecuencies);
  let recommendation = getRecommendation(normalizedProfile, contentTable);
  return recommendation;
}

function getRecommendation(normalizedProfile, contentTable){
  let similarityTable = [[],[]]; //modelID, similarity
  let tmpRow = [];
  let numerator, root1, root2;
  
contentTable.forEach(function(row){
  if(row[row.length-1] == 0){
    tmpRow = row.slice(1, row.length-1);
    numerator = 0;
    root1 = 0;
    root2 = 0;

    for(let i = 0; i < tmpRow.length; i++){
      numerator += tmpRow[i] * normalizedProfile[1][i];
      root1 += Math.pow(tmpRow[i], 2);
      root2 += Math.pow(normalizedProfile[1][i], 2);
    }

    similarityTable[0].push(row[0]);
    similarityTable[1].push(numerator / ((Math.sqrt(root1) * Math.sqrt(root2))));
  }
});

  return similarityTable;

}

function normalizeProfile(profile, frecuencies){
  for(let i = 0; i < profile[1].length; i++){
    profile[1][i] = profile[1][i]/5*frecuencies[i];
  }

  return profile;
}

function getUserProfile(table){
  let profile = [];
  let row = [];
  let frecuencies = [];
  let headers = table[0].slice(1, table[0].length-1);
  profile.push(headers);
  for(let j = 1; j < table[0].length-1; j++){
    let sum = 0;
    let counter = 0;
    for(let i = 1; i < table.length; i++){
      if(table[i][j] != 0){
        sum += table[i][j];
        counter++;
      }
    }

    frecuencies.push(counter/(table.length-1));

    if(counter != 0){
      row.push(sum/counter);
    }else{
      row.push(0);
    }
  }
  profile.push(row);
  return [profile, frecuencies];
}

function multiplyFeaturesByRating(table){
  //i==0 -> headers
  for(let i = 1; i < table.length; i++){
    for(let j = 1; j < table[i].length-1; j++){
      table[i][j] = table[i][j] * table[i][table[0].length-1];
    }
  }
}

function reduceTableToUserRatings(contentTable){
  
  let reducedTable = [];

  contentTable.forEach(function(row){

    if(row[0] == "modelID"){
      reducedTable.push(row.slice());

      //Last column is rating
    }else if(row[row.length-1] > 0){
      reducedTable.push(row.slice());
    }
  });

  return reducedTable;
}

////////// -- CONTENT ALGORITHM -- //////////
async function getHybridRecommendation(user){
  let contetRec = await getContentRecommendation(user);
  let collabRec = await getCollaborativeRecommendation(user);
  let hybridRec = mergeRecommendations(contetRec, collabRec);
  return hybridRec;
}

function mergeRecommendations(contentRec, collabRec){
  let hybridRec = [[],[]];

  let modelIDs = [];

  contentRec[0].forEach(function(contentID){
    if(collabRec[0].includes(contentID)){
      modelIDs.push(contentID);
    }
  });

  modelIDs.forEach(function(modelID){

    let contentRating = contentRec[1][contentRec[0].indexOf(modelID)];
    let collabRating = collabRec[1][collabRec[0].indexOf(modelID)];

    hybridRec[0].push(modelID);
    hybridRec[1].push(contentRating*0.6 + collabRating*0.4);
  });

  return hybridRec;
}

////////// -- STRING ALGORITHM -- //////////
async function getStringRecommendation(currentUser, selectedTopPlayer, userHeight, userWeight, suitableStrings){
  let profile, frecuencies;
  let contentTable = await getStringContentTable(currentUser);
  let reducedTable = reduceTableToUserRatings(contentTable);
  multiplyFeaturesByRating(reducedTable);
  [profile, frecuencies] = getUserProfile(reducedTable);
  let normalizedProfile = normalizeProfile(profile, frecuencies);
  let recommendation = getRecommendation(normalizedProfile, contentTable);
  let similarPlayers = await getSimilarPlayers(userHeight, userWeight);
  let newRecommendations = await addPlayerBonus(recommendation, selectedTopPlayer, similarPlayers, suitableStrings);
  return newRecommendations;
}

async function getSimilarPlayers(userHeight, userWeight){
  let topPlayersData = await getTopPlayersComplexionData();

  let similarPlayers = [];

  topPlayersData.forEach(function(player){
    if(getEuclideanDistance(userHeight, userWeight, player.height, player.weight) < 0.5){ //TODO CAMBIAR UMBRAL
      similarPlayers.push(player);
    }
  });

  return similarPlayers;
}

function getEuclideanDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

async function addPlayerBonus(recommendations, selectedTopPlayer, similarPlayers, suitableStrings){
  let playerStrings = await getPlayerStrings();
  let newRecommendations = recommendations.slice();

  //playerStrings[stringID]=players who play with that string

  let modelsList = newRecommendations[0].slice();

  modelsList.forEach(function(recommendation){

    //Checks if the selected top player uses this string
    if(playerStrings[recommendation].includes(selectedTopPlayer)){
      newRecommendations[1][newRecommendations[0].indexOf(recommendation)] += 1;
    }

    let i = 0;
    let similarPlayerFound = false;

    //Checks if any player who plays with the selected racket uses this string
    if(suitableStrings.includes(recommendation)){
      newRecommendations[1][newRecommendations[0].indexOf(recommendation)] += 0.5;
    }

    //Checks if any physically similar player uses this string
    while(i < similarPlayers.length && !similarPlayerFound){
      if(playerStrings[recommendation].includes(similarPlayers[i])){
        similarPlayerFound = true;
        newRecommendations[1][newRecommendations[0].indexOf(recommendation)] += 0.5;
      }
      i++;
    }

  });

  return newRecommendations;
}

async function getStringContentTable(currentUser){
  let contentTable = [];

  let stringProperties = await getStringContentProperties();

  let brands = await getStringBrands();
  let types = await getAllStringTypes();
  let compositions = await getAllStringCompositions();
  let gauges = await getAllGauges();

  let headers = ["modelID"].concat(brands).concat(types).concat(compositions).concat(gauges).concat(["rating"]);
  
  let ratings = await getUserStringRatings(currentUser);

  contentTable.push(headers);

  stringProperties.forEach(function(string){
  
    let row = [];

    row.push(string._fields[0]);

    brands.forEach(function(brand){
      if(string._fields[1] == brand){
        row.push(1);
      }else{
        row.push(0);
      }
    });

    types.forEach(function(type){
      if(string._fields[2] == type){
        row.push(2);
      }else{
        row.push(0);
      }
    });

    compositions.forEach(function(composition){
      if(string._fields[3] == composition){
        row.push(1);
      }else{
        row.push(0);
      }
    });

    gauges.forEach(function(gauge){
      if(string._fields[4] == gauge){
        row.push(3);
      }else{
        row.push(0);
      }
    });

    row.push(0); //Ratings added later
    contentTable.push(row);
  });

  ratings.forEach(function(rating){
    contentTable[rating._fields[0]][contentTable[0].length-1] = rating._fields[1];
  });

  return contentTable;
}


app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});