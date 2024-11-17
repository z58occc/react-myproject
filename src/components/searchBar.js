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
    <>
      <input
        className="form-control  me-2"
        type="search"
        placeholder="搜尋..."
        aria-label="Search"
        onChange={search}
        ref={mySearch}
        onKeyUp={(e) => handleKeyEnter(e)}
        style={{
          border:'black solid',
          width:'150px',
          borderRadius:'10px'
        }}
      />
    </>
  );
}

export default SearchBar;