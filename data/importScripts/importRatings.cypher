LOAD CSV WITH HEADERS FROM 'http://81.43.174.98/racket-recommendation-system/data/formattedFiles/formattedUsers.csv' AS row
UNWIND RANGE (1,202) as idx
MATCH (u:User {username:row.username}), (r:Racket {modelID:idx})
MERGE (u)-[:RATES {rating:toInteger(row["racket"+idx])}]->(r)

