'use client';

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    function redirectToFood(position) {
        let searchParams = new URLSearchParams({
            lat: position.coords.latitude,
            lon: position.coords.longitude
        });

        router.push('/food?' + searchParams.toString());
    }

    function handeClick() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(redirectToFood);
    }

    return (
        <div>
            <div>
                <h1>Find the next foodplace or restaurant in Berlin</h1>
                <p>
                    Can't decide where to go out and grab some food in Berlin?
                    Sometimes too much options are an obstacle. Just tap "Find food"
                    and find your next meal destination!
                </p>
            </div>

            <button onClick={handeClick}>
                Find food
            </button>
        </div>
    )
}
