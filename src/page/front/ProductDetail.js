import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import { createAsyncMessage } from "../../slice/messageSlice";
import SameTypeCarousel from "../../components/SameTypeCarousel";




function ProdeuctDetail() {
    const [product, setProducts] = useState({});
    const [cartQuantity, setCartQuantity] = useState(1);
    const { id } = useParams();
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const { getCart } = useOutletContext();
    const [alreadyExists, setAlreadyExists] = useState(false);
    const dispatch = useDispatch();
    const [sameProducts, setSameProducts] = useState([]);
    const imgRef = useRef('');
    const [tempSrc, setTempSrc] = useState('');


    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const getProduct = async (id) => {
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
        setProducts(productRes.data.product);
        setTempSrc(productRes.data.product.imagesUrl[0]);
        for (let index = 0; index < favorites.length; index++) {
            if (favorites[index].id === productRes.data.product.id) {
                setAlreadyExists(true);
                break;
            }
        }
        const productAllRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        const similarArr = productAllRes.data.products
            .filter((item) => item.category === productRes.data.product.category)
            .filter((item) => item.id !== productRes.data.product.id);

        setSameProducts(similarArr);
    };

    const addToCart = async () => {
        const data = {
            data: {
                product_id: product.id,
                qty: cartQuantity,
            }
        };
        setIsLoadingCart(true);
        try {
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
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
        dispatch(createAsyncMessage({
            success: true,
            type: 'success',
            title: "成功",
            message: '已加入下次再買清單'
        }));
        if (!alreadyExists) {
            const favoriteItem=product;
            favoriteItem.create_at = momentTime;
            favorites.push(favoriteItem);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setAlreadyExists(true);
    };

    const changeImg = (e) => {
        const { src } = e.target;
        setTempSrc(src);
        imgRef.current.src = src;

    };



    useEffect(() => {
        getProduct(id);
    }, [id, alreadyExists]);



    return (
        <>
            <div className="container">
                <div className="row d-flex flex-row-reverse   m-1 ">
                    <div
                        className=" col-md-4 d-flex flex-column"
                        style={{
                            textDecoration: 'none',
                            color: 'black',
                        }}
                        to={`./product/${product?.id}`}
                    >
                        <div className="product-title">
                            <h2 className=" mb-0">{product.title}</h2>
                            <p className="fw-bold">NT$ {product.price}</p>
                        </div>
                        <div className="product-img">
                            <img alt="product.jpg"
                                src={product?.imageUrl} className="img-fluid object-cover w-100 mb-5"
                                style={{
                                    height: '250px'
                                }}
                            />


                        </div>
                        <div className="add-to-cart">
                            <p>{product.description}</p>
                            <div className="input-group mb-3 border mt-3">
                                <div className="input-group-prepend">
                                    <button className="btn btn-outline-dark rounded-0 border-0 py-3" type="button" id="button-addon1"
                                        onClick={() => setCartQuantity((pre) => pre === 1 ? pre : pre - 1)}
                                    >
                                        <i className="bi bi-dash-circle"/>
                                    </button>
                                </div>
                                <input
                                    value={cartQuantity}
                                    readOnly
                                    type="number" className="form-control border-0 text-center my-auto shadow-none" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-dark rounded-0 border-0 py-3" type="button" id="button-addon2"
                                        onClick={() => setCartQuantity((pre) => pre + 1)}
                                    >
                                        <i className="bi bi-plus-circle"/>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex  flex-column"
                                style={{
                                    justifyItems: 'center',
                                    alignItems: 'center'
                                }}>
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 rounded-0 py-3"
                                    onClick={() => addToCart()}
                                    disabled={isLoadingCart}
                                    style={{
                                        fontSize: "25px"
                                    }}
                                >
                                    加入購物車
                                </button>

                                <button type="button"
                                    className='btn btn-secondary mt-1 p-3'
                                    onClick={() => addFavorite(product)}
                                    style={{
                                        fontSize: '15px',
                                    }}
                                >
                                    加入下次再買清單
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-8" >
                        <div className="row">
                            <img alt="product.jpg"
                                src={product?.imagesUrl?.[0]} className="img-fluid object-cover "
                                style={{
                                    height: '500px',
                                }}
                                ref={imgRef}
                            />
                        </div>
                        <div className="row g-1  ">
                            {product?.imagesUrl?.map((img, i) => 
                                 (
                                    <div className="col position-relative" key={i}>
                                        <div className={`${img !== tempSrc
                                            ?
                                            'opacity-0'
                                            :
                                            ''
                                            }
                                            triangle  position-absolute start-50 top-0 translate-middle`}
                                        />
                                        <img src={`${img}`} className={`${img === tempSrc ? "outline" : ""} w-100 mt-3 object-cover`}
                                            alt="..."
                                            style={{
                                                height: '100px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={(e) => changeImg(e)}
                                        />
                                    </div>
                                )
                            )}
                        </div>


                    </div>
                </div>
                <div className="row justify-content-between mt-4 mb-7">
                    <div className="col-md-7">
                        <div className="accordion  mb-3" id="accordionExample">
                            <div className="card border-0">
                                <div className="card-header py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0" id="headingOne" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                                    <div className="d-flex justify-content-between align-items-center pe-1">
                                        <h4 className="mb-0">
                                            商品說明
                                        </h4>
                                        <i className="bi bi-dash"/>
                                    </div>
                                </div>
                                <div id="collapseOne" className="collapse show " aria-labelledby="headingOne" data-bs-parent="#accordionExample ">
                                    <div className="card-body pb-5 "
                                        style={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {`${product.content}`}

                                    </div>

                                </div>

                                <SameTypeCarousel
                                    sameProducts={sameProducts}
                                />
                            </div>


                        </div>
                    </div>
                </div>

            </div >
        </>
    );
}
export default ProdeuctDetail;