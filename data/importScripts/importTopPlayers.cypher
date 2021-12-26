LOAD CSV WITH HEADERS FROM 'http://81.43.174.98/racket-recommendation-system/data/formattedFiles/formattedTennisPlayers.csv' AS row
WITH row 
WHERE row.playerID IS NOT NULL
MERGE (p:TopPlayer {
        playerID: row.playerID, 
        playerName: row.player, 
        height_m: toFloat(row.height_m), 
        weight_kg: toFloat(row.weight_kg),
        backhandHands: toInteger(row.backhandHands)
    })
    
MERGE (st:PlayerStats {
	swingWeight_kgxcm2: toInteger(row.swingWeight_kgxcm2),
        recoilWeight_kgxcm2: toFloat(row.recoilWeight_kgxcm2),
        polarization: toFloat(row.polarization),
        mgr_i: toFloat(row.mgr_i)
     })

WITH p, row, st

MATCH (s:String)
WHERE s.modelID = row.stringID

MATCH (r:Racket)
WHERE r.modelID = row.racketID

MERGE (p)-[:USES_STRING]->(s)


MERGE (p)-[:USES_RACKET]->(r)

MERGE (p)-[:HAS_STATS]->(st)
