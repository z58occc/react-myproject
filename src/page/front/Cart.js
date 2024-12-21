import axios from "axios";
import {  useRef, useState } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { Dropdown } from "bootstrap";
import { createAsyncMessage } from "../../slice/messageSlice";


function Cart() {
  const { cartData, getCart } = useOutletContext();
  const [loadingItems, setLoadingItem] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const removeBtnRef = useRef([]);
  const clearCartRef = useRef(null);
  const cartQuantityRef = useRef(null);
  const addBtnRef = useRef(null);
  const reduceBtnRef = useRef(null);
  const couponCodeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownListRef = useRef([]);

 
  const dropDownHide = () => {
    const dropdownElements = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownListRef.current = dropdownElements.map((dropdownToggleEl) =>
      new Dropdown(dropdownToggleEl)
    );
    dropdownListRef.current.forEach((dropdownInstance) => {
      dropdownInstance.hide();
    });
  };
  const chooseCoupon = async (e) => {
    const { id } = e.target;
    couponCodeRef.current.value = id;
    setIsLoading(true);
    dropDownHide();
    try {
      await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/coupon`, {
        data: {
          code: id,
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
    setIsLoading(false);

  };
  const removeCoupon = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/coupon`, {
        data: {
          code: 'return',
        },
      });
      couponCodeRef.current.value = '';
      getCart();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    }
    setIsLoading(false);
  };




  const removeCartItem = (id, state) => {
    setIsLoading(true);
    Swal.fire({
      title: `你確定要${state === "addFavorite" ? "放回收藏清單" : "刪除商品"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "再想想",
      confirmButtonText: "確定"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`,)
          .then(() => {
            getCart();
          })
          .catch((error) => {
            dispatch(createAsyncMessage(error.response.data));
          });
      }
      setIsLoading(false);
    });

  };
  const removeCartAll = () => {
    Swal.fire({
      title: "你確定要刪除全部商品?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "再想想",
      confirmButtonText: "確定"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/carts`,)
          .then(() => {
            getCart();
          })
          .catch((error) => {
            dispatch(createAsyncMessage(error.response.data));
          });
      }
    });
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
    let FavInList = false;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    for (let index = 0; index < favorites.length; index += 1) {
      if (favorites[index].id === product.id) {
        FavInList = true;
        break;
      }
    }
    if (!FavInList) {
      favorites.push(product);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    removeCartItem(id, 'addFavorite');
  };

  const checkCart = () => {

    if (!cartData.carts.every((item) => item.hasOwnProperty.call(item, "coupon"))) {
      //   cartData有資料沒套用coupon
      if (cartData.carts.every((item) => !item.hasOwnProperty.call(item, "coupon"))) {
        //   cartData全都沒套用coupon
        navigate("./checkout");
      } else {
        //  cartData中coupon未全部套用
        Swal.fire({
          title: "有商品還未使用優惠券喔！！",
          html: "<div><small>目前購物車內有符合條件之商品尚未使用優惠券</small></div> <div><small>若要使用優惠 請移除優惠券後重新操作</small></div>",
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


  const adjustQty = async (item, boolean) => {
    setIsLoading(true);
    if (boolean) {
      cartQuantityRef.current.value = Number(item.qty) + 1;
    } else {
      if (cartQuantityRef.current.value === '1') {
        return;
      }
      cartQuantityRef.current.value = Number(item.qty) - 1;
    }
    await updateCartItem(item, cartQuantityRef.current.value * 1);
    setIsLoading(false);
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
              {cartData?.carts?.map((item, i) => (
                <div className="d-flex mt-4 bg-light" key={item.id}>
                  <div>
                    <Link to={`/product/${item.product.id}`}>
                      <img
                        className="object-cover"
                        src={item.product.imageUrl}
                        alt={item.product.title}
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
                      ref={(el) => {
                        removeBtnRef.current[i] = el;
                        return removeBtnRef.current[i];
                      }}
                      disabled={isLoading}
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
                            disabled={isLoading}
                          >
                            <i className="bi bi-dash-circle" />
                          </button>
                        </div>
                        <input
                          value={item.qty}
                          readOnly
                          type="number"
                          className="form-control border-0 text-center my-auto shadow-none"
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
                            disabled={isLoading}
                          >
                            <i className="bi bi-plus-circle" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p style={{ float: "right" }} className="mb-0 ms-auto mt-3">
                      NT$ {item?.total?.toLocaleString()}
                    </p>
                    <button
                      style={{
                        background: 'none',       /* 去除背景 */
                        border: 'none',       /* 去除邊框 */
                        float: "left",
                        fontSize: "12px",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      type="button"
                      className="mb-0 ms-auto mt-3 text-secondary"
                      onClick={() => addFavorite(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addFavorite(item);
                        }
                      }}
                    >
                      放回收藏清單
                    </button>
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
                  className="form-control w-50  text-center
                                 rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none
                                 coupon-code
                                "
                  placeholder={`${cartData.carts[0]?.coupon?.code && cartData.carts[0]?.coupon?.code !== "return" ? cartData.carts[0]?.coupon?.code : ""}`}
                  disabled
                  ref={couponCodeRef}
                />
                
              </div>
              <div className="d-flex justify-content-end">
                <div className="block opacity-25"
                  style={{
                    position: 'absolute'

                  }}
                />
                <div className="dropdown float-end mt-3 choose-coupon">
                  <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                    disabled={cartData.total !== cartData.final_total || isLoading}
                    data-bs-auto-close="inside"
                  >
                    選取折扣碼
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1"
                  >
                    <li><button type="button" className="dropdown-item" id='discount90' onClick={(e) => chooseCoupon(e)}>9折優惠券：discount90</button></li>
                    <li><button type="button" className="dropdown-item" id='discount80' onClick={(e) => chooseCoupon(e)}>8折優惠券：discount80</button></li>
                    <li><button type="button" className="dropdown-item" id='discount70' onClick={(e) => chooseCoupon(e)}>7折優惠券：discount70</button></li>
                  </ul>
                </div>
                <button type="button"
                  className="btn btn-secondary float-end mt-3 ms-3"
                  onClick={() => {
                    removeCoupon();
                  }}
                  disabled={isLoading}
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
