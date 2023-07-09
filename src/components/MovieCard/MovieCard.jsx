import React from 'react'
import {useNavigate} from 'react-router-dom'

function MovieCard(props) {
  const { image, title, releaseDate, id } = props;
  const navigate = useNavigate();
  return (
    <div className="video-tile">
      <div
          className="video-tile-link w-full overflow-hidden shadow-lg cursor-pointer"
          onClick={() => navigate(`/video/${id}`)}
      >
          <img className="w-full" src={image} alt={title} />
          <div className="px-6 py-4">
                <div className="font-bold text-sm mb-2 text-white text-left">{title}</div>
              <p className="text-gray-400 text-sm text-left">
                  {releaseDate}
              </p>
          </div>

        </div>
      </div>
  )
}

export default MovieCard