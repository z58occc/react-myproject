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
    
      <input
        className="form-control  me-2 w-50 "
        type="search"
        placeholder="搜尋產品名稱"
        aria-label="Search"
        onChange={search}
        ref={mySearch}
        onKeyUp={(e) => handleKeyEnter(e)}
        style={{
          border:'black solid',
          borderRadius:'10px'
        }}
      />
    
  );
}

export default SearchBar;
