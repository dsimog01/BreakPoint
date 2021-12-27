LOAD CSV WITH HEADERS FROM 'http://81.43.174.98/BreakPoint/data/formattedFiles/formattedUsers.csv' AS row
WITH row 
WHERE row.username IS NOT NULL
MERGE (u:User {
        username: row.username, 
        height_m: toFloat(row.height), 
        weight_kg: toFloat(row.weight)
    })



