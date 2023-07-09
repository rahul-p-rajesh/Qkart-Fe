import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../data/config";

import Header from "../../components/Header/Header";
import GenreFilter from "../../components/GenreFilter/GenreFilter";
import MovieListing from "../../components/MovieListing/MovieListing";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [allgenre, setAllgenre] = useState([]);
  const [ageFilter, setAgeFilter] = useState("");
  const [sort, setSort] = useState("Release Date");
  const [showSearchScreen, setShowSearchScreen] = useState(false);

  useEffect(() => {
    let cancelMovieUpdate = false;
    if (showSearchScreen === false) {
      //if search is not being used then fetch movies by filter
      const setData = async () => {
        
        const data = await fetchMovies();

        if (!cancelMovieUpdate) {
          setMovies(data);
        }
      };
      setData();
    }
    return () => {
      cancelMovieUpdate = true;
    };
  }, [allgenre, ageFilter, sort]);

  async function fetchMovies() {
    
    //1. prepare the url
    const url = prepareVideosUrl();
    //2. make a get request with url
    try {
      const responce = await axios.get(url);
      if (responce.status === 200) {
        const data = responce.data;
        if (data.hasOwnProperty("videos")) {
          return data.videos;
        } else {
          throw new Error("videos array not found ", data);
        }
      } else {
        throw new Error("200 status code for get videos not found");
      }
    } catch (err) {
      // Handle Error Here
      console.log(err);
      return [];
    }

  }


  async function fetchMoviesBySearchFromDb(searchText) {
    let url = backendUrl + "/v1/videos?title=" + searchText;
    try {
      const responce = await axios.get(url);
      if (responce.status === 200) {
        const data = responce.data;
        if (data.hasOwnProperty("videos")) {
          return data.videos;
        } else {
          throw new Error("videos array not found ", data);
        }
      } else {
        throw new Error("200 status code for get videos not found");
      }
    } catch (err) {
      // Handle Error Here
      console.error(err);
      return [];
    }

  }

  const fetchMoviesBySearch = async (searchText) => {
    const searchResult = fetchMoviesBySearchFromDb(searchText);
    searchResult.then((data) => {
      setSearchedMovies(data);

    }).catch((data) => {
      setSearchedMovies(data)

    })

  }




  /***
   * based on the filters stored
   * creates the url params and appends to the url
   */
  function prepareVideosUrl() {
    let url = backendUrl + "/v1/videos";

    let urlParams = "";
    //TODO: add genre filter to url params

    if (allgenre.length > 0) {
      allgenre.forEach((genre, idx) => {
        if (idx === 0) {
          url = url + "?genres=" + genre;
        } else {
          url = url + "," + genre;
        }
      });
    }
    // else {
    //   url = url + "?genrfes=All";
    // }

    //TODO: add age filter
    if (ageFilter !== "") {
      if (urlParams === "") {
        urlParams += "contentRating=" + encodeURIComponent(ageFilter);
      } else {
        urlParams += "&contentRating=" + encodeURIComponent(ageFilter);
      }
    }

    //TODO: add sort filter
    if (sort === "Release Date") {
      if (urlParams === "") {
        urlParams += "sortBy=releaseDate";
      } else {
        urlParams += "&sortBy=releaseDate";
      }
    } else if (sort === "View Count") {
      if (urlParams === "") {
        urlParams += "sortBy=viewCount";
      } else {
        urlParams += "&sortBy=viewCount";
      }
    }

    if (urlParams !== "") {
      url += "?" + urlParams;
    }
    return url;
  }

  function changeGenre(genre) {
    if (genre === "All Genre") {
      setAllgenre([]);
      return;
    }
    setAllgenre((oldGenre) => {
      const genres = [...oldGenre];
      const indexOfGenre = genres.indexOf(genre);
      if (indexOfGenre !== -1) {
        //genre exist in array
        genres.splice(indexOfGenre, 1);
      } else {
        genres.push(genre);
      }
      return genres;
    });
  }

  function changeAge(age) {
    if (age === "Any Age group") {
      setAgeFilter("");
      return;
    }
    setAgeFilter((oldAge) => {
      if (oldAge === age) {
        //genre exist in array
        return "";
      }

      return age;
    });
  }

  function changeSort(sort) {
    setSort(sort);
  }

  return (
    <>
      <div className="top-container">
        <Header
          onHomePage={true}
          setShowSearchScreen={setShowSearchScreen}
          fetchMoviesBySearch={fetchMoviesBySearch}
        />

        {!showSearchScreen && <GenreFilter
          selectedGenre={allgenre}
          changeGenre={changeGenre}
          selectedSort={sort}
          selectedAge={ageFilter}
          changeAge={changeAge}
          changeSort={changeSort}
        />
        }

      </div>
      <div className=" grid mt-1 h-screen justify-items-center items-start">
        <MovieListing movies={showSearchScreen ? searchedMovies: movies} />
      </div>

    </>
  );
}

export default Home;
