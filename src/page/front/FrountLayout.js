import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import MessageToast from "../../components/MessageToast";

function FrountLayout() {
  const [cartData, setCartData] = useState({});
  const getCart = async () => {
    try {
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
      );
      setCartData(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      <Navbar cartData={cartData} />
      <MessageToast />
      <Outlet context={{ getCart, cartData }} />
      <div className="bg-dark">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between text-white py-4">
            <p className="mb-0">© 2024 LOGO All Rights Reserved.</p>
            <ul className="d-flex list-unstyled mb-0 h4">
              <li>
                <div className="text-white mx-3">
                  <i className="bi bi-facebook" />
                </div>
              </li>
              <li>
                <div className="text-white mx-3">
                  <i className="bi bi-instagram" />
                </div>
              </li>
              <li>
                <div className="text-white ms-3">
                  <i className="bi bi-line" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
export default FrountLayout;
