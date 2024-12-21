import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Collapse } from "bootstrap";
import SearchBar from "./SearchBar";
import logo from "../assets/images/logo2.png";

function Navbar({ cartData }) {
  const navCollapse = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [navActive, setNavActive] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 監聽螢幕大小改變
    window.addEventListener("resize", handleResize);

    // 清除事件監聽器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const style = {
    backgroundColor: windowWidth < 990 ? "rgb(211, 211, 211, 0.8)" : "",
    textAlign: windowWidth < 990 ? "center" : "",
    display: windowWidth > 990 ? 'none' : ''
  };

  const hideCollapse = () => {
    navCollapse.current.hide();
  };

  useEffect(() => {
    navCollapse.current = new Collapse("#navbarNav", {
      toggle: false,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('click', () => {
      hideCollapse();
    });
  }, []);
  useEffect(() => {
    const links = document.getElementsByClassName("nav-menu");
    for (let i = 0; i < links.length; i += 1) {
      if (links[i].className.includes("active")) {        
        setNavActive(true);
        break;
      } else {
        setNavActive(false);
      }
    }
  }, [location]);



  return (
    <div
      className=" sticky-top  "
      style={{
        backgroundColor: (navActive ? "lightgray" : "gray")
      }}
    >
      <nav
        className="navbar px-0 navbar-expand-lg navbar-light container"
        style={{
          height: "65px",
        }}
      >
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className="collapse navbar-collapse  custom-header-md-open"
          id="navbarNav"
          style={style}
        >
          <NavLink className="logo nav-link navbar-brand " to="/"
          >
            <img
              src={logo}
              alt="web-logo"
              style={{
                height: "120px",
              }}
            />
          </NavLink>
          <ul className="navbar-nav flex-grow-1">
            <li className="nav-item ">
              <NavLink
                className="homepage nav-link ps-0"
                to="/"
              >
                首頁
              </NavLink>
            </li>
            <li className="nav-item    ">
              <NavLink
                className="nav-link   ps-0 nav-menu"
                to="/products"
              >
                產品列表
              </NavLink>
            </li>
            <li className="nav-item  ">
              <NavLink
                className="nav-link  ps-0 nav-menu"
                to="/articles"
              >
                文章列表
              </NavLink>
            </li>
            <li className="nav-item  ">
              <NavLink
                className="nav-link  ps-0 nav-menu"
                to="/orderQuery"
              >
                訂單查詢
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="d-flex me-lg-5 justify-content-end ">
          <SearchBar />
          <NavLink to="./favoritesList" >
            <i className="bi bi-bookmark-star-fill ms-lg-5 ms-3 me-3  me-lg-5 "
              style={{
                fontSize: "25px",
                color:'white'
              }}
            />
          </NavLink>
          <NavLink to="/cart" className="nav-link position-relative me-lg-5 me-3"
            style={{
              marginRight: '0px'
            }}>
            <i
              className="bi bi-cart-fill "
              style={{
                fontSize: "25px",
                color:'white'
              }}
            />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartData?.carts?.length}
            </span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
