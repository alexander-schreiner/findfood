var fs = require('fs');
var getPlaceIdFromResultElement = require('./getPlaceIdFromResultElement');

let rawJson = fs.readFileSync('./rawPlaces.json', { encoding: 'utf8', flag: 'r' });
let data = JSON.parse(rawJson);

console.log(data);
return;

data.results.forEach(element => {
    let placeId = getPlaceIdFromResultElement(element);
    fs.appendFileSync('./placeIds.txt', placeId + '\n');
    console.log(placeId);
});
