import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/layout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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

        <form action='/food'>
          <button type='Submit'>
            Find food
          </button>
        </form>
      </div>
    </Layout>
  )
}
