import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3"> 
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap hover:text-blue-700 cursor-pointer">
            <span className="text-slate-500">Thirupathi </span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form 
          className="bg-slate-100 p-3 rounded-lg gap-2 flex items-center border border-slate-300"
          onSubmit={handleSubmit}
        >
          <input 
            type="text" placeholder="Search . . . ." 
            className="bg-transparent text-slate-700 focus:outline-none w-24 sm:w-64 font-semibold" 
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button><FaSearch className="text-slate-600"></FaSearch></button>
        </form>
        <ul className="flex gap-4">
          <Link to="/"><li className="hidden sm:inline text-slate-700 font-bold hover:text-blue-700 cursor-pointer">Home</li></Link>
          <Link to="/about"><li className="hidden sm:inline text-slate-700 font-bold hover:text-blue-700 cursor-pointer">About</li></Link>
          <Link to="/account">
            {
              currentUser ? <img className="w-7 h-7 rounded-full object-cover" src={currentUser.avatar} alt="profile" />
              : <li className="sm:inline text-slate-700 font-bold hover:text-blue-700 cursor-pointer">Sign In</li>
            }
          </Link>
        </ul>
      </div>
    </header>
  );
}
