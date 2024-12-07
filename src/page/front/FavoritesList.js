import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useOutletContext, Link } from "react-router-dom";
import { Modal } from "bootstrap";
import { createAsyncMessage } from "../../slice/messageSlice";
import FilterModal from "../../components/FilterModal";

function FavoritesList() {
  const [myFavorites, setMyFavorites] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const cartQuantity = 1;
  const dispatch = useDispatch();
  const { getCart } = useOutletContext();
  const checked = useRef([]);
  const allChoose = useRef();
  const [disabled, setDisabled] = useState(false);
  const filterModal = useRef(null);

  const addToCart = async (myFavorite, all = false) => {
    const data = {
      data: {
        product_id: myFavorite.id,
        qty: cartQuantity,
      },
    };
    setIsLoadingCart(true);
    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
        data,
      );
      dispatch(createAsyncMessage(res.data));
      getCart();
      setIsLoadingCart(false);
    } catch (error) {
      setIsLoadingCart(false);
      dispatch(createAsyncMessage(error.response.data));
    }
    //  觸發addToCartAll時 避免更動myFavorites陣列 造成myFavorites跟checked.current的index會對不上
    if (!all) {
      const remain = myFavorites.filter((item) => item.id !== myFavorite.id);
      setMyFavorites(remain);
      localStorage.setItem("favorites", JSON.stringify(remain));
    }
  };

  const addToCartAll = async () => {
    const tasks = [];
    for (let index = checked.current.length - 1; index >= 0; index-=1) {
      if (checked?.current[index]?.checked) {
        tasks.push(addToCart(myFavorites[index], true));
      }
    }
    await Promise.all(tasks);
    const remain = myFavorites.filter(
      (_, index) => !checked?.current[index]?.checked,
    );
    setMyFavorites(remain);
    localStorage.setItem("favorites", JSON.stringify(remain));
  };

  const deleteFavoriteAll = () => {
    const remain = myFavorites.filter(
      (_, index) => !checked?.current[index]?.checked,
    );
    localStorage.setItem("favorites", JSON.stringify(remain));
    if (remain.length === 0) {
      localStorage.clear();
    }
    setMyFavorites(remain);
  };

  const deleteFavorite = (id) => {
    const filterFavorites = myFavorites.filter((item) => item.id !== id);
    localStorage.setItem("favorites", JSON.stringify(filterFavorites));
    if (filterFavorites.length === 0) {
      localStorage.clear();
    }
    setMyFavorites(filterFavorites);
  };
  const hadleChange = (e) => {
    setDisabled(allChoose.current.checked);
    if (e.target.checked) {
      for (let index = 0; index < checked.current.length; index+=1) {
        checked.current[index].checked = true;
      }
    } else {
      for (let index = 0; index < checked.current.length; index+=1) {
        checked.current[index].checked = false;
      }
    }
  };

  const handleDisabled = () => {
    if (checked.current.some((item) => item.checked)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  let sortFavorites;
  const handleSort = (e) => {
    const { value } = e.target;
    switch (value) {
      case "1":
        sortFavorites = [...myFavorites].sort(
          (a, b) => a.create_at - b.create_at,
        );
        break;
      case "2":
        sortFavorites = [...myFavorites].sort(
          (a, b) => b.create_at - a.create_at,
        );
        break;
      case "3":
        sortFavorites = [...myFavorites].sort((a, b) => a.price - b.price);
        break;
      case "4":
        sortFavorites = [...myFavorites].sort((a, b) => b.price - a.price);
        break;

      default:
        break;
    }
    setMyFavorites(sortFavorites);
  };
  const openFilterModal = () => {
    filterModal.current.show();
  };
  const closeFilterModal = () => {
    filterModal.current.hide();
  };

  useEffect(() => {
    filterModal.current = new Modal("#filterModal");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    sortFavorites = [...favorites].sort((a, b) => a.create_at - b.create_at);
    setMyFavorites(sortFavorites);    
  }, []);

  return (
    <div className="container  min-vh-100">
      <FilterModal
        closeFilterModal={closeFilterModal}
        setMyFavorites={setMyFavorites}
        myFavorites={myFavorites}
      />
      <div className=" mt-5">
        <div className="mb-3 text-primary"
        style={{
          fontSize:'25px'
        }}
        >收藏清單</div>
        <div className="d-flex   justify-content-sm-between flex-sm-row flex-column">
          <div className="favorite-all-choose">
            <span>
              <input
                type="checkbox"
                onChange={hadleChange}
                className="ms-2 "
                id="all"
                ref={allChoose}
                style={{
                  transform:"scale(2)"
                }}
              />
              <label htmlFor="all" className="me-5 ms-3">
                全選
              </label>
            </span>
            <span
              style={{
                display: "inline-block",
                width: "100px",
                cursor: `${disabled ? "" : "not-allowed"}`,
              }}
              className="me-5 "
            >
              <button
                type="button"
                className={`btn   p-0 w-100 rounded ${disabled ? "" : "disabled"}`}
                onClick={addToCartAll}
                style={{
                  backgroundColor: "lightgray",
                  fontSize: "15px",
                }}
              >
                <i className="bi bi-cart4" />
                放入購物車
              </button>
            </span>
            <span
              style={{
                cursor: `${disabled ? "pointer" : "not-allowed"}`,
                display: "inline-block",
                width: "80px",
              }}
            >
              <button
                type="button"
                className={`btn   p-0 w-100 rounded ${disabled ? "" : "disabled"} `}
                onClick={deleteFavoriteAll}
                style={{
                  cursor: "pointer",
                  backgroundColor: "lightgray",
                  fontSize: "15px",
                  padding: "5px",
                }}
              >
                <i className="bi bi-trash" />
                刪除商品
              </button>
            </span>
          </div>
          <div className="d-flex  nexttime-right">
            <select
              className="form-select  me-7 "
              aria-label="Default select example"
              onChange={(e) => handleSort(e)}
              style={{
                width: "200px",
                fontSize: "15px",
              }}
            >
              <option value="1" className="dropdown-item">
                加入時間（先⭢後）
              </option>
              <option value="2" className="dropdown-item">
                加入時間（後⭢先）
              </option>
              <option value="3" className="dropdown-item">
                價格（低⭢高）
              </option>
              <option value="4" className="dropdown-item">
                價格（高⭢低）
              </option>
            </select>
            <button
              type="button"
              className="mybtn btn "
              onClick={openFilterModal}
              style={{
                cursor: "pointer",
              }}
            >
              <i className="bi bi-filter" />
              篩選
            </button>
          </div>
        </div>

        {localStorage.getItem("favorites") == null ? (
          <div
            className="text-center   "
            style={{
              fontSize: "60px",
              marginTop: "200px",
              marginBottom: "300px",
            }}
          >
            <i className="bi bi-emoji-surprise-fill me-3" />
            目前收藏清單沒有商品
          </div>
        ) : (
          <div className="table-responsive mt-5">
            <table
              className="table "
              style={{
                marginBottom: "300px",
              }}
            >
              <thead>
                <tr className="table-secondary ">
                  <th className="col favorite-th" />
                  <th className="col favorite-th" />
                  <th className="col text-center">商品明細</th>
                  <th className="col " />
                  <th className="col text-center">變更</th>
                </tr>
              </thead>
              <tbody>
                {myFavorites?.map((myFavorite, i) => (
                  <tr key={myFavorite.id}>
                    <th className="favorite-checkbox " scope="row">
                      <input
                        type="checkbox"
                        ref={(e) => {
                          checked.current[i] = e;
                          return checked.current[i];
                        }}
                        onChange={handleDisabled}
                        style={{
                          transform:"scale(2)",
                          marginTop:'45px'
                        }}
                      />
                    </th>
                    <td className="favorite-img">
                      <Link to={`/product/${myFavorite.id}`}>
                        <img
                          src={myFavorite.imageUrl}
                          alt={myFavorite.title}
                          style={{
                            height: "100px",
                            width: "100px",
                          }}
                          className="object-cover"
                        />
                      </Link>
                    </td>
                    <td>
                      <div>
                        <Link
                          to={`/product/${myFavorite.id}`}
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          <h4>{myFavorite.title}</h4>
                        </Link>
                      </div>
                      <div className="favorite-description">
                        <small>{myFavorite.description}</small>
                      </div>
                    </td>
                    <td 
                    style={{
                      height:'116px'
                    }}
                    >
                      <div  className="d-flex  align-items-center"
                        style={{
                          width: "100px",
                          height:'100%'
                        }}
                      >
                        NT$ {myFavorite.price}
                      </div>
                    </td>
                    <td>
                      <div className="d-sm-flex   mt-0 mt-md-3 ">
                        
                        <button
                          type="button"
                          className="nexttime-button w-50 btn btn-secondary  "
                          onClick={() => deleteFavorite(myFavorite.id)}
                        >
                          刪除商品
                        </button>
                        <button
                          type="button"
                          href="./checkout.html"
                          className="nexttime-button w-50 btn btn-primary ms-3"
                          onClick={() => addToCart(myFavorite)}
                          disabled={isLoadingCart}
                        >
                          加入購物車
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesList;
