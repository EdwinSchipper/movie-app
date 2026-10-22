import Image from 'next/image'

type TimeWindow = 'day' | 'week'

const range: TimeWindow = 'day'
const data = await fetch(`https://api.themoviedb.org/3/trending/tv/${range}?api_key=${process.env.TMDB_API_KEY}&language=nl-NL`)
const series = await data.json()

interface tv {
  id: number;
  name: string;
  poster_path: string;
}

export default function TrendingTv() {
  return <div className='p-10'>
    <h1 className=' text-2xl pb-10'>Trending TV Series</h1>
    <ul className=' grid grid-cols-12 gap-4 container '>
      {series.results?.map((tv: tv) => (
        <li key={tv.id}>
          <Image
            src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
            alt={tv.name}
            width={300}
            height={450}
            className="w-full h-auto rounded-md"
            loading="eager"
          />
          {series.name}
        </li>
      ))}
    </ul>

  </div>
}