import { Link } from "react-router-dom";
import { useRef } from "react";

function Carousel({ products }) {
  const imgRef = useRef(null);
  const otherImgRef = useRef([]);
  const oldImg = imgRef?.current?.src;
  const otherOldImg = otherImgRef?.current?.map((img) => img.src);

  const changeImg = (e) => {
    const { src, name } = e.target;
    if (name) {
      for (let index = 0; index < otherImgRef.current.length; index++) {
        if (otherImgRef.current[index].id === name) {
          otherImgRef.current[index].src = src;
        }
      }
    } else {
      imgRef.current.src = src;
    }
  };
  const oriImg = (e) => {
    //   滑鼠離開後 把原本的圖換回來
    const { name } = e.target;
    if (name) {
      for (let index = 0; index < otherImgRef.current.length; index++) {
        if (otherImgRef.current[index].id === name) {
          otherImgRef.current[index].src = otherOldImg[index];
        }
      }
    } else {
      imgRef.current.src = oldImg;
    }
  };

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide product-carousel "
      style={{
        position: "relative",
      }}
    >
      <div
        className="carousel-indicators "
        style={{
          position: "absolute",
          bottom: "-50px",
          /* 根據需要調整 */
          zIndex: "100",
        }}
      >
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        />

        {products?.slice(1, products.length).map((_, i) => (
          <button
            key={i + 1}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={i + 1}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div
        className="carousel-inner container"
        style={{
          maxWidth: "1100px",
        }}
      >
        {/* 第一頁 */}
        <div className="carousel-item active">
          <div className="row g-0">
            <div className="col-8">
              <Link to={`./product/${products[0]?.id}`}>
                <img
                  ref={imgRef}
                  src={products[0]?.imageUrl}
                  className="object-cover d-block "
                  alt="..."
                  style={{
                    width: '750px'
                  }}
                />
              </Link>
            </div>
            <div className="col-4  bg-primary ">
              <div className="m-3">
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "40px",
                  }}
                  to={`./product/${products[0]?.id}`}
                >
                  {products[0]?.title}
                </Link>
              </div>
              <div className="row m-1">
                {products[0]?.imagesUrl?.slice(0, 4).map((img, i) => (
                  <div className="col-6 g-3  " key={i}>
                    <img
                      src={img}
                      alt=""
                      style={{
                        height: "100px",
                        width: "100%",
                      }}
                      className="object-cover"
                      onMouseOver={(e) => changeImg(e)}
                      onMouseOut={(e) => oriImg(e)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-7  w-100 " style={{
                paddingLeft: '10px',
                textAlign: "start",
                fontSize: "25px",
                fontWeight: '800'
              }}>
                NT$ {products[0]?.price}
              </div>
            </div>
          </div>
        </div>

        {/* 其他頁 */}
        {products?.slice(1, products.length).map((product, i) => (
          <div className="carousel-item " key={product?.id}>
            <div className="row g-0">
              <div className="col-8">
                <Link to={`./product/${product?.id}`}>
                  <img
                    src={product.imageUrl}
                    className="object-cover d-block "
                    alt="..."
                    ref={(e) => {
                      otherImgRef.current[i] = e;
                      return otherImgRef.current[i];
                    }}
                    id={product?.id}
                    style={{
                      width: '750px'
                    }}
                  />
                </Link>
              </div>
              <div className="col-4" style={{ backgroundColor: "orange" }}>
                <div className="m-3">
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                      fontSize: "40px",
                    }}
                    to={`./product/${product?.id}`}
                  >
                    {product.title}
                  </Link>
                </div>

                <div className="row m-1">
                  {product?.imagesUrl?.slice(0, 4).map((img, i) => (
                    <div className="col-6 g-3    " key={i}>
                      <img
                        src={img}
                        alt=""
                        style={{
                          height: "100px",
                          width: "100%",
                        }}
                        className="object-cover"
                        name={product.id}
                        onMouseOver={(e) => changeImg(e)}
                        onMouseOut={(e) => oriImg(e)}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-7  w-100 " style={{
                  paddingLeft: '10px',
                  textAlign: "start",
                  fontSize: "25px",
                  fontWeight: '800'
                }}>
                  NT$ {product.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
