import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { Modal } from "bootstrap";
import QueryModal from "../../components/QueryModal";
import Swal from "sweetalert2";
import search from '../../search.webp'

function OrderQuery() {
    const [order, setOrder] = useState({});
    const inputRef = useRef('');
    const [isLoading, setLoading] = useState(false);
    const queryModal = useRef(null);
    const handleKeyEnter = (e) => {
        if (e.code == 'Enter') {
            getOrder(inputRef.current.value.trim())
        }
    }


    const getOrder = async (e,id) => {
        e.preventDefault();
        setLoading(true);
        const orderRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/order/${id}`);
        setOrder(orderRes.data.order);
        if (orderRes.data.order == null) {
            setLoading(false);
            Swal.fire({
                title: "發生錯誤",
                html: "<small>找不到資料，請確認訂單編號是否正確</small>",
                icon: "error"
            });
            return
        }
        queryModal.current.show();
        setLoading(false);
    }
    const closeQueryModal = () => {
        queryModal.current.hide();
    }
    useEffect(() => {
        queryModal.current = new Modal('#queryModal', {
            backdrop: 'static'
        })
    }, [])

    return (
        <div className="container vh-100 mt-5 ">
            <Loading isLoading={isLoading}></Loading>
            <QueryModal
                tempOrder={order || {}}
                closeOrderModal={closeQueryModal}
            ></QueryModal>
            <form className="row justify-content-center justify-content-sm-start "
                onSubmit={(e) => getOrder(e,inputRef.current.value.trim())}
            >
                <span className="col-auto"
                    style={{
                        fontSize: "25px"
                    }}>
                    請輸入你的訂單編號：
                </span>
                <input type="text" className="oreder-query-input col-auto col-form-control " ref={inputRef}
                    onKeyUp={(e) => handleKeyEnter(e)}
                    required
                />
                <div
                    className="col-auto d-flex justify-content-center"
                >
                    <button type="submit" className="order-query-button    btn btn-outline-primary">
                        查詢
                    </button>
                </div>
            </form>
            <div className=" text-center mt-5">
                <img src={search} alt=""
                    className="order-query-img "
                    style={{
                        borderRadius:'10%'
                    }}
                />
            </div>


        </div>
    )
}

export default OrderQuery