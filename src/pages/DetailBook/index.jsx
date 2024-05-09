import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { bookFetch } from "../../utils/booksFetch";
import { Loader, SaveIcon, UnSaveIcon } from "../../assets/icon";
import Comment from "./comment";
import { auth, db } from "../../../firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { setSaveBooks } from "../../store/slice/book-slice";
export default function DetailBook() {
  const { fetcher, data, isLoading } = bookFetch();
  const booksId = useSelector((state) => state.books.idBooks);
  const detailBooks = data.detail_books?.volumeInfo;
  const bookDescription = detailBooks?.description?.replace(
    /<\/?(p|b|br|ul|li|i)>|<\/li>/g,
    ""
  );
  const [isSaveBooks, setIsSaveBooks] = useState(false);
  const dispatch = useDispatch();
  const saveBooks = useSelector((state) => state.books.saveBooks);

  const getBooks = async () => {
    try {
      await fetcher(`volumes/${booksId}`, "detail_books");
    } catch (error) {
      console.error(`Error fetching ${booksId} data:`, error);
    }
  };

  const checkSavedBooks = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser?.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const savedBooks = doc.data().savedBooks || [];
          setIsSaveBooks(savedBooks.includes(booksId));
        }
      });

      return () => unsubscribe;
    } catch (error) {
      console.error("Error checking saved books:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getBooks();
    checkSavedBooks();
  }, []);

  const handleSaveBook = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser?.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        await updateDoc(userRef, {
          savedBooks: arrayUnion(booksId),
        });
      } else {
        await setDoc(userRef, {
          savedBooks: [booksId],
        });
      }
      dispatch(setSaveBooks([...saveBooks, booksId]));
    } catch (error) {
      console.error("Error saving books:", error);
    }
  };
  const handleDeleteSavedBook = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser?.uid);
      await updateDoc(userRef, {
        savedBooks: arrayRemove(booksId),
      });
      dispatch(setSaveBooks(saveBooks.filter((id) => id !== booksId)));
    } catch (error) {
      console.error("Error deleting saved book:", error);
    }
  };

  return (
    <div className="bg-[#2A2A2A] lg:px-16 px-8 lg:py-32 py-16 min-h-screen">
      <div className="lg:px-14 px-7 lg:py-14 py-7 bg-[#383838] rounded-2xl">
        {isLoading ? (
          <div className="flex justify-center mt-10 h-screen">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/4 w-full flex items-start justify-center">
              <img
                src={detailBooks?.imageLinks?.thumbnail}
                alt="thumbnail"
                className="lg:w-full lg:h-[350px] h-[280px] w-[180px] rounded-lg"
              />
            </div>
            <div className="lg:w-3/4 w-full text-white">
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="lg:text-3xl text-xl font-poppinsBold">{detailBooks?.title}</h1>
                  {detailBooks?.authors && (
                    <p className="lg:text-xl font-poppinsRegular">
                      By{" "}
                      {Array.isArray(detailBooks.authors)
                        ? detailBooks.authors.join(", ")
                        : detailBooks.authors}
                    </p>
                  )}
                </div>
                <p className="font-poppinsSemibold lg:text-lg text-sm rounded-lg line-clamp-4">
                  Genre:{" "}
                  {Array.isArray(detailBooks?.categories)
                    ? detailBooks?.categories.join(", ")
                    : detailBooks?.categories}
                </p>
                <div className="flex gap-2 ">
                  <a
                    className="bg-[#FFF500] px-5 text-xl font-poppinsBold rounded-lg text-black flex items-center"
                    href={detailBooks?.previewLink}
                    target="_blank"
                  >
                    Read Now
                  </a>
                  {!isSaveBooks ? (
                    <div
                      onClick={() => handleSaveBook()}
                      className="bg-white rounded-lg cursor-pointer"
                    >
                      <UnSaveIcon />
                    </div>
                  ) : (
                    <div
                      onClick={() => handleDeleteSavedBook()}
                      className="bg-white rounded-lg cursor-pointer"
                    >
                      <SaveIcon size="w-[35px]" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="lg:text-base text-sm font-poppinsSemibold line-clamp-5">{bookDescription}</p>
                </div>
                <Comment booksId={booksId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
