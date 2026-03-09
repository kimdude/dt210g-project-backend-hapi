"use strict"

/* Service to fetch games */
exports.freeToGame = async(endpoint) => {

    //Setting url
    let url;

    if(endpoint !== null) {
        url = "https://www.freetogame.com/api/" + endpoint;
    } else {
        url = "https://www.freetogame.com/api/games";
    }

    //Fetching data
    try {
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error("An error occurred while fetchinge external data.");
        }

        const data = await response.json();
        return data;

    } catch(error) {
        throw error;
    }
}