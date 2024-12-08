import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import QueryModal from "../../components/QueryModal";
import search from "../../assets/images/search.webp";

function OrderQuery() {
  const [order, setOrder] = useState({});
  const inputRef = useRef("");
  const [isLoading, setLoading] = useState(false);
  const queryModal = useRef(null);

  const getOrder = async (id) => {
    setLoading(true);
    if(isLoading){
      return;
    }
    const orderRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/order/${id}`,
    );
    setOrder(orderRes.data.order);
    if (orderRes.data.order == null) {
      setLoading(false);
      Swal.fire({
        title: "發生錯誤",
        html: "<small>找不到資料，請確認訂單編號是否正確</small>",
        icon: "error",
      });
      return;
    }
    queryModal.current.show();
    setLoading(false);
  };
  const handleKeyEnter = (e) => {
    if (inputRef.current.value === "") {
      return;
    }
    if (e.code === "Enter") {
      getOrder(inputRef.current.value.trim());
    }
  };
  const closeQueryModal = () => {
    queryModal.current.hide();
  };
  useEffect(() => {
    queryModal.current = new Modal("#queryModal", {
      backdrop: "static",
    });
  }, []);

  return (
    <div className="container vh-100 mt-5 ">
      <Loading isLoading={isLoading} />
      <QueryModal tempOrder={order || {}} closeOrderModal={closeQueryModal} />
      <form
        className="row justify-content-center justify-content-sm-start "
        onSubmit={(e) => getOrder(e, inputRef.current.value.trim())}
      >
        <span
          className="col-auto"
          style={{
            fontSize: "25px",
          }}
        >
          請輸入你的訂單編號：
        </span>
        <input
          type="text"
          className="oreder-query-input col-auto col-form-control "
          ref={inputRef}
          onKeyUp={(e) => handleKeyEnter(e)}
          required
        />
        <div className="col-auto d-flex justify-content-center">
          <button
            type="submit"
            className="order-query-button    btn btn-outline-primary"
          >
            查詢
          </button>
        </div>
      </form>
      <div className=" text-center mt-5">
        <img
          src={search}
          alt="There is a question mark on a person's head"
          className="order-query-img "
          style={{
            borderRadius: "10%",
          }}
        />
      </div>
    </div>
  );
}

export default OrderQuery;
