import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useOutletContext, useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import { createAsyncMessage } from "../../slice/messageSlice";
import SameTypeCarousel from "../../components/SameTypeCarousel";
import Loading from "../../components/Loading";

function ProdeuctDetail() {
  const [product, setProducts] = useState({});
  const [cartQuantity, setCartQuantity] = useState(1);
  const { id } = useParams();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const { getCart } = useOutletContext();
  const [inFavorites, setInFavorites] = useState(false);
  const dispatch = useDispatch();
  const [sameProducts, setSameProducts] = useState([]);
  const imgRef = useRef("");
  const [tempSrc, setTempSrc] = useState("");
  const [isLoading, setLoading] = useState(false);


  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const addToCart = async () => {
    const data = {
      data: {
        product_id: product.id,
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
  };
  const addFavorite = (product) => {
    const createTime = new Date();
    const momentTime = moment(createTime).unix();
    dispatch(
      createAsyncMessage({
        success: true,
        type: "success",
        title: "成功",
        message: "已加入收藏清單",
      }),
    );
    if (!inFavorites) {
      const favoriteItem = product;
      favoriteItem.create_at = momentTime;
      favorites.push(favoriteItem);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setInFavorites(true);
  };

  const changeImg = (e) => {
    const { src } = e.target;
    setTempSrc(src);
    imgRef.current.src = src;
  };
  const nextImg = () => {
    let index=product.imagesUrl.findIndex((imageUrl) => imageUrl === imgRef.current.src);
    if(index+1>4){
      index=-1;
    }    
    setTempSrc(product.imagesUrl[index+1]);
    imgRef.current.src=product.imagesUrl[index+1];
  };
  const lastImg = () => {
    let index=product.imagesUrl.findIndex((imageUrl) => imageUrl === imgRef.current.src);
    
    if(index===0){
      index=5;
    }
    setTempSrc(product.imagesUrl[index-1]);
    imgRef.current.src=product.imagesUrl[index-1];
  };



  useEffect(() => {
    const getProduct = async (id) => {
      setLoading(true);
      const productRes = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`,
      );
      setLoading(false);
      
      

      setProducts(productRes.data.product);
      setTempSrc(productRes.data.product.imagesUrl[0]);
      for (let index = 0; index < favorites.length; index++) {
        if (favorites[index].id === productRes.data.product.id) {
          setInFavorites(true);
          break;
        }
      }
      const productAllRes = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/products/all`,
      );
      const similarArr = productAllRes.data.products
        .filter((item) => item.category === productRes.data.product.category)
        .filter((item) => item.id !== productRes.data.product.id);

      setSameProducts(similarArr);
    };
    getProduct(id);
  }, [id, inFavorites]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container">
        <nav aria-label="breadcrumb"
          style={{
            marginTop: '40px'
          }}
        >
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link className="text-decoration-none" to="/">首頁</Link></li>
            <li className="breadcrumb-item "><Link className="text-decoration-none" to="/products">產品列表</Link></li>
            <li className="breadcrumb-item active " aria-current="page">產品詳細</li>
          </ol>
        </nav>
        <div className="row d-flex flex-row-reverse"
        >
          <div
            className=" col-md-4 d-flex flex-column"
            style={{
              textDecoration: "none",
              color: "black"
            }}
            to={`./product/${product?.id}`}
          >
            <div className="product-title">
              <h2 className=" mb-0 text-primary">{product.title}</h2>
              <h1 className="fw-bold text-primary">NT$ {product?.price?.toLocaleString()}</h1>
            </div>
            {/* <div className="product-img">
              <img
                alt="product.jpg"
                src={product?.imageUrl}
                className="img-fluid object-cover w-100 mb-5"
                style={{
                  height: "250px",
                }}
              />
            </div> */}
            <div className="add-to-cart">
              <p>{product.description}</p>
              <div className="input-group mb-3 border mt-3">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-outline-dark rounded-0 border-0 py-3"
                    type="button"
                    id="button-addon1"
                    onClick={() =>
                      setCartQuantity((pre) => (pre === 1 ? pre : pre - 1))
                    }
                  >
                    <i className="bi bi-dash-circle" />
                  </button>
                </div>
                <input
                  value={cartQuantity}
                  readOnly
                  type="number"
                  className="form-control border-0 text-center my-auto shadow-none"
                  placeholder=""
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-dark rounded-0 border-0 py-3"
                    type="button"
                    id="button-addon2"
                    onClick={() => setCartQuantity((pre) => pre + 1)}
                  >
                    <i className="bi bi-plus-circle" />
                  </button>
                </div>
              </div>
              <div
                className="d-flex justify-content-center mt-7 "
              >
                <button
                  type="button"
                  className="btn btn-primary   me-3"
                  onClick={() => addToCart()}
                  disabled={isLoadingCart}
                  style={{
                    borderRadius:'100px'
                  }}
                >
                  加入購物車
                </button>

                <button
                  type="button"
                  className="btn btn-secondary mt-1 "
                  onClick={() => addFavorite(product)}
                  style={{
                    borderRadius:'100px'
                  }}
                >
                  加入收藏清單
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="d-flex
            justify-content-center
            "
            >
              <i className="bi bi-caret-left-fill text-primary"
                style={{
                  marginTop:'220px',
                  fontSize: '60px',
                  cursor:'pointer'
                }}
                onClick={lastImg}
              />
              <img
                alt="product.jpg"
                src={product?.imagesUrl?.[0]}
                className=" object-cover "
                style={{
                  height: "500px",
                  minWidth: "750px"
                }}
                ref={imgRef}
              />
              <i className="bi bi-caret-right-fill text-primary"
                style={{
                  marginTop:'220px',
                  fontSize: '60px',
                  cursor:'pointer'
                }}
                onClick={nextImg}
              />
            </div>
            <div className="row g-1  ">
              {product?.imagesUrl?.map((img, i) => (
                <div className="col position-relative" key={i}>
                  <div
                    className={`${img !== tempSrc ? "opacity-0" : ""}
                                            triangle  position-absolute start-50 top-0 translate-middle`}
                  />
                  <img
                    src={`${img}`}
                    className={`${img === tempSrc ? "outline" : ""} w-100 mt-3 object-cover`}
                    alt="..."
                    style={{
                      height: "100px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => changeImg(e)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row justify-content-between mt-4 mb-7">
          <div className="col-md-7">
            <div className="accordion  mb-3" id="accordionExample">
              <div className="card border-0">
                <div
                  className="card-header py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0"
                  id="headingOne"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                >
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">商品說明</h4>
                    <i className="bi bi-dash" />
                  </div>
                </div>
                <div
                  id="collapseOne"
                  className="collapse show "
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample "
                >
                  <div
                    className="card-body pb-5 "
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {`${product.content}`}
                  </div>
                </div>

                <SameTypeCarousel sameProducts={sameProducts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProdeuctDetail;
