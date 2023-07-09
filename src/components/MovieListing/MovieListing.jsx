import React from 'react'
import MovieCard from '../MovieCard/MovieCard';
import './MovieListing.css';

function MovieListing(props) {
  const { movies } = props;
  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-2 list-container w-4/5 lg:w-2/3">
      {movies.map((movie) => {
        return (<MovieCard
          key={movie._id}
          id={movie._id}
          image={movie.previewImage}
          title={movie.title}
          releaseDate={movie.releaseDate}
        />)
      })}
    </div>
  )
}

export default MovieListing