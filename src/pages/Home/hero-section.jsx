import { useDispatch } from "react-redux";
import { SaveIcon, SearchIcon } from "../../assets/icon";
import { setSearchBooks } from "../../store/slice/book-slice";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setMessage } from "../../store/slice/bot-slice";

export default function HeroSection() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  }, []);

  const handleSearch = (e) => {
    dispatch(setSearchBooks(e.target.value));
    setInput(e.target.value);
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(setSearchBooks(""));
      dispatch(
        setMessage(
          [{ text: "Hello, how can I help you?", isBot: true }]
        )
      );
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-bg-hero bg-cover">
      <div className="lg:mx-16 mx-8">
        <nav className="flex justify-between items-center py-4">
          <h1 className="lg:text-3xl text-2xl font-poppinsBold text-white">
            ReadRealm.
          </h1>
          <div className="flex gap-1">
            {isAuth ? (
              <div className="flex gap-1">
                <button
                  className="bg-white rounded-md px-1 lg:px-0"
                  onClick={() => navigate("/favorites")}
                >
                  <SaveIcon size="w-[25px] lg:w-[35px]" />
                </button>
                <button
                  className="bg-[#FFF500] rounded-md lg:px-6 px-2 py-1 font-poppinsSemibold"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="bg-[#FFF500] rounded-md lg:px-6 py-1 px-2 font-poppinsSemibold"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
        <div className="flex flex-col lg:w-3/5 w-full gap-6 py-14">
          <div className="flex flex-col lg:gap-4 gap-1">
            <h1 className="font-poppinExtraBold lg:text-5xl text-3xl text-white">
              Eksplorasi Dunia
            </h1>
            <h1 className="font-poppinExtraBold lg:text-5xl text-3xl text-white">
              Buku Terbaik
            </h1>
          </div>
          <p className="text-white lg:text-lg text-sm font-poppinsSemibold">
            Tingkatkan petualangan literer Anda dengan menjelajahi dunia
            kata-kata melalui koleksi buku kami yang menakjubkan!
          </p>
          <div className="flex items-center lg:w-[400px] w-full border-white border-b">
            <div>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search books by title, author, genre, and etc..."
              className="bg-transparent focus:outline-none text-white placeholder:font-poppinsSemibold placeholder:text-white text-xs lg:text-base font-poppinsSemibold w-full"
              value={input}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
