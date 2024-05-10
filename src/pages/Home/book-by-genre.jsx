import React, { useEffect, useState } from "react";
import { Loader, NextIcon, PrevIcon } from "../../assets/icon";
import { bookFetch } from "../../utils/booksFetch";
import { useDispatch, useSelector } from "react-redux";
import { setIdBooks } from "../../store/slice/book-slice";
import { Link } from "react-router-dom";

export default function BookByGenre() {
  const { fetcher, data } = bookFetch();
  const [startIndex, setStartIndex] = useState({});
  const [isLoadingGenres, setIsLoadingGenres] = useState({});
  const genres = ["fiction", "poetry", "fantasy", "love"];
  const dispatch = useDispatch();

  const getBooks = async (genre = [...genres], startIndex = 0) => {
    const newIsLoadingGenres = { ...isLoadingGenres };
    for (let i = 0; i < genre.length; i++) {
      newIsLoadingGenres[genre[i]] = true;
      setIsLoadingGenres(newIsLoadingGenres);
      try {
        if (genre[i] === "fiction") {
          await fetcher(
            `volumes?q=subject:${genre[i]}&startIndex=${
              startIndex[genre[i]] || 0
            }&maxResults=6`,
            genre[i]
          );
        } else if (genre[i] === "poetry") {
          await fetcher(
            `volumes?q=subject:${genre[i]}&startIndex=${
              startIndex[genre[i]] || 0
            }&maxResults=6`,
            genre[i]
          );
        } else if (genre[i] === "fantasy") {
          await fetcher(
            `volumes?q=subject:${genre[i]}&startIndex=${
              startIndex[genre[i]] || 0
            }&maxResults=6`,
            genre[i]
          );
        } else if (genre[i] === "love") {
          await fetcher(
            `volumes?q=subject:${genre[i]}&startIndex=${
              startIndex[genre[i]] || 0
            }&maxResults=6&`,
            genre[i]
          );
        }
      } catch (error) {
        console.error(`Error fetching ${genre[i]} data:`, error);
      }
      newIsLoadingGenres[genre[i]] = false;
      setIsLoadingGenres(newIsLoadingGenres);
    }
  };

  const handleNext = (genre) => {
    const newStartIndex = { ...startIndex };
    newStartIndex[genre] = (startIndex[genre] || 0) + 8;
    setStartIndex(newStartIndex);
    getBooks([genre], newStartIndex);
  };
  const handlePrev = (genre) => {
    const newStartIndex = { ...startIndex };
    newStartIndex[genre] = (startIndex[genre] || 0) - 8;
    setStartIndex(newStartIndex);
    getBooks([genre], newStartIndex);
  };

  const handleDetailProduct = (data) => {
    dispatch(setIdBooks(data));
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div>
      {Object.entries(data).map(([genre, genreData], index) => (
        <div
          key={index}
          className="bg-transparent py-10 lg:px-10 px-6 rounded-3xl"
        >
          <div className="flex justify-between items-center" id={genre}>
            <h1 className="text-white font-poppinsBold text-3xl capitalize">
              {genre}
            </h1>
            <div className="flex gap-1">
              {startIndex[genre] >= 6 && (
                <div
                  className="bg-[#787878] py-3 px-3 rounded-full cursor-pointer"
                  onClick={() => handlePrev(genre)}
                >
                  <PrevIcon />
                </div>
              )}
              <div
                className="bg-[#787878] py-3 px-3 rounded-full cursor-pointer"
                onClick={() => handleNext(genre)}
              >
                <NextIcon />
              </div>
            </div>
          </div>
          {isLoadingGenres[genre] ? (
            <div className="flex justify-center mt-10">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {genreData.items.map(({ id, volumeInfo }, index) => (
                <div
                  key={index}
                  className="flex from-[#383838] bg-gradient-to-b px-8 rounded-xl lg:gap-4 gap-2 mt-10"
                >
                  <div className="w-2/5 flex justify-center">
                    <img
                      src={volumeInfo.imageLinks?.thumbnail}
                      alt=""
                      className="-translate-y-4 rounded-lg lg:h-[160px] lg:w-[108px] h-[120px] w-[78px] thumbnail"
                    />
                  </div>
                  <div className="text-white flex flex-col mt-6 gap-2 w-3/5">
                    <h1 className="font-poppinsSemibold lg:text-2xl text-lg truncate lg:line-clamp-2">
                      <Link
                        to={`/detail-book/${id}`}
                        onClick={() => handleDetailProduct(id)}
                      >
                        {volumeInfo.title}
                      </Link>
                    </h1>
                    {volumeInfo?.authors && (
                      <p className="text-sm truncate font-poppinsRegular">
                        By{" "}
                        {Array.isArray(volumeInfo.authors)
                          ? volumeInfo.authors.join(", ")
                          : volumeInfo.authors}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
