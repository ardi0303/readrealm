import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { bookFetch } from "../../utils/booksFetch";
import { BotIcon, Loader, SaveIcon, UnSaveIcon } from "../../assets/icon";
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
import Modal from "../../components/modal";
import { runChatBot } from "../../chatbot";
import { setMessage } from "../../store/slice/bot-slice";

export default function DetailBook() {
  const { fetcher, data, isLoading } = bookFetch();
  const booksId = useSelector((state) => state.books.idBooks);
  const detailBooks = data.detail_books?.volumeInfo;
  const bookDescription = detailBooks?.description
    ?.replace(/<\/?(p|b|br|ul|li|i)>|<\/li>/g, "")
    .replace(/&quot;/g, '"');
  const [isSaveBooks, setIsSaveBooks] = useState(false);
  const dispatch = useDispatch();
  const saveBooks = useSelector((state) => state.books.saveBooks);
  const currentUID = auth.currentUser?.uid;
  const userRef = doc(db, "users", currentUID);
  const [showBot, setShowBot] = useState(false);
  const [inputRequest, setInputRequest] = useState("");
  const message = useSelector((state) => state.bot.message);
  const [isLoadingBot, setIsLoadingBot] = useState(false);

  const getBooks = async () => {
    try {
      await fetcher(`volumes/${booksId}`, "detail_books");
    } catch (error) {
      console.error(`Error fetching ${booksId} data:`, error);
    }
  };
  const checkSavedBooks = async () => {
    try {
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

  const handleSaveBook = async () => {
    try {
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
      await updateDoc(userRef, {
        savedBooks: arrayRemove(booksId),
      });
      dispatch(setSaveBooks(saveBooks.filter((id) => id !== booksId)));
    } catch (error) {
      console.error("Error deleting saved book:", error);
    }
  };

  const handleShowBot = () => {
    setShowBot(!showBot);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      setInputRequest("");
      setIsLoadingBot(true);
      const botResponse = await runChatBot(inputRequest);
      dispatch(
        setMessage([
          ...message,
          { text: inputRequest, isBot: false },
          { text: botResponse, isBot: true },
        ])
      );
      setIsLoadingBot(false);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getBooks();
    checkSavedBooks();
  }, []);

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
                  <div className="flex justify-between">
                    <h1 className="lg:text-3xl text-xl font-poppinsBold truncate">
                      {detailBooks?.title}
                    </h1>
                  </div>
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
                    ? detailBooks?.categories?.join(", ")
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
                  <button
                    onClick={handleShowBot}
                    className="bg-black rounded-lg cursor-pointer flex items-center justify-center"
                  >
                    <BotIcon size={35} />
                  </button>
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
                  <p className="lg:text-base text-sm font-poppinsSemibold line-clamp-5">
                    {bookDescription}
                  </p>
                </div>
                <Comment booksId={booksId} />
              </div>
            </div>
          </div>
        )}
      </div>
      {showBot && (
        <Modal onClose={handleShowBot}>
          <div className="text-white">
            <h2 className="text-2xl font-poppinsBold mb-4">Chat Bot</h2>
            <div className="flex flex-col p-4 gap-4 max-h-[600px] lg:max-h-[400px] overflow-y-auto">
              <div className="flex flex-col gap-2 items-start w-full px-2 text-black">
                {message.map((msg, index) => {
                  return (
                    <div
                      key={index}
                      className={`${
                        msg.isBot ? "bg-gray-300" : "bg-gray-200 ml-auto"
                      } p-2 rounded-lg`}
                    >
                      <p className="text-xs font-poppinsSemibold">
                        {msg.isBot ? "Bot" : "You"}
                      </p>
                      <p className="font-poppinsRegular">{msg.text}</p>
                    </div>
                  );
                })}
              </div>
              <form className="flex gap-2 w-full" onSubmit={handleSendRequest}>
                <input
                  type="text"
                  value={inputRequest}
                  onChange={(e) => setInputRequest(e.target.value)}
                  className="rounded-full w-full text-black px-4 font-poppinsRegular placeholder:font-poppinsRegular"
                  placeholder="Ask me anything..."
                />
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-6 py-1 rounded-lg font-poppinsSemibold"
                  disabled={isLoadingBot}
                >
                  {isLoadingBot ? "Loading..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
