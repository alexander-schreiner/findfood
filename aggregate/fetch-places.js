const fs = require('fs');
const axios = require('axios');
require('dotenv').config({
    path: '../.env'
});

async function fetchData(pageToken = null) {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    url += '?key=' + process.env.GOOGLE_MAPS_API_KEY;

    if (pageToken !== null) {
        console.log('Requesting with page token: ' + pageToken);
        url += '&pagetoken=' + pageToken;
    } else {
        console.log('Requesting without page token');
        url += '&location=52.5219814,13.4111173';
        url += '&radius=5000';
        url += '&type=restaurant';
        url += '&rankby=prominence';
    }

    let res = await axios({
        method: 'get',
        url: url,
        headers: {}
    });

    if (res.status !== 200) {
        console.log(res);
        return 'error';
    }

    return res.data;
}

(async () => {
    let loop = true;
    let nextPageToken = null;
    let i = 0;
    while (loop) {
        i++;
        //        let data = await fetchData(nextPageToken);
        let rawJson = fs.readFileSync('./data.txt', { encoding: 'utf8', flag: 'r' });
        let data = JSON.parse(rawJson);

        if (data === 'error') {
            console.log('ERROR!');
            return;
        }

        if (data.status !== 'OK') {
            console.log('Status NOT OK: ' + data.status);
            return;
        }

        nextPageToken = data.next_page_token;

        let str = JSON.stringify(data.results);
        str = str.slice(0, -1);
        str = str.slice(1);
        str = str + ',';

        fs.appendFileSync('./rawPlaces.json', str);

        await setTimeout(() => {

        }, 5000);

        if (i > 500) {
            return;
        }
    }
})();

// let rawJson = fs.readFileSync('./rawJson.json', { encoding: 'utf8', flag: 'r' });
// let data = JSON.parse(rawJson);
// fs.appendFileSync('./placeIds.txt', placeId + '\n');
