import { useEffect, useState } from "react";
import { bookFetch } from "../../utils/booksFetch";
import { Loader, NextIcon, PrevIcon } from "../../assets/icon";
import { useDispatch } from "react-redux";
import { setIdBooks } from "../../store/slice/book-slice";
import { Link } from "react-router-dom";

export default function NewReleases() {
  const { fetcher, data, isLoading } = bookFetch();
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();
  const getBooks = async (subject, startIndex = 0) => {
    try {
      await fetcher(
        `volumes?q=${subject}&startIndex=${startIndex}&maxResults=4&orderBy=newest`,
        "new_releases"
      );
    } catch (error) {
      console.error(`Error fetching ${subject} data:`, error);
    }
  };

  const handleNext = () => {
    const newStartIndex = startIndex + 4;
    setStartIndex(newStartIndex);
    getBooks("a", newStartIndex);
  };
  const handlePrev = () => {
    const newStartIndex = startIndex - 4;
    setStartIndex(newStartIndex);
    getBooks("a", newStartIndex);
  };

  const handleDetailProduct = (data) => {
    dispatch(setIdBooks(data));
  };

  useEffect(() => {
    getBooks("a", startIndex);
  }, []);
  return (
    <div className="bg-[#383838] py-10 px-10 rounded-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-white font-poppinsBold text-3xl">New Releases</h1>
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
          {data["new_releases"]?.items.map(({ volumeInfo }, index) => (
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
                    to={`/detail-book/${data["new_releases"]?.items[index].id}`}
                    onClick={() =>
                      handleDetailProduct(data["new_releases"]?.items[index].id)
                    }
                  >
                    {volumeInfo.title}
                  </Link>
                </h1>
                {volumeInfo?.authors && (
                  <p className="lg:text-sm text-xs truncate font-poppinsRegular">
                    By{" "}
                    {Array.isArray(volumeInfo.authors)
                      ? volumeInfo.authors.join(", ")
                      : volumeInfo.authors}
                  </p>
                )}
                <p className="line-clamp-3 text-wrap text-xs font-poppinsSemibold">
                  {volumeInfo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
