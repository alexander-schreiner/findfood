'use client';

import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function Home() {
    const key = Math.random().toString(36).slice(2, 16);
    setCookie('key', key);

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
        <>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg min-h-screen">
                <div className="px-4 py-5 sm:px-6 ">
                    <div className="flex flex-col space-y-4">
                        <h1 className="text-4xl font-bold">Find the next foodplace or restaurant near you!</h1>
                        <p className="text-xl">
                            Can't decide where to go out and grab some food?
                            Sometimes too much options are an obstacle. Just tap "Find food"
                            and find your next meal destination!
                        </p>
                    </div>
                </div>

                <div className="flex justify-center px-4 py-5 sm:px-6">
                    <button onClick={handeClick} className="findFoodButton">
                        Find food
                    </button>
                </div>
            </div>
        </>
    )
}
