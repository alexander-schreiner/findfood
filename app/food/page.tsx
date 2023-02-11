import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Redis } from 'ioredis';
import Image from 'next/image';
const fs = require('fs');

export const dynamic = 'force-dynamic',
    revalidate = 30

const redisClient = new Redis(process.env.REDIS_URL);

async function findNearbyFoodPlace(key: string, lat: number, lon: number)
    : Promise<{ name: string, rating: number, ratingCount: number, address: string, googleMapsLink: string, photos: Array } | "Error"> {

    let places = await getFilteredPlaces(getFilteredPlacesKey(key), lat, lon);

    let place = getRandomPlace(places);

    let googleMapsLink = await getGoogleMapsLink(place.name, place.vicinity, lat, lon);

    return {
        name: place.name,
        rating: place.rating,
        ratingCount: place.user_ratings_total,
        address: place.vicinity,
        googleMapsLink: googleMapsLink,
        photos: place.photos
    };
}

async function getFilteredPlaces(filteredPlacesKey: string, lat: number, lon: number) {
    if (await redisClient.exists(filteredPlacesKey)) {
        console.log('Item exists in Redis, fetching');
        const redisValue = await redisClient.get(filteredPlacesKey);
        return await JSON.parse(redisValue);
    }

    let params = new URLSearchParams({
        key: process.env.GOOGLE_MAPS_API_KEY,
        location: lat + ',' + lon,
        radius: '5000',
        type: 'restaurant',
        opennow: '1',
        rankby: 'prominence'
    });

    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + params.toString();
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
        console.log('Encountered non ok status: ' + data.status + ' with error message: ' + data.error_message);
        return 'Error';
    }

    const filteredPlaces = filterPlaces(data.results);

    if (!isEmpty(filteredPlaces)) {
        // TTL: 600 seconds = 5 minutes
        await redisClient.set(filteredPlacesKey, JSON.stringify(filteredPlaces), 'EX', 300);
    }

    return filteredPlaces;
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
    let type = res.headers.get("Content-Type");

    /**
     * @link https://stackoverflow.com/a/69589656/9206045
     */
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return "data:" + type + ';base64,' + buffer.toString('base64');
}

async function getGoogleMapsLink(name, address, lat, lon) {
    return 'https://www.google.com/maps/dir/' + String(lat) + ',' + String(lon) + '/' + encodeURIComponent(name) + ',' + encodeURIComponent(address);
}

function isEmpty(obj: object): boolean {
    return obj // 👈 null and undefined check
        && Object.keys(obj).length === 0
        && Object.getPrototypeOf(obj) === Object.prototype
}

function getFilteredPlacesKey(userKey: string): string {
    return userKey + '_filtered-places';
}

export default async function FoodPage({ searchParams }) {

    if (!cookies().has('key')) {
        redirect('/');
    }

    const key = cookies().get('key').value;
    const place = await findNearbyFoodPlace(key, Number(searchParams.lat), Number(searchParams.lon));

    if (place === 'Error') {
        return (
            <h1>Error occoured</h1>
        );
    }

    let base64Image = await getPhotoSrcFromApi(place.photos[0].photo_reference, 400, 400);

    return (
        <>
            <div className='w-4/12 space-y-4'>

                <div className="text-6xl text-white font-black">
                    <span>Found</span><span className="text-orange-500">Food 🍽️</span>
                </div>

                <div className="flex flex-col space-y-6">
                    <span className="text-3xl text-white font-extrabold">{place.name} (Rating: {place.rating}/5)</span>

                    <Image src={base64Image}
                        alt="a" width={400} height={400}
                        className='
                        border-4
                        border-orange-500
                        '
                    />

                    <a className="text-xl text-white" href={'https://www.google.com/maps/place/' + place.address}>
                        📍 <span className='underline decoration-dotted decoration-white'>{place.address}</span>
                    </a>

                    <div className='flex justify-center'>
                        <a href={place.googleMapsLink} className="
                    flex items-center justify-center rounded-md border border-transparent bg-orange-500 py-3 px-6 text-base font-bold text-white w-full sm:w-2/5
                    hover:bg-orange-600
                    focus:outline-none
                    ">🧭 Get directions</a>
                    </div>

                </div>
            </div>
        </>
    )
}
