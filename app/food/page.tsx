require('dotenv').config({
    path: '../.env'
});

async function findNearbyFoodPlace(lat, lon) {
    console.log(lat, lon);

    let params = new URLSearchParams({
        key: process.env.GOOGLE_MAPS_API_KEY,
        location: lat + ',' + lon,
        radius: '5000'
    });

    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + params.toString();
    console.log(url);
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
}

export default async function FoodPage({ searchParams }) {
    await findNearbyFoodPlace(searchParams.lat, searchParams.lon);
    return (
        <p>Food!</p>
    )
}
