import React, {useState} from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/icon.png";
import { MdFileUpload } from "react-icons/md";
import PopUp from "../UploadPopUp";

const debounce = function (callBackFn, delay) {
  let timerId;

  return function () {
    let self = this;
    let args = arguments;
    clearTimeout(timerId);
      timerId = setTimeout(()=>{
        callBackFn.apply(self,args);
    }, delay)
  }
}
const debounceSearch = debounce((callback, text) => { callback(text)}, 500)

function Header(props) {
  const { onHomePage, setShowSearchScreen, fetchMoviesBySearch } = props;

  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleOpenPopUp = () => {
    setOpenModal(true);
  };

  const handleClosePopUp = (value) => {
    setOpenModal(false);
  };



  const updateSearch = (event) => {
    const input = event.target.value;
    //set the search in state
    setSearchText(input);
   
    //if len of event.target.value === 0
    if (input === "" || input.length === 0) {
      // set setShowSearchScreen to false
      setShowSearchScreen(false)

    } else {
      //if len is greater than zero
      // if len === 1 set setShowSearchScreen to true
      if (input.length === 1) {
        setShowSearchScreen(true);

      }
       // make api call to search  and fetch movies from there
      
      //debounce method implementation
      debounceSearch((searchText) => {
         fetchMoviesBySearch(searchText);
        },input)
      
      //pass it to state
    }
  

  }
  
  return (
    <nav className="relative py-3 px-4 sm:px-6 h-30">
      <div className="flex flex-row items-center justify-between">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Xflix icon" />
          </Link>
        </div>

        {onHomePage && (
          <>
            <div className="search-bar w-6/12 flex flex-row items-center">
              <input
                className="
                      basis-130
                      block
                      text-xl
                      font-normal
                      text-slate-500
                      bg-black bg-clip-padding
                      border border-solid border-gray-700
                      rounded
                      transition
                      ease-in-out
                      focus:text-white focus:outline-none
                      px-2
                      py-1
                      w-9/12
                      "
                id="search-input"
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={updateSearch}
              ></input>
              <button
                type="submit"
                className="text-white bg-gray-700 hover:bg-gray-700 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium text-sm px-4 py-2"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
              <label
                htmlFor="search-movies"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
              >
                Search
              </label>
            </div>

            <div className="upload-btn h-30">
              <button
                onClick={handleOpenPopUp}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <MdFileUpload className="inline-block" size={20} /> Upload
              </button>
              <PopUp
            
                open={openModal}
                onClose={handleClosePopUp}
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
