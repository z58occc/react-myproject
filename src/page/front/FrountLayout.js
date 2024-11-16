import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import MessageToast from '../../components/MessageToast';


function FrountLayout() {
    const [cartData, setCartData] = useState({});
    const getCart = async () => {

        try {
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,);
            setCartData(res.data.data);
        }
        catch (error) {
        }
    };



    useEffect(() => {
        getCart();
    }, []);

    return (
        <>
                <Navbar cartData={cartData}/>
                <MessageToast/>
                <Outlet  context={{ getCart, cartData }}/>
                <div className="bg-dark">
                    <div className="container">
                        <div className="d-flex align-items-center justify-content-between text-white py-4">
                            <p className="mb-0">© 2020 LOGO All Rights Reserved.</p>
                            <ul className="d-flex list-unstyled mb-0 h4">
                                <li><button type="button" className="text-white mx-3"><i className="bi bi-facebook"/></button></li>
                                <li><button type="button" className="text-white mx-3"><i className="bi bi-instagram"/></button></li>
                                <li><button type="button" className="text-white ms-3"><i className="bi bi-line"/></button></li>
                            </ul>
                        </div>
                    </div>
                </div>

        </>
    );
}
export default FrountLayout;