LOAD CSV WITH HEADERS FROM 'http://spreding.online/racket-recommendation-system/data/formattedFiles/formattedTennisRackets.csv' AS row
WITH row 
WHERE row.modelID IS NOT NULL
MERGE (r:Racket {
        modelID: toInteger(row.modelID), 
        price_Dol: toFloat(row.price_Dol), 
        flex: toInteger(row.flex), 
        powerLevel: row.powerLevel, 
        stringPattern_VxH: row.stringPattern_VxH
    })

MERGE (d:Dimension {
        headSize_in2: toInteger(row.headSize_in2),
        length_in: toFloat(row.length_in),
        weightUnstrung_g: toInteger(row.weightUnstrung_g),
        beamWidth_mm: toInteger(row.beamWidth_mm)
    })

MERGE (b:Brand {
        brandName: row.brand
    })

MERGE (t:Tension {
    minTension: toFloat(row.minTension_kg),
    maxTension: toFloat(row.maxTension_kg)
})

MERGE (r)-[:IS_OF_BRAND]->(b)

MERGE (r)-[:HAS_DIMENSIONS]->(d)

MERGE (r)-[:ACCEPTS_TENSION]->(t)
