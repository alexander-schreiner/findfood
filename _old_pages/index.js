import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/layout'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  function redirectToFood(position) {
    const url = NextRequest.nextUrl.clone();
    console.log(url);

    NextResponse.redirect('/food');
  }

  function handeClick() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(redirectToFood);
  }

  return (
    <Layout title="Index">
      <div>
        <div>
          <h1>Find the next foodplace or restaurant in Berlin</h1>
          <p>
            Can't decide where to go out and grab some food in Berlin?
            Sometimes too much options are an obstacle. Just tap "Find food"
            and find your next meal destination!
          </p>
        </div>

        <button onClick={handeClick} type='Submit'>
          Find food
        </button>
      </div>
    </Layout>
  )
}
