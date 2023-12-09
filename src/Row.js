import React, { useEffect, useState } from "react";
import "./Row.css";
import axios from "./axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  // const rowRef = useRef(null)

  const [trailerUrl, setTrailerUrl] = useState(""); // variable for the trailer

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);

      // console.log(request.data.results);  // shows all the objects
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  //trailerUrl style
  const opts = {
    heights: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  //trailerUrl event
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie.name || movie.original.name)
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  // console.log(movies); // shows all the movies
  return (
    //Refer to BEM convention about how to handle ClassNames below
    <div className="row">
      <h1>{title}</h1>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge "}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>

      {/* trailerUrl div */}
      <div style={{ padding: "40px " }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;
