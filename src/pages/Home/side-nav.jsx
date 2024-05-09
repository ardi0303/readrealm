import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CloseIcon, MenuIcon } from "../../assets/icon";
import Modal from "../../components/modal";
import { useDispatch, useSelector } from "react-redux";
import { setSearchBooks } from "../../store/slice/book-slice";
import { set } from "firebase/database";

export default function SideNav() {
  const [isFixed, setIsFixed] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu
  const [showMoreModal, setShowMoreModal] = useState(false); // State to toggle more modal
  const searchBooks = useSelector((state) => state.books.searchBooks);
  const dispatch = useDispatch();

  const genres = [
    {
      id: "fiction",
      emoji: "👽",
    },
    {
      id: "poetry",
      emoji: "📜",
    },
    {
      id: "fantasy",
      emoji: "🧙‍♂",
    },
    {
      id: "love",
      emoji: "💕",
    },
    {
      id: "more",
      emoji: "✨",
    },
  ];

  const moreGenres = [
    "Adventure",
    "Biography",
    "Children",
    "Comedy",
    "Crime",
    "Drama",
    "Horror",
    "Mystery",
    "Romance",
    "Thriller",
    "Western",
  ];

  const modalRef = useRef(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const scrollY = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    }
  };

  const handleActiveSection = () => {
    for (let i = genres.length - 1; i >= 0; i--) {
      const element = document.getElementById(genres[i].id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          setActiveSection(genres[i].id);
          break;
        }
      } else {
        setActiveSection("");
      }
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 450) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
    handleActiveSection();
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMoreModal = () => {
    setShowMoreModal(!showMoreModal);
  };

  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowMoreModal(false);
    }
  };

  const handleSearch = (genre) => {
    dispatch(setSearchBooks(genre));
    setShowMoreModal(!showMoreModal);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <div
        className={`${
          isFixed
            ? "fixed lg:top-14 top-2 side-nav-down z-10"
            : "absolute side-nav-up"
        } lg:bg-transparent`}
      >
        <div className="flex justify-end">
          <button
            onClick={toggleMenu}
            className={`${
              isFixed ? "bg-black" : ""
            } lg:hidden px-2 py-2 rounded-xl`}
          >
            {isMenuOpen ? <CloseIcon size={40} /> : <MenuIcon />}
          </button>
        </div>

        {/* SideNav */}
        <div
          className={` ${
            isMenuOpen ? "" : "hidden lg:block"
          } bg-[#2A2A2A] py-2 px-4 lg:py-0 lg:px-0 rounded-xl border border-white lg:border-none`}
        >
          <h1 className="font-bold text-xl text-white">Book by Genre</h1>
          <div className="mt-4">
            <ul className="flex flex-col gap-2 text-white text-lg font-medium">
              {genres.map((genre) => (
                <li key={genre.id} onClick={() => scrollToSection(genre.id)}>
                  {genre.id === "more" ? (
                    <button onClick={toggleMoreModal}>
                      <div className="bg-transparent flex gap-2 lg:px-4 px-2 py-1 justify-start">
                        <span>{genre.emoji}</span>
                        <p className="capitalize">{genre.id}</p>
                      </div>
                    </button>
                  ) : (
                    <Link to="/">
                      <div
                        className={`${
                          activeSection === genre.id
                            ? "bg-black rounded-xl"
                            : "bg-transparent"
                        } flex gap-2 lg:px-4 px-2 py-1 justify-start`}
                      >
                        <span>{genre.emoji}</span>
                        <p className="capitalize">{genre.id}</p>
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* More Modal */}
      {showMoreModal && (
        <Modal onClose={toggleMoreModal}>
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">More Genres</h2>
            <ul className="text-lg max-h-52 overflow-y-auto">
              {moreGenres.map((genre, index) => (
                <li
                  key={index}
                  className="mb-2 cursor-pointer"
                  onClick={() => {
                    handleSearch(genre);
                    scrollToSection("book-by-search");
                  }}
                  value={genre}
                >
                  {genre}
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}
