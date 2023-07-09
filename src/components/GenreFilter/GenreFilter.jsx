import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { genres, ageGroup, releaseSort } from '../../data/const'
import { BsArrowDownUp } from "react-icons/bs";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function GenreFilter(props) {

  const {
    selectedGenre,
    selectedSort,
    selectedAge,
    changeGenre,
    changeAge,
    changeSort,
  } = props;
  return (
    <>
      <div className="flex flex-row flex-wrap my-7 justify-center">
        {/* genre pills */}
        <div className="flex flex-row">
          {genres.map((genre) => {
            // bg-white, text-gray-700
            let className =
              "genre-btn inline-block rounded-full px-3 font-normal text-sm mr-2 mb-2 hover:bg-white hover:text-gray-600";

            if (genre === "All Genre" && selectedGenre.length === 0) {
              className += " bg-white text-gray-700";
            } else if (selectedGenre.indexOf(genre) !== -1) {
              className += " bg-white text-gray-700";
            } else {
              className += " text-white";
            }

            return (
              <button
                key={genre}
                className={className}
                onClick={() => changeGenre(genre)}
              >
                {genre}
              </button>
            );
          })}
        </div>
        {/* sort pills */}
        <div>
          {/* <span className="inline-block bg-white text-gray-700 rounded-full mx-3 px-5 py-1 font-normal text-sm mr-2 mb-2">{ releaseSort[0]}</span> */}
          <Menu
            as="div"
            className="relative inline-block text-left mx-3 mb-2 px-5 "
          >
            <div>
              <Menu.Button
                className="sort-select inline-flex justify-center items-center w-full rounded-full 
                                    border border-gray-300 shadow-sm px-4 py-2
                                    bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
                                  focus:ring-offset-gray-100 "
              >
                <BsArrowDownUp
                  className="mr-1 ml-1 h-4 w-4"
                  aria-hidden="true"
                />
                {selectedSort}
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className="origin-top-right 
              absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 text-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1">
                  {releaseSort.map((sort) => {
                    let idName = "";
                    sort === "View Count" ? idName = "view-count-option" : idName = "release-date-option"
                    return (
                      <Menu.Item key={sort}>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? "bg-black text-white" : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                            id={idName}
                            
                            
                            onClick={() => changeSort(sort)}
                          >
                            {sort}
                          </span>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {/* age pills */}
      <div className="flex flex-row flex-wrap my-7 justify-center">
        {ageGroup.map((age) => {
          // bg-white, text-gray-700
          let className =
            "content-rating-btn inline-block rounded-full px-3 font-normal text-sm mr-2 mb-2 hover:bg-white hover:text-gray-600";

          if (age === "Any Age group" && selectedAge === "") {
            className += " bg-white text-gray-700";
          } else if (selectedAge === age) {
            className += " bg-white text-gray-700";
          } else {
            className += " text-white";
          }

          return (
            <button
              key={age}
              className={className}
              onClick={() => changeAge(age)}
            >
              {age}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default GenreFilter;