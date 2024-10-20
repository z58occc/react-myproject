import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from '../logo.png'
import { Collapse } from "bootstrap";

function Navbar({ cartData }) {

    const navCollapse = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // 監聽螢幕大小改變
        window.addEventListener('resize', handleResize);

        // 清除事件監聽器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const style = {
        backgroundColor: windowWidth < 990 ? "rgb(211, 211, 211, 0.8)" : '',
        textAlign: windowWidth < 990 ? 'center' : ''

    };

    const hideCollapse = () => {
        navCollapse.current.hide();
    }


    useEffect(() => {
        navCollapse.current = new Collapse('#navbarNav', {
            toggle: false
        });
    }, [])





    return (

        <div className=" sticky-top "
            style={{
                backgroundColor: 'lightcoral'
            }}
        >
            <nav className="navbar px-0 navbar-expand-lg navbar-light "
                style={{
                    height: '65px'
                }}
            >
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse  custom-header-md-open" id="navbarNav"
                    style={style}
                >
                    <NavLink
                        className="logo nav-link navbar-brand " to='/'
                    >
                        <img  src={logo} alt=""
                            style={{
                                height: '150px'
                            }}
                        />
                    </NavLink>
                    <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item ">
                            <NavLink className="homepage nav-link  ps-0" to="/"
                                onClick={hideCollapse}
                            >
                                首頁
                            </NavLink>
                        </li>
                        <li className="nav-item    ">
                            <NavLink className="nav-link   ps-0" to="/products"
                                onClick={hideCollapse}
                            >
                                產品列表
                            </NavLink>
                        </li>
                        <li className="nav-item  ">
                            <NavLink className="nav-link  ps-0" to="/articles"
                                onClick={hideCollapse}
                            >
                                文章列表
                            </NavLink>
                        </li>
                        <li className="nav-item  ">
                            <NavLink className="nav-link  ps-0" to="/orderQuery"
                                onClick={hideCollapse}
                            >
                                訂單查詢
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="d-flex me-5">
                    <NavLink to="/cart" className={'nav-link position-relative  me-5'}>
                        <i className="bi bi-cart-x-fill"
                            style={{
                                fontSize: '25px'
                            }}
                        ></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartData?.carts?.length}
                        </span>
                    </NavLink>
                    <Link
                        to='./nexttime'
                        className="  btn btn-primary    "
                    >
                        下次再買
                    </Link>
                </div>
            </nav>
        </div>
    )
}
export default Navbar;