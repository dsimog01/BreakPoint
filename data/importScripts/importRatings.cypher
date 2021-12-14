LOAD CSV WITH HEADERS FROM 'http://spreding.online/racket-recommendation-system/data/formattedFiles/formattedUsers.csv' AS row
UNWIND RANGE (1,202) as idx
MATCH (u:User {username:row.username}), (r:Racket {modelID:idx})
MERGE (u)-[:RATES {rating:toInteger(row["racket"+idx])}]->(r)

