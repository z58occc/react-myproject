import { Link } from "react-router-dom";

function SameTypeCarousel({ sameProducts }) {
  return (
    <div
      id="carouselExampleIndicators"
      className=" carousel slide position-relative mt-5"
    >

      <div className="carousel-inner">
        <div className="text-primary mb-1 ">
          <b>你可能會有興趣的同類商品</b>
        </div>
        <div className="carousel-item active">
          <div
            className="row border border-bottom-0 border-top border-start-0 border-end-0"
          >
            {sameProducts?.slice(0, 4).map((product) => (
              <div key={product.id} className="col-md-3 mt-3">
                <div className="card border-0 mb-4  position-relative position-relative">
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/product/${product.id}`}
                  >
                    <img
                      style={{ height: "150px" }}
                      src={product.imageUrl}
                      className="card-img-top rounded-0 object-cover"
                      alt="..."
                    />

                    <div className="card-body p-0">
                      <h4 className="mb-0 mt-2 text-center">{product.title}</h4>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {sameProducts?.slice(4, 8).length > 0 ? (
          <div className="carousel-item">
            <div
              className="row
                        border border-bottom-0 border-top border-start-0 border-end-0"
            >
              {sameProducts?.slice(4, 8).map((product) => (
                <div key={product.id} className="col-md-3 mt-3">
                  <div className="card border-0 mb-4  position-relative position-relative">
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/product/${product.id}`}
                    >
                      <img
                        style={{ height: "150px" }}
                        src={product.imageUrl}
                        className="card-img-top rounded-0 object-cover"
                        alt="..."
                      />

                      <div className="card-body p-0">
                        <h4 className="mb-0 mt-2 text-center">
                          {product.title}
                        </h4>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
        style={{
          bottom: "45px",
          left: "-35px",
        }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
        style={{
          bottom: "45px",
          right: "-35px",
        }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default SameTypeCarousel;
