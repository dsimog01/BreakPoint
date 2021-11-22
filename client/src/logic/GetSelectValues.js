const GetSelectValues = (thisComponent) => {

    const getDataFromServer = (url) => {
        return fetch(url)
            .then((response) => {
                return response.json();
            });
    }

    /*const [data, setData] = React.useState(null);

    React.useEffect(() => {
      fetch("/getRacketBrands")
        .then((res) => res.json())
        .then((data) => setData(data.message));
    }, []);*/

    const getHeadSizes = (brand) => {
        let data = getDataFromServer("/getHeadSizes?brand=" + brand);
        console.log(data);
        return data;
    }

    const getRacketBrands = () => {
        let data = getDataFromServer("/getRacketBrands");
        console.log(data);
        return data;
    }
    
    return {getHeadSizes, getRacketBrands};
    
}

export default GetSelectValues;