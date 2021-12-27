const GetSelectValues = () => {

    const getDataFromServer = (url) => {
        return fetch(url)
            .then((response) => {
                return response.json();
            });
    }

    const getHeadSizes = async (brand) => {
        return await getDataFromServer("/getHeadSizes?brand=" + brand);
    }

    const getRacketBrands = async () => {
        return await getDataFromServer("/getRacketBrands");
    }

    const getRacketLengths = async (brand, headSize) => {
        return await getDataFromServer("/getRacketLengths?brand=" + brand + "&headSize=" + headSize);
    }

    const getRacketWeights = async (brand, headSize, length) => {
        return await getDataFromServer("/getRacketWeights?brand=" + brand + "&headSize=" + headSize + "&length=" + length);
    }

    const setRacketRating = async(brand, headSize, length, weight, rating, username) => {
        await getDataFromServer("/setRacketRating?brand=" + brand + "&headSize=" + headSize + "&length=" + length + "&weight=" + weight + "&rating=" + rating + "&username=" + username);
        return true;
    }

    const getTopPlayers = async () => {
        return await getDataFromServer("/getTopPlayersNames");
    }
    
    return {getHeadSizes, getRacketBrands, getRacketLengths, getRacketWeights, setRacketRating, getTopPlayers};
    
}

export default GetSelectValues;