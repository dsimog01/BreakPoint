import csv

def checkPattern(pattern):
    return(
        pattern[0:2].isnumeric() and
        pattern[2] == 'x' and
        pattern[3:5].isnumeric()
    )

def isNumber(str):
    parts = str.split('.')
    
    for part in parts:
        if not part.isnumeric():
            return False

    return True

#del 2 al 9
def checkNumericValues(numericValues):
    for value in numericValues:
        if not isNumber(value):
            return False

    return True

def checkRow(row):
    return (
        checkNumericValues(row[2:10]) and
        (row[10]=='Low' or row[10]=='Medium' or row[10]=='High') and
        checkPattern(row[11])
    )

try:
    with open('rawFiles/tennisRackets.csv') as racketsFile:
        with open('formattedFiles/formattedTennisRackets.csv', mode='w') as formattedRacketsFile:
            csvReader = csv.DictReader(racketsFile, delimiter=',')
            csvWritter = csv.writer(formattedRacketsFile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            nLines = 0
            for row in csvReader:
                if nLines == 0:
                    csvWritter.writerow(
                        ['modelID',
                        'brand',
                        'price_Dol',
                        'headSize_in2',
                        'length_in',
                        'weightUnstrung_g',
                        'minTension_kg',
                        'maxTension_kg',
                        'beamWidth_mm',
                        'flex',
                        'powerLevel',
                        'stringPattern_VxH'])

                    nLines += 1
                else:

                    row = [
                        nLines,
                        row['brand'],
                        row['price'][1:],
                        row['head_size'].split(' ')[0],
                        row['length'].split(' ')[0],
                        row['weight'].split(' ')[-2].replace('/', ''),
                        str(float(row['tension'][0:2]) * 0.45359237)[0:5],
                        str(float(row['tension'][3:5]) * 0.45359237)[0:5],
                        row['beam_width'].split('m')[0].split('/')[0].split('-')[0],
                        row['flex'],
                        row['power_lv'],
                        row['string_pa'].split(' ')[0]+'x'+row['string_pa'].split(' ')[3]
                    ]

                    if checkRow(row):
                        csvWritter.writerow(row)
                        nLines += 1

            print(f'{nLines} lines have been formatted.')
except:
    print('The file "tennisRackets.csv" is missing.')

#try:
with open('rawFiles/tennisPlayers.csv') as playersFile:
    with open('formattedFiles/formattedTennisPlayers.csv', mode='w') as formattedPlayersFile:
        csvReader = csv.DictReader(playersFile, delimiter=',')
        csvWritter = csv.writer(formattedPlayersFile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        nLines = 0
        for row in csvReader:
            if nLines == 0:
                csvWritter.writerow(
                    ['playerID',
                     'player',
                     'height_m',
                     'weight_kg',
                     'racketLength_in',
                     'racketWeight_g',
                     'swingWeight_kgxcm2',
                     'recoilWeight_kgxcm2',
                     'polarization',
                     'mgr_i',
                     'stringID',
                     'backhandHands',
                     'racketID'])

            else:
                row = [
                    nLines,
                    row['player'],
                    row['height_m'],
                    row['weight_kg'],
                    str(round(float(row['racketLength_cm']) * 0.393701, 1)),
                    row['racketWeight_g'],
                    row['swingWeight_kgxcm2'],
                    row['recoilWeight_kgxcm2'],
                    row['polarization'],
                    row['mgr_i'],
                    row['stringID'],
                    row['backhandHands'],
                    row['racketID']]

                csvWritter.writerow(row)

            nLines += 1

        print(f'{nLines} lines have been formatted.')
#except:
    #print('The file "tennisPlayers.csv" is missing.')




