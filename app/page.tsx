'use client';

import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import SocialMediaLinks from "../components/socialMediaLinks";

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

        navigator.geolocation.getCurrentPosition(redirectToFood, function (error: GeolocationPositionError) {
            switch (error.code) {
                case GeolocationPositionError.PERMISSION_DENIED:
                    alert('Permission denied. Could not retrieve your current location');
                    break;
                case GeolocationPositionError.POSITION_UNAVAILABLE:
                    alert('Position unavailable. Could not retrieve your current location');
                    break;
                case GeolocationPositionError.TIMEOUT:
                    alert('Timeout. Could not retrieve your current location');
                    break;
                default:
                    alert('Could not retrieve your current location. Unknown error');
            }
        });
    }

    return (
        <>
            <div className='max-w-xl w-xl'>
                <div className="flex flex-col">
                    <div className="space-y-4">
                        <h1 className="text-white font-black flex flex-col">
                            <div className="text-6xl">
                                <span>Find</span>
                                <span className="text-orange-500">Food</span>
                                <span> 🍔🍕🌮 </span>
                            </div>
                            <div className="text-4xl font-extrabold">
                                <span>Find the next cool food place near you!</span>
                            </div>
                        </h1>
                        <p className="text-white text-bold text-xl">
                            Can't decide where to go out and grab some food?
                            Sometimes too much options are an obstacle. Just tap "FindFood"
                            and find your next meal destination!
                        </p>
                    </div>

                    <div className="flex justify-center px-4 py-5 sm:px-6">
                        <button onClick={handeClick}
                            className="
                        mt-6 flex items-center justify-center rounded-md border border-transparent bg-orange-500 py-3 px-8 text-base font-bold text-white w-full sm:w-1/3
                        hover:bg-orange-600
                        focus:outline-none
                        ">
                            🍴 FindFood
                        </button>
                    </div>
                </div>

                <div className="mt-3">
                    <SocialMediaLinks />
                </div>
            </div>
        </>
    )
}
