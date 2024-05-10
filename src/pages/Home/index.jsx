import HeroSection from "./hero-section";
import SideNav from "./side-nav";
import NewReleases from "./new-releases";
import BookByGenre from "./book-by-genre";
import BookBySearch from "./book-by-search";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Home() {
  const searchBooks = useSelector((state) => state.books.searchBooks);
  useEffect(() => {
    const timer = setTimeout(() => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="bg-[#2A2A2A] w-full min-h-screen">
      <HeroSection />
      <div className="flex flex-col lg:mx-12 mx-4 lg:py-14 py-6 lg:flex-row">
        <div className="lg:w-1/4 w-full flex justify-end lg:justify-start">
          <SideNav />
        </div>
        <div className="lg:w-3/4 w-full flex flex-col gap-4 mt-16 lg:mt-0">
          <div
            className={`${searchBooks === "" ? "" : "gap-14"} flex flex-col`}
            id="book-by-search"
          >
            <BookBySearch />
            <NewReleases />
          </div>
          <BookByGenre />
        </div>
      </div>
      <footer className="bg-[#2A2A2A]">
        <p>ini footer</p>
      </footer>
    </div>
  );
}
