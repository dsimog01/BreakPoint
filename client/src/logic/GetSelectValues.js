const GetSelectValues = (thisComponent) => {

    const getDataFromServer = (url) => {
        return fetch(url)
            .then((response) => {
                return response.json();
            });
    }

    const getHeadSizes = async (brand) => {
        let data = await getDataFromServer("/getHeadSizes?brand=" + brand);
        return data;
    }

    const getRacketBrands = async () => {
        let data = await getDataFromServer("/getRacketBrands");
        return data;
    }

    const getRacketLengths = async (brand, headSize) => {
        let data = await getDataFromServer("/getRacketLengths?brand=" + brand + "&headSize=" + headSize);
        return data;
    }

    const getRacketWeights = async (brand, headSize, length) => {
        let data = await getDataFromServer("/getRacketWeights?brand=" + brand + "&headSize=" + headSize + "&length=" + length);
        return data;
    }

    const setRacketRating = async(brand, headSize, length, weight, rating, username) => {

        console.log(brand, headSize, length, weight, rating, username);

        await getDataFromServer("/setRacketRating?brand=" + brand + "&headSize=" + headSize + "&length=" + length + "&weight=" + weight + "&rating=" + rating + "&username=" + username);
        return true;
    }
    
    return {getHeadSizes, getRacketBrands, getRacketLengths, getRacketWeights, setRacketRating};
    
}

export default GetSelectValues;