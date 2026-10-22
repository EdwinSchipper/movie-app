import Image from 'next/image'

type TimeWindow = 'day' | 'week'

const range: TimeWindow = 'day'
const data = await fetch(`https://api.themoviedb.org/3/trending/movie/${range}?api_key=${process.env.TMDB_API_KEY}&language=nl-NL`)
const movies = await data.json()

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function TrendingMovies() {
  return <div className='p-10'>
    <h1 className=' text-2xl pb-10'>Trending Movies</h1>
    <ul className=' grid grid-cols-12 gap-4 container '>
      {movies.results?.map((movie: Movie) => (
        <li key={movie.id}>
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={300}
            height={450}
            className="w-full h-auto rounded-md"
            loading="eager"
          />
          {movie.title}
        </li>
      ))}
    </ul>
  </div>
}