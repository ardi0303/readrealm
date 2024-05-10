import { useEffect, useState } from "react";
import { bookFetch } from "../../utils/booksFetch";
import { Loader, NextIcon, PrevIcon } from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setIdBooks } from "../../store/slice/book-slice";

export default function BookBySearch() {
  const { fetcher, data, isLoading } = bookFetch();
  const [startIndex, setStartIndex] = useState(0);
  const searchBooks = useSelector((state) => state.books.searchBooks);
  const dispatch = useDispatch();
  const getBooks = async (subject, startIndex = 0) => {
    try {
      if (searchBooks !== "") {
        await fetcher(
          `volumes?q=${subject}&startIndex=${startIndex}&maxResults=4`,
          "by_search"
        );
      }
    } catch (error) {
      console.error(`Error fetching ${subject} data:`, error);
    }
  };

  const handleNext = () => {
    const newStartIndex = startIndex + 4;
    setStartIndex(newStartIndex);
    getBooks(searchBooks, newStartIndex);
  };
  const handlePrev = () => {
    const newStartIndex = startIndex - 4;
    setStartIndex(newStartIndex);
    getBooks(searchBooks, newStartIndex);
  };

  useEffect(() => {
    getBooks(searchBooks, startIndex);
    setStartIndex(0);
  }, [searchBooks]);

  const handleDetailProduct = (data) => {
    dispatch(setIdBooks(data));
  };

  return (
    <div>
      {searchBooks === "" ? null : (
        <div className={`${searchBooks === "" ? "fade-out" : "fade-in"}`}>
          {data["by_search"]?.totalItems === 0 ? (
            <div className="bg-[#383838] py-10 px-10 rounded-3xl">
              <h1 className="text-white font-poppinsBold text-3xl">
                No Books Found
              </h1>
            </div>
          ) : (
            <div className="bg-[#383838] py-10 px-10 rounded-3xl">
              <div className="flex justify-between items-center">
                <h1 className="text-white font-poppinsBold text-3xl">
                  {searchBooks}
                </h1>
                <div className="flex gap-1">
                  {startIndex >= 4 && (
                    <div
                      className="bg-[#787878] py-3 px-3 rounded-full cursor-pointer"
                      onClick={() => handlePrev()}
                    >
                      <PrevIcon />
                    </div>
                  )}
                  <div
                    className="bg-[#787878] py-3 px-3 rounded-full cursor-pointer"
                    onClick={() => handleNext()}
                  >
                    <NextIcon />
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center mt-10">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  {data["by_search"]?.items.map(({ volumeInfo }, index) => (
                    <div className="flex" key={volumeInfo.id || index}>
                      <div className="w-1/3">
                        <img
                          src={volumeInfo.imageLinks?.thumbnail}
                          alt=""
                          className="lg:h-[160px] lg:w-[108px] h-[120px] w-[78px] fade-in rounded-lg"
                        />
                      </div>
                      <div className="text-white flex flex-col justify-center gap-2 w-2/3">
                        <h1 className="font-poppinsSemibold lg:text-2xl truncate">
                          <Link
                            to={`/detail-book/${data["by_search"]?.items[index].id}`}
                            onClick={() =>
                              handleDetailProduct(
                                data["by_search"]?.items[index].id
                              )
                            }
                          >
                            {volumeInfo.title}
                          </Link>
                        </h1>
                        <p className="lg:text-sm text-xs truncate font-poppinsRegular">
                          By {volumeInfo.authors}
                        </p>
                        <p className="line-clamp-3 text-wrap text-xs font-poppinsSemibold">
                          {volumeInfo.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
