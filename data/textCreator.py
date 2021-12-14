text_file = open("tmp.txt", "w")

text = ""

for i in range(1,203):
    text += "WITH row, u\nMATCH (r:Racket {modelID: "+str(i)+"})\nMERGE (u)-[rt:RATES]->(r)\nSET rt.rating=toInteger(row.racket"+str(i)+")\n\n"

n = text_file.write(text)
text_file.close()