import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Carousel from "../../components/Carousel";
import Loading from "../../components/Loading";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const randomNum = Math.floor(Math.random() * 6);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 950);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getProducts = async (page = 1) => {
      setLoading(true);
      const productRes = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`,
      );
      setProducts(productRes.data.products);
    };
    getProducts();
    const getArticles = async (page = 1) => {
      const articleRes = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/articles?page=${page}`,
      );
      setArticles(articleRes.data.articles);
      setLoading(false);
    };
    getArticles();
  }, []);
  return (
    <>
      <div className="homepage-bg  container">
        <Loading isLoading={isLoading} />
        <div
          className="d-flex me-5 "
          style={{
            justifyContent: "flex-end",
          }}
        />


        <div
          className="d-flex justify-content-center align-items-center flex-column mt-5 ">
          <Carousel products={products} />
        </div>

        <div className="row mt-10  ">
          {products.slice(randomNum, randomNum + 3).map((product) => (
            <div className="col-md-4 mt-md-4 " key={product.id} >
              <Link
                style={{ textDecoration: "none" }}
                to={`./product/${product.id}`}
              >
                <div className="card border-0 mb-4">
                  <img
                    src={product.imageUrl}
                    className="card-img-top rounded-0 object-cover"
                    alt="..."
                    style={{ height: "300px" }}

                  />
                  <div className="card-body p-0">
                    <div className="d-flex justify-content-between">
                      <h4 className=" text-primary ">{product.title}</h4>
                      <h3>${product.price.toLocaleString()}</h3>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <p className="product-description card-text text-muted mb-0 w-100">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

          ))}


          <div className="bg-light mt-7">
            <div className={isMobile ? "" : "container"}>
              <div id="carouselExampleControls" data-ride="carousel">
                <div className="homepage-carousel carousel-inner">
                  <div
                    className="carousel-item active"
                    style={{
                      backgroundImage:
                        'url("https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                    }}
                  >
                    <div className="row justify-content-center py-7 ">
                      <div className=" col-md-8 d-flex ">
                        <img
                          src="https://images.unsplash.com/photo-1712847333437-f9386beb83e4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGh1bWFufGVufDB8fDB8fHww"
                          alt=""
                          className="rounded-circle me-5"
                          style={{
                            width: "160px",
                            height: "160px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="d-flex flex-column">
                          <p className="h5">
                            “科技的真正目的，是讓我們的生活更簡單，而不是更複雜”
                          </p>
                          <p className="mt-auto ">
                            ——喬納森·韋斯特 (Jonathan West)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-7 ">
            <div>
              <div className="mb-3 pb-3 text-primary "
                style={{
                  borderBottom: 'solid orange ',
                  borderWidth: '5px',
                  fontSize: '25px'
                }}
              >
                <i className="bi bi-pencil"
                  style={{
                    fontSize: '36px'
                  }}
                />
                3C探索
              </div>
            </div>
            {articles.slice(randomNum, randomNum + 3).map((article) => (
              <div className="col-md-4" key={article.id}>
                <Link to={`/article/${article.id}`}>
                  <img
                    src={article.image}
                    alt=""
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </Link>
                <Link
                  to={`/article/${article.id}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <h4 className="article-title mt-4">{article.title}</h4>
                </Link>
                <p className="home-article-description ">
                  {article.description}
                </p>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-6 mt-md-4" >
              <div className="card border-0 mb-4 position-relative position-relative">
                <Link
                  style={{ textDecoration: "none" }}
                  to='/products?category=gameConsole '
                >
                  <img
                    src="https://images.unsplash.com/photo-1615750206996-69edef655324?q=80&w=2845&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="card-img-top rounded-0 object-cover"
                    alt="..."
                    style={{ height: "300px" }}
                  />
                  <div className="card-body p-0">
                    <h4 className="mb-0 mt-4">遊戲主機</h4>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-6 mt-md-4" >
              <div className="card border-0 mb-4 position-relative position-relative">
                <Link
                  style={{ textDecoration: "none" }}
                  to='/products?category=controller '
                >
                  <img
                    src="https://images.unsplash.com/photo-1659101967085-36dc2abaeca7?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="card-img-top rounded-0 object-cover"
                    alt="..."
                    style={{ height: "300px" }}
                  />
                  <div className="card-body p-0">
                    <h4 className="mb-0 mt-4">遊戲手把</h4>

                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-6 mt-md-4" >
              <div className="card border-0 mb-4 position-relative position-relative">
                <Link
                  style={{ textDecoration: "none" }}
                  to='/products?category=apple '
                >
                  <img
                    src="https://images.unsplash.com/photo-1685392485351-f7d93de2231e?q=80&w=2795&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="card-img-top rounded-0 object-cover"
                    alt="..."
                    style={{ height: "300px" }}
                  />
                  <div className="card-body p-0">
                    <h4 className="mb-0 mt-4">蘋果</h4>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-6 mt-md-4" >
              <div className="card border-0 mb-4 position-relative position-relative">
                <Link
                  style={{ textDecoration: "none" }}
                  to='/products?category=others'
                >
                  <img
                    src="https://images.unsplash.com/photo-1706169529392-8685eea83b98?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="card-img-top rounded-0 object-cover"
                    alt="..."
                    style={{ height: "300px" }}
                  />
                  <div className="card-body p-0">
                    <h4 className="mb-0 mt-4">其他</h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
