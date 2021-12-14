import csv
import math
import random
from random_username.generate import generate_username

def generateSize():
    height = random.randint(120, 200)/100
    #Following the BMI formula
    weight = math.ceil(22*(height**2))
    return [height, weight]

def calculateRating(playerWeigth, racketWeight):
    if(playerWeigth<43):
        if(racketWeight<240):
            return 5
        elif(racketWeight<260):
            return 4
        elif(racketWeight<280):
            return 3
        elif(racketWeight<300):
            return 2
        else:
            return 1
    elif(playerWeigth<52):
        if(racketWeight<240):
            return 4
        elif(racketWeight<260):
            return 5
        elif(racketWeight<280):
            return 4
        elif(racketWeight<300):
            return 3
        else:
            return 2
    elif(playerWeigth<60):
        if(racketWeight<240):
            return 3
        elif(racketWeight<260):
            return 4
        elif(racketWeight<280):
            return 5
        elif(racketWeight<300):
            return 4
        else:
            return 3
    elif(playerWeigth<71):
        if(racketWeight<240):
            return 2
        elif(racketWeight<260):
            return 3
        elif(racketWeight<280):
            return 4
        elif(racketWeight<300):
            return 5
        else:
            return 4
    else:
        if(racketWeight<240):
            return 1
        elif(racketWeight<260):
            return 2
        elif(racketWeight<280):
            return 3
        elif(racketWeight<300):
            return 4
        else:
            return 5
def generateRatings(weight):
    ratings = []
    with open('formattedFiles/formattedTennisRackets.csv') as racketsFile:
        csvReader = csv.DictReader(racketsFile, delimiter=',')
        for row in csvReader:
            ratings.append(calculateRating(weight, int(row['weightUnstrung_g'])))
        return ratings
#try:
with open('formattedFiles/formattedUsers.csv', mode='w') as usersFile:
    csvWriter = csv.writer(usersFile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

    headers = ['username', 'height', 'weight']
    for i in range(1, 203):
        headers.append("racket"+str(i))
    csvWriter.writerow(headers)

    for i in range(30):
        newRow = []
        newRow += generate_username(1)
        size = generateSize()
        newRow += size
        newRow += generateRatings(size[1])
        csvWriter.writerow(newRow)

    print('Users have been created')
#except:
#    print('The file "formattedTennisRackets.csv" is missing.')
