export const dynamic = 'force-dynamic',
    revalidate = 30

async function findNearbyFoodPlace(lat, lon): Promise<{ name: string, rating: number, ratingCount: number, address: string, googleMapsLink: string } | "Error"> {
    console.log(lat);
    console.log(lon);

    let params = new URLSearchParams({
        key: process.env.GOOGLE_MAPS_API_KEY,
        location: lat + ',' + lon,
        radius: '5000',
        type: 'restaurant',
        opennow: '1',
        rankby: 'prominence'
    });

    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + params.toString();
    console.log(url);
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
        console.log('Encountered non ok status: ' + data.status + ' with error message: ' + data.error_message);
        return 'Error';
    }

    let places = filterPlaces(data.results);

    let place = getRandomPlace(places);

    // getPhotoSrcFromApi(place.photos[0].photo_reference, 400, 400);

    let googleMapsLink = await getGoogleMapsLink(place.name, place.vicinity, lat, lon);

    return {
        name: place.name,
        rating: place.rating,
        ratingCount: place.user_ratings_total,
        address: place.vicinity,
        googleMapsLink: googleMapsLink
    };
}

function filterPlaces(places) {
    let veryHighRankingPlaces = places.filter(place => place.rating > 4.5 && place.user_ratings_total > 150);
    if (veryHighRankingPlaces.length > 0) {
        return veryHighRankingPlaces;
    }

    let highRankingPlaces = places.filter(place => place.rating > 4 && place.user_ratings_total > 150);
    if (highRankingPlaces.length > 0) {
        return highRankingPlaces;
    }

    let highRankingPlacesWith100Reviews = places.filter(place => place.rating > 4 && place.user_ratings_total > 100);
    if (highRankingPlacesWith100Reviews.length > 0) {
        return highRankingPlacesWith100Reviews;
    }

    let highRankingPlacesWith75Reviews = places.filter(place => place.rating > 4 && place.user_ratings_total > 75);
    if (highRankingPlacesWith75Reviews.length > 0) {
        return highRankingPlacesWith75Reviews;
    }

    let highRankingPlacesWith50Reviews = places.filter(place => place.rating > 4 && place.user_ratings_total > 50);
    if (highRankingPlacesWith50Reviews.length > 0) {
        return highRankingPlacesWith50Reviews;
    }

    let highRankingPlacesWith25Reviews = places.filter(place => place.rating > 4 && place.user_ratings_total > 25);
    if (highRankingPlacesWith25Reviews.length > 0) {
        return highRankingPlacesWith25Reviews;
    }

    let mediumRankingPlaces = places.filter(place => place.rating > 3.5 && place.user_ratings_total > 150);
    if (mediumRankingPlaces.length > 0) {
        return mediumRankingPlaces;
    }

    let mediumRankingPlacesWith100Reviews = places.filter(place => place.rating > 3.5 && place.user_ratings_total > 100);
    if (mediumRankingPlacesWith100Reviews.length > 0) {
        return mediumRankingPlacesWith100Reviews;
    }

    return places;
}

function getRandomPlace(places) {
    return places[Math.floor(Math.random() * places.length)];
}

async function getPhotoSrcFromApi(photoReference, maxHeight, maxWidth) {
    let params = new URLSearchParams({
        key: process.env.GOOGLE_MAPS_API_KEY,
        photo_reference: photoReference,
        maxheight: String(maxHeight),
        maxwidth: String(maxWidth),
    });

    let url = 'https://maps.googleapis.com/maps/api/place/photo?' + params.toString();
    const res = await fetch(url);
    let blob = await res.blob();
    return URL.createObjectURL(blob);
}

async function getGoogleMapsLink(name, address, lat, lon) {
    return 'https://www.google.com/maps/dir/' + String(lat) + ',' + String(lon) + '/' + encodeURIComponent(name) + ',' + encodeURIComponent(address);
}

export default async function FoodPage({ params, searchParams }) {
    console.log(params);
    console.log(searchParams);

    const place = await findNearbyFoodPlace(searchParams.lat, searchParams.lon);

    if (place === 'Error') {
        return (
            <h1>Error occoured</h1>
        );
    }

    return (
        <>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 min-h-screen">
                    <h1 className="text-3xl">{place.name} (Rating: {place.rating}/5)</h1>
                    <h2 className="text-xl">{place.address}</h2>

                    <a href={place.googleMapsLink} className="directionsButton">Get directions</a>
                </div>
            </div>
        </>
    )
}
