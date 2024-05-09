import React, { useEffect, useState } from "react";
import { Loader, SaveIcon } from "../../assets/icon";
import thumbnail from "../../assets/img/thumbnail.png";
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { bookFetch } from "../../utils/booksFetch";
import { setIdBooks, setSaveBooks } from "../../store/slice/book-slice";
import { Link } from "react-router-dom";

export default function Favorites() {
  const savedBooks = useSelector((state) => state.books.saveBooks);
  const dispatch = useDispatch();
  const { fetcher, data, isLoading } = bookFetch();

  const getBooks = async (booksId = savedBooks) => {
    for (let i = 0; i < booksId.length; i++) {
      try {
        await fetcher(`volumes/${booksId[i]}`, [i]);
      } catch (error) {
        console.error(`Error fetching ${booksId[i]} data:`, error);
      }
    }
  };

  const handleDeleteSavedBook = async (booksId) => {
    try {
      const userRef = doc(db, "users", auth.currentUser?.uid);
      await updateDoc(userRef, {
        savedBooks: arrayRemove(booksId),
      });
      dispatch(setSaveBooks(savedBooks.filter((book) => book !== booksId)));
    } catch (error) {
      console.error("Error deleting saved book:", error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const handleDetailProduct = (data) => {
    dispatch(setIdBooks(data));
  };

  return (
    <div className="bg-[#2A2A2A] lg:px-16 px-8 lg:py-32 py-16 min-h-screen">
      <div className="lg:px-14 px-7">
        <h1 className="text-white font-bold text-3xl">Favorites</h1>
        {savedBooks.length === 0 ? (
          <div className="flex justify-center items-center h-screen">
            <h1 className="text-white text-2xl">No saved books</h1>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="flex justify-center mt-10 h-screen">
                <Loader />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
                {Object.values(data).map((book, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="lg:w-1/3 w-2/5">
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail}
                        alt=""
                        className="w-full lg:h-52 h-40 fade-in rounded-lg"
                      />
                    </div>
                    <div className="lg:w-2/3 w-3/5 text-white flex flex-col lg:gap-4 gap-2">
                      <h1 className="font-bold lg:text-2xl text-lg line-clamp-2 lg:truncate">
                        <Link
                          to={`/detail-book/${data[index].id}`}
                          onClick={() => handleDetailProduct(data[index].id)}
                        >
                          {book.volumeInfo.title}
                        </Link>
                      </h1>
                      <div>
                        <p className="truncate text-xs lg:text-base">
                          By {book.volumeInfo.authors.join(", ")}
                        </p>
                        <p className="truncate text-xs lg:text-base">
                          Genre: {book.volumeInfo.categories.join(", ")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <a
                          href={book.volumeInfo.previewLink}
                          target="_blank"
                          className="bg-[#FFF500] lg:px-5 px-2 lg:text-xl text-xs font-bold rounded-lg text-black flex items-center"
                        >
                          Read Now
                        </a>
                        <div
                          onClick={() => handleDeleteSavedBook(book.id)} // Assuming you pass the book id to delete
                          className="bg-white rounded-lg cursor-pointer"
                        >
                          <SaveIcon size="lg:w-[35px] w-[25px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
