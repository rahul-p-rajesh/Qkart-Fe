import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoPrimitiveDot } from "react-icons/go";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { backendUrl } from "../../data/config";
import Header from "../../components/Header/Header";
import MovieListing from "../../components/MovieListing/MovieListing";
import "./Video.css";

function Video() {

  const [selectedVideoData, setSlectedVideoData] = useState({
    id: "",
    videoLink: "",
    title: "",
    genre: "",
    contentRating: "",
    releaseDate: "",
    votes: {
      upVotes: 0,
      downVotes: 0
    }

  });
  const [moviesData, setMoviesData] = useState([]);
  const [videoStatus, setVideoStatus] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    
   let cancelMovieUpdate = false;

    const setMainMovie = async () => { 

      const hostMovie = await fetchMoviesById();
      if (!cancelMovieUpdate) {
        setSlectedVideoData(hostMovie);
      }
    }
    
    const setMovies = async () => {
      const movies = await fetchMovies();
      if (!cancelMovieUpdate) {
        setMoviesData(movies);
      }
    };

    setMainMovie();
    setMovies();

    const videoStatusFromStorage = localStorage.getItem("videoStatus");
    if (videoStatusFromStorage === "liked") {
      setVideoStatus("liked")

    } else if (videoStatusFromStorage === "disliked") { 
        setVideoStatus("disliked")
    }

    return () => {
      cancelMovieUpdate = true;
    };

  },[videoStatus])


  async function fetchMovies() {
    //1. prepare the url
    //TODO: add genre filter to url params
    const url = backendUrl + "/v1/videos";
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
      console.error(err);
      return [];
    }
  }

  function getVideoId() {

    if (params.videoId == null) {
      navigate('/');
    }
    const videoId = params.videoId;
    return videoId;
  }
  async function fetchMoviesById() {
    //1. prepare the url
    //TODO: add genre filter to url params
    
    const videoId = getVideoId();
    const url = backendUrl + "/v1/videos/" + videoId;

    //2. make a get request with url
    try {
      const responce = await axios.get(url);
      if (responce.status === 200) {
        const data = responce.data;
        return data;
      } else {
        throw new Error("200 status code for get videos not found");
      }
    } catch (err) {
      // Handle Error Here
      console.error(err);
      return {
        id: "",
        videoLink: "",
        title: "",
        genre: "",
        contentRating: "",
        releaseDate: "",
        votes: {
          upVotes: 0,
          downVotes: 0
        }

      };
    }
  }

  function likeVideo() {
    //1. check the video is liked in local storage --> yes(return)
    if (localStorage.getItem("videoStatus") !== null
      && localStorage.getItem("videoStatus") === "liked") {
      
      console.log("video is already liked")
      return
    }

    //2. make api call to store like video
    storeVideoStatus(true).then(
      (status) => { 
        if (status) {
           //2. store the like in localstorage
          setVideoStatus("liked");
           localStorage.setItem("videoStatus", "liked");
        } else {
           console.log("could not update responce")
        }
       
    });
  }


    function dislikeVideo() {
    //1. check the video is liked in local storage --> yes(return)
    if (localStorage.getItem("videoStatus") !== null
      && localStorage.getItem("videoStatus") === "disliked") {
      
      console.log("video is already disliked")
      return
    }

    //2. make api call to store like video
    storeVideoStatus(false).then(
      (status) => { 
        if (status) {
           //2. store the like in localstorage
          setVideoStatus("disliked");
           localStorage.setItem("videoStatus", "disliked");
        } else {
           console.log("could not update responce")
        }
       
    });
  }

  async function storeVideoStatus(videoLiked) {

    const videoId = getVideoId();
    const url = backendUrl + "/v1/videos/" + videoId + "/votes";
    
    const body = {
      "vote": videoLiked ? "upVote" : "downVote",
      "change": "increase"
    };
    //2. make a get request with url
    try {
      const responce = await axios.patch(url, body);
      if (responce.status === 204) {
        return true
      } else {
        throw new Error("204 status code for get videos not found");
      }
    } catch (err) {
      // Handle Error Here
      console.error(err);
      return false;
    }
  }

  let likedBtnClassName = "like inline-block rounded-full px-3 mr-3 bg-gray-600 text-white";
  let dislikeBtnClassName = "dislike inline-block rounded-full px-3 mr-3 bg-gray-600 text-white";

  if (videoStatus === "liked") {
    likedBtnClassName = "like inline-block rounded-full px-3 mr-3 bg-blue-500 text-white";

  } else if(videoStatus === "disliked") {
    dislikeBtnClassName = "dislike inline-block rounded-full px-3 mr-3 bg-blue-500 text-white";
  }

  return (
    <>
      <Header onHomePage={false} />
      <div className="primary-container grid h-screen place-items-center" >
        {/* video container*/}
        <div className="iframe-parent video-container mb-6 border-b-2 border-gray-600 w-4/5 lg:w-2/3" id={selectedVideoData.id}>

          <iframe className="w-full aspect-video rounded-lg "
            src={`https://www.${selectedVideoData.videoLink}`} title={selectedVideoData.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

          <div className="detail-container my-5 mx-2 text-left">
            {/* title */}
            <p className="heading text-xl text-white">{selectedVideoData.title}</p>
            {/* sub details of video */}
            <div className="sub-heading text-slate-500 flex justify-between">

              <div className="flex justify-around">
                <p>{selectedVideoData.contentRating}</p>
                <GoPrimitiveDot className="mx-1 pt-1" size={20} />
                <p>{selectedVideoData.releaseDate}</p>
              </div>

              <div className="flex justify-items-center">
                <button
                  onClick={likeVideo}
                
                  className={likedBtnClassName}
                
                >
                  <AiFillLike className="inline" /> {selectedVideoData.votes.upVotes}k
                </button>

                <button
                  onClick={dislikeVideo}
                  className={dislikeBtnClassName}
                
                >
                  <AiFillDislike className="inline" /> {selectedVideoData.votes.downVotes}k
                </button>
              </div>

            </div>
          </div>
        </div>
        <MovieListing className={"border-t-1 border-slate-500"} movies={moviesData} />
      </div>
       
    </>
  )
}

export default Video