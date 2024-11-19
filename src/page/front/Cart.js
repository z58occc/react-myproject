import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Tooltip } from "bootstrap";
import Swal from "sweetalert2";
import { createAsyncMessage } from "../../slice/messageSlice";

function Cart() {
  const { cartData, getCart } = useOutletContext();
  const [loadingItems, setLoadingItem] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const removeBtnRef = useRef(null);
  const clearCartRef = useRef(null);
  const cartQuantityRef = useRef(null);
  const addBtnRef = useRef(null);
  const reduceBtnRef = useRef(null);
  const couponCodeRef = useRef(null);

  const handleCoupon = (e) => {
    const { value } = e.target;
    setCouponCode(value);
  };

  const sendCoupon = async () => {
    try {
      await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/coupon`, {
        data: {
          code: couponCode,
        },
      });
      getCart();
    } catch (error) {
      Swal.fire({
        title: "發生錯誤",
        html: "<small>無法使用優惠券，請查看折扣碼是否正確</small>",
        icon: "error",
      });
    }
  };
  const removeCoupon = async () => {
    try {
      await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/coupon`, {
        data: {
          code: 'return',
        },
      });
      couponCodeRef.current.value = '';
      getCart();
    } catch (error) {

    }
  };

  const checkCoupon = () => {
    if (couponCode === "") {
      Swal.fire({
        title: "發生錯誤",
        html: "<small>欄位不得為空 請依照需求填寫折扣碼</small>",
        icon: "error",
      });
      return;
    }
    sendCoupon();

  };

  const removeCartItem = async (id) => {
    try {
      removeBtnRef.current.setAttribute('disabled', '');
      await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`,
      );
      getCart();
    } catch (error) { }
  };
  const removeCartAll = async () => {
    try {
      clearCartRef.current.setAttribute('disabled', '');
      await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/carts`);
      getCart();
    } catch (error) { }
  };

  const updateCartItem = async (item, quantity) => {
    const data = {
      data: {
        product_id: item.product_id,
        qty: quantity,
      },
    };

    setLoadingItem([...loadingItems, item.id]);
    try {
      const res = await axios.put(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`,
        data,
      );
      dispatch(createAsyncMessage(res.data));
      getCart();
      setLoadingItem(
        loadingItems.filter((loadingObject) => loadingObject !== item.id),
      );
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
      setLoadingItem(
        loadingItems.filter((loadingObject) => loadingObject !== item.id),
      );
    }
  };
  const addFavorite = (item) => {
    const { product, id } = item;
    let alreadyExists = false;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    for (let index = 0; index < favorites.length; index++) {
      if (favorites[index].id === product.id) {
        alreadyExists = true;
        break;
      }
    }
    if (!alreadyExists) {
      favorites.push(product);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    removeCartItem(id);
  };

  const checkCart = () => {
    console.log(cartData.carts);
    
    if (!cartData.carts.every((item) => item.hasOwnProperty("coupon"))) {
      //   cartData有資料沒套用coupon
      if (cartData.carts.every((item) => !item.hasOwnProperty("coupon"))) {
        //   cartData全都沒套用coupon
        navigate("./checkout");
      } else {
        //  cartData中coupon未全部套用
        Swal.fire({
          title: "有商品還未使用優惠券喔！！",
          html: "<div><small>目前購物車內有符合條件之商品尚未使用優惠券</small></div> <div><small>若要使用優惠 請清空購物車後重新操作</small></div>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "繼續購物",
          confirmButtonText: "我要結帳",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("./checkout");
          }
        });
      }
    } else {
      //  cartData全都有套用coupon
      navigate("./checkout");
    }
  };
  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    const tooltipList = tooltipTriggerList.map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl),
    );
    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose());
    };
  });

  const adjustQty = async (item, boolean) => {
    if (boolean) {
      addBtnRef.current.setAttribute('disabled', '');
      cartQuantityRef.current.value++;
    } else {
      if (cartQuantityRef.current.value === '1') {
        return;
      }
      reduceBtnRef.current.setAttribute('disabled', '');
      cartQuantityRef.current.value--;
    }
    await updateCartItem(item, cartQuantityRef.current.value * 1);
    addBtnRef.current.removeAttribute('disabled');
    reduceBtnRef.current.removeAttribute('disabled');
  };


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div
          className="col-md-6 bg-white py-5 "
          style={{ minHeight: "calc(100vh - 56px - 76px)" }}
        >
          <div className="d-flex justify-content-between">
            <h2 className="mt-2"> 您的商品</h2>
          </div>

          {cartData?.carts?.length === 0 ||
            cartData?.carts?.length === undefined ? (
            <div className="text-center  mt-5">
              <h1>
                <i className="bi bi-emoji-surprise-fill me-3" />
                目前您的購物車沒有商品
              </h1>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-danger rounded"
                  onClick={removeCartAll}
                  ref={clearCartRef}
                >
                  清空購物車
                </button>
              </div>
              {cartData?.carts?.map((item) => (
                <div className="d-flex mt-4 bg-light" key={item.id}>
                  <div>
                    <Link to={`/product/${item.product.id}`}>
                      <img
                        className="object-cover"
                        src={item.product.imageUrl}
                        alt=""
                        style={{ width: "100px", height: "120px" }}
                      />
                    </Link>
                  </div>
                  <div className="w-100 p-3 position-relative ">
                    <button
                      type="button"
                      className="position-absolute btn"
                      style={{
                        top: "10px", right: "10px",
                      }}
                      onClick={() => {
                        removeCartItem(item.id);
                      }}
                      ref={removeBtnRef}


                    >
                      <i className="bi bi-x-circle-fill" />
                    </button>
                    <Link
                      to={`/product/${item.product.id}`}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      <span className="mb-0 fw-bold">{item.product.title}</span>
                    </Link>
                    <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                      {item.product.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="input-group mb-3 border mt-3">
                        <div className="input-group-prepend">
                          <button
                            className="btn btn-outline-dark rounded-0 border-0 py-3"
                            type="button"
                            id="button-addon1"
                            onClick={() => adjustQty(item, false)}
                            ref={reduceBtnRef}
                          >
                            <i className="bi bi-dash-circle" />
                          </button>
                        </div>
                        <input
                          value={item.qty}
                          readOnly
                          type="number"
                          className="form-control border-0 text-center my-auto shadow-none"
                          placeholder=""
                          aria-label="Example text with button addon"
                          aria-describedby="button-addon1"
                          ref={cartQuantityRef}

                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-dark rounded-0 border-0 py-3"
                            type="button"
                            id="button-addon2"
                            onClick={() => adjustQty(item, true)}
                            ref={addBtnRef}
                          >
                            <i className="bi bi-plus-circle" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p style={{ float: "right" }} className="mb-0 ms-auto mt-3">
                      NT$ {item?.total?.toLocaleString()}
                    </p>
                    <p
                      style={{
                        float: "left",
                        fontSize: "12px",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      className="mb-0 ms-auto mt-3 text-secondary"
                      onClick={() => addFavorite(item)}
                    >
                      放回下次再買
                    </p>
                  </div>
                </div>
              ))}
              <div
                className="  d-flex justify-content-end align-items-center mt-5"
                style={{
                  height: "30px",
                }}
              >
                <input
                  type="text"
                  className="form-control w-50 me-3 text-center
                                 rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none
                                "
                  placeholder="請輸入折扣碼"
                  onChange={(e) => handleCoupon(e)}
                  disabled={cartData.total !== cartData.final_total}
                  ref={couponCodeRef}
                />
                {/* 使用優惠券按鈕 */}
                <button
                  type="button"
                  className="btn btn-outline-primary
                                 border-top-0 border-start-0 border-end-0 border-bottom-0 rounded-0
                                "
                  onClick={checkCoupon}
                  disabled={cartData.total !== cartData.final_total}
                >
                  <i className="bi bi-ticket-perforated" style={{ fontSize: "20px" }} />
                </button>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary float-end mt-3"
                  data-bs-toggle="tooltip"
                  data-bs-html="true"
                  title="
                                <div>9折優惠券：discount90</div>
                                <div>8折優惠券：discount80</div>
                                <div>7折優惠券：discount70</div>
                            "
                >
                  查看折扣碼
                </button>
                <button type="button"
                className="btn btn-secondary float-end mt-3 ms-3"
                  onClick={removeCoupon}
                >
                  移除優惠券
                </button>
              </div>
            </>
          )}
          <div className="d-flex justify-content-between mt-7">
            <p className="mb-0 h4 fw-bold"> 總金額</p>
            <p className="mb-0 h4 fw-bold">
              NT$ {cartData?.final_total?.toLocaleString()}
              <span
                style={{
                  fontSize: "15px",
                }}
              >
                {cartData.total !== cartData.final_total
                  ? "（已使用優惠券）"
                  : ""}
              </span>
            </p>
          </div>
          <button
            type="button"
            className={`${cartData?.carts?.length === 0 ? "disabled" : ""} btn btn-dark w-100 mt-4 rounded-0 py-3`}
            onClick={checkCart}
          >
            填寫訂單
          </button>
        </div>
      </div>
    </div>
  );
}
export default Cart;