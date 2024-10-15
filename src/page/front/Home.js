import Carousel from "../../components/Carousel";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { Link, useNavigate, } from "react-router-dom";
import heroImage from '../../heroImage.webp'

function Home() {


    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchWord, setSearchWord] = useState('');
    const mySearch = useRef();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const randomNum = Math.floor(Math.random() * 6);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 950);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 950);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);





    const search = (e) => {
        setSearchWord(e.target.value);
    }


    const getArticles = async (page = 1) => {
        const articleRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/articles?page=${page}`);
        setArticles(articleRes.data.articles);
        setLoading(false);
    }



    const getProducts = async (page = 1) => {
        setLoading(true);
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`);
        setProducts(productRes.data.products);
    }
    const handleKeyEnter = (e) => {
        if (e.code == 'Enter') {
            navigate(`/products/${searchWord}`)
        }
    }
    useEffect(() => {
        getProducts(1);
        getArticles(1);
    }, [])
    return (
        <>

            <div className={`homepage-bg ${isMobile ? '' : 'container'}`}>
                <Loading isLoading={isLoading}></Loading>
                <div className="d-flex me-5 "
                    style={{
                        justifyContent: 'flex-end'
                    }}
                >

                </div>
                <div className="hero-image row flex-md-row-reverse flex-column m-5 mb-10">
                    <div className="col-md-8">
                        <img
                            src={heroImage} className="img-fluid object-cover"
                            style={{
                                height: '450px',
                            }}
                        />
                    </div>
                    <div className="col-md-4 d-flex flex-column justify-content-center mt-md-0 mt-3 ps-10">
                        <h5 className="font-weight-normal text-primary mt-2" >
                            這裡總有一款適合你的商品
                        </h5>
                        <div className=" mb-0 mt-3">
                            <div className="d-flex " role="search">
                                <input className="form-control w-50 me-2" type="search" placeholder="今天想來點..." aria-label="Search"
                                    onChange={search}
                                    ref={mySearch}
                                    onKeyUp={(e) => handleKeyEnter(e)}
                                />
                                <Link to={`/products/${searchWord}`} className={`btn btn-outline-primary flex-shrink-0
                                ${searchWord ? '' : 'disabled'}`} type="submit"
                                >搜尋
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row flex-md-row-reverse flex-column mt-5"
                    style={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Carousel products={products} ></Carousel>
                </div>
                <div className="row mt-10">
                    {products.slice(randomNum, randomNum + 4).map((product) => {
                        return (
                            <div className="col-md-6 mt-md-4" key={product.id}>
                                <div className="card border-0 mb-4 position-relative position-relative">
                                    <Link style={{ textDecoration: 'none' }} to={`./product/${product.id}`}>
                                        <img
                                            src={product.imageUrl}
                                            className="card-img-top rounded-0 object-cover"
                                            alt="..."
                                            style={{ height: "300px" }}
                                        />
                                        <div className="card-body p-0">
                                            <h4 className="mb-0 mt-4">{product.title}</h4>
                                            <div className="d-flex justify-content-between mt-3">
                                                <p className="product-description card-text text-muted mb-0 w-100">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}

                    <div className={isMobile ? '' : 'container'}>
                        <div className="row" >
                            {articles.slice(randomNum, randomNum + 3).map((article, i) => {
                                return (
                                    <div className="col-md-4" key={i}>
                                        <Link to={`/article/${article.id}`}>
                                            <img src={article.image} alt="" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                                        </Link>
                                        <Link to={`/article/${article.id}`}
                                            style={{
                                                textDecoration: 'none'
                                            }}>
                                            <h4 className="article-title mt-4">{article.title}</h4>
                                        </Link>
                                        <p className="home-article-description ">{article.description}</p>
                                    </div>
                                )
                            })}
                            <div className="bg-light mt-7">
                                <div className={isMobile ? '' : 'container'}>
                                    <div id="carouselExampleControls" data-ride="carousel">
                                        <div className="homepage-carousel carousel-inner">
                                            <div className="carousel-item active"
                                                style={{
                                                    backgroundImage: 'url("https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
                                                }}
                                            >
                                                <div className="row justify-content-center py-7 ">
                                                    <div className=" col-md-8 d-flex " >
                                                        <img src="https://images.unsplash.com/photo-1712847333437-f9386beb83e4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGh1bWFufGVufDB8fDB8fHww" alt="" className="rounded-circle me-5" style={{ width: "160px", height: "160px", objectFit: "cover", }} />
                                                        <div className="d-flex flex-column">
                                                            <p className="h5">“科技的真正目的，是讓我們的生活更簡單，而不是更複雜”</p>
                                                            <p className="mt-auto ">——喬納森·韋斯特 (Jonathan West)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>



                            <div className="container my-7">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-end">
                                            <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8Mg%3D%3D" alt="" style={{
                                                width: "48px", height: "48px", objectFit: " cover",
                                                borderRadius: '100%'
                                            }} />
                                            <small className="ms-2">
                                                <b>
                                                    王小明
                                                </b>
                                            </small>
                                        </div>
                                        <Link to='/product/-O3s3uJKoIC7mxJwGfbN'
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                            className="text-secondary"
                                        >
                                            <h4 className="mt-4">PS5</h4>
                                        </Link>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <p className="text-muted">PS5表現超棒，畫質細膩，遊戲體驗升級，強烈推薦！
                                        </p>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-end">
                                            <img src="https://images.unsplash.com/photo-1727294810303-b7be05458d1e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" style={{
                                                width: "48px", height: "48px", objectFit: " cover",
                                                borderRadius: '100%'
                                            }} />
                                            <small className="ms-2">
                                                <b>
                                                    李佳恩
                                                </b>
                                            </small>
                                        </div>
                                        <Link to='/product/-O3s2ve-xHIUe_IzlBjW'
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                            className="text-secondary"
                                        >
                                            <h4 className="mt-4">Nintendo Switch</h4>
                                        </Link>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <p className="text-muted">Switch遊戲多樣，適合全家一起玩，但Joy-Con靈敏度略有不足。
                                        </p>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-end">
                                            <img src="https://images.unsplash.com/photo-1727162334483-64741c31f45e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" style={{
                                                width: "48px", height: "48px", objectFit: " cover",
                                                borderRadius: '100%'
                                            }} />
                                            <small className="ms-2">
                                                <b>
                                                    張宇哲
                                                </b>
                                            </small>
                                        </div>
                                        <Link to='/product/-O3s5qG96KDTAETy0LKy'
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                            className="text-secondary"
                                        >
                                            <h4 className="mt-4">Steam Deck</h4>
                                        </Link>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <p className="text-muted">Steam Deck概念不錯，但性能不足，續航力需改進。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Home;