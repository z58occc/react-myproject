import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";

function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { searchWord } = useParams();
  const regex = new RegExp(searchWord, "i");
  const [searchRes, setSearchRes] = useState(true);
  const [reSearch, setReSearch] = useState("");
  const navigate = useNavigate();

  const mySearch = useRef();

  const search = (e) => {
    setReSearch(e.target.value);
  };

  
  const getProducts = async (page = 1) => {
    setSearchRes(true);
    setLoading(true);
    const productRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}  `,
    );

    setProducts(productRes.data.products);
    setPagination(productRes.data.pagination);
    setLoading(false);
  };

  const handleChangeType = async (e) => {
    setLoading(true);
    const { htmlFor } = e.target;
    const category = htmlFor;
    const typeRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/products?category=${category}`,
    );
    setProducts(typeRes.data.products);
    setPagination(typeRes.data.pagination);
    setLoading(false);
  };
  const handleKeyEnter = (e) => {
    if (e.code === "Enter") {
      navigate(`/products/${reSearch}`);
    }
  };

  useEffect(() => {
    if (searchWord) {
      const getProductsAll = async () => {
        setLoading(true);
        const productAllRes = await axios.get(
          `/v2/api/${process.env.REACT_APP_API_PATH}/products/all`,
        );
        const searchArr = productAllRes.data.products.filter((item) =>
          regex.test(item.title),
        );
        if (searchArr.length === 0) {
          setSearchRes(false);
        } else {
          setSearchRes(true);
        }
        setProducts(searchArr);
        setLoading(false);
      };
      getProductsAll();
    } else {
      getProducts();
    }
  }, [searchWord]);
  return (
    <div className="container mt-md-5 mt-3 mb-7"
      style={{
        minHeight: '100vh'
      }}
    >
      <Loading isLoading={isLoading} />
      <div
        className="btn-group mb-3"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio1"
          autoComplete="off"
          defaultChecked
        />
        <label
          className="btn btn-outline-primary"
          htmlFor="btnradio1"
          onClick={getProducts}
        >
          全部
        </label>
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="gameConsole"
          autoComplete="off"
        />
        <label
          className="btn btn-outline-primary"
          htmlFor="gameConsole"
          onClick={handleChangeType}
        >
          遊戲主機
        </label>
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="controller"
          autoComplete="off"
        />
        <label
          className="btn btn-outline-primary"
          htmlFor="controller"
          onClick={handleChangeType}
        >
          遊戲手把
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="apple"
          autoComplete="off"
        />
        <label
          className="btn btn-outline-primary"
          htmlFor="apple"
          onClick={handleChangeType}
        >
          蘋果
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="others"
          autoComplete="off"
        />
        <label
          className="btn btn-outline-primary"
          htmlFor="others"
          onClick={handleChangeType}
        >
          其他
        </label>
      </div>
      {!searchRes ? (
        <>
          <div
            className="text-center  mt-10  "
            style={{
              fontSize: "40px",
            }}
          >
            <i className="bi bi-emoji-surprise-fill me-3" />
            目前沒有符合搜尋的商品
          </div>
          <>
            <br />
            <div
              className="d-flex justify-content-center mb-10"
              role="search"
              style={{
                height: "40px",
              }}
            >
              <input
                className="form-control w-25 me-2"
                type="search"
                placeholder="重新搜尋？"
                aria-label="Search"
                onChange={search}
                ref={mySearch}
                onKeyUp={(e) => handleKeyEnter(e)}
              />
            </div>
          </>
        </>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-3">
              <div className="card border-0 mb-4 position-relative position-relative">
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/product/${product.id}`}
                >
                  <img
                    height={300}
                    src={product.imageUrl}
                    className="card-img-top rounded-0 object-cover"
                    alt="..."
                  />

                  <div className="d-flex justify-content-between card-body p-0">
                    <h3 className="mb-0 mt-2 ">{product.title}</h3>
                    <h5 className=" mb-0 mt-2 ">
                      ${product.price}
                    </h5>
                  </div>
                  <div className="text-black "
                  >{product.description}</div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <nav className="d-flex justify-content-center">
        <Pagination pagination={pagination} changePage={getProducts} />
      </nav>
    </div>
  );
}
export default Products;
