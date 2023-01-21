var fs = require('fs');
var parsePlaceResultSet = require('./parsePlaceResultSet');
require('dotenv').config({
    path: '../.env'
});

function fetchData() {
    var axios = require('axios');

    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    url += '?key=' + process.env.GOOGLE_MAPS_API_KEY;
    url += '&location=52.5219814,13.4111173';
    url += '&radius=5000';
    url += '&type=restaurant';
    url += '&rankby=prominence';

    var config = {
        method: 'get',
        url: url,
        headers: {}
    };

    axios(config)
        .then(function (response) {
            let rawJson = JSON.stringify(response.data);

            let data = JSON.parse(rawJson);

            data.results.forEach(element => {
                console.log(element);
            });

        })
        .catch(function (error) {
            console.log(error);
        });
}

let rawJson = fs.readFileSync('./rawJson.json', { encoding: 'utf8', flag: 'r' });
let data = JSON.parse(rawJson);

data.results.forEach(element => {
    parsePlaceResultSet(element);
});
