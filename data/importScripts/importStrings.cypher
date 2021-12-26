LOAD CSV WITH HEADERS FROM 'http://81.43.174.98/racket-recommendation-system/data/formattedFiles/formattedTennisStrings.csv' AS row2
WITH row2
WHERE row2.modelID IS NOT NULL
MERGE (s:String {
        modelID: toInteger(row2.modelID),
        modelName: row2.modelName,
        type: row2.type,
        composition: row2.composition
    })

MERGE (b2:Brand {
    brandName: row2.brand
    })

MERGE (d2:Dimension {
    gauge_mm: toFloat(row2.gauge_mm)
})

MERGE (s)-[:IS_OF_BRAND]->(b2)

MERGE (s)-[:HAS_DIMENSIONS]->(d2)
