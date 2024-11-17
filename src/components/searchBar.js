import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {

  const [searchWord, setSearchWord] = useState("");
  const mySearch = useRef();
  const navigate = useNavigate();




  const search = (e) => {
    setSearchWord(e.target.value);
  };

  const handleKeyEnter = (e) => {
    if (e.code === "Enter") {
      navigate(`/products/${searchWord}`);
    }
  };

  return (
    <div>
      <input
        className="form-control w-50 me-2"
        type="search"
        placeholder="今天想來點..."
        aria-label="Search"
        onChange={search}
        ref={mySearch}
        onKeyUp={(e) => handleKeyEnter(e)}
      />
    </div>
  );
}

export default SearchBar;