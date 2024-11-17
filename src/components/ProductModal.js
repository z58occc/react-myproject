import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../contexts/MessageContext";

function ProductModal({ closeProductModal, getProducts, type, tempProduct }) {
  //  取出token
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hextoken="))
    ?.split("=")[1];
  axios.defaults.headers.common["Authorization"] = token;

  const [tempData, setTempData] = useState({
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "",
    description: "",
    content: "",
    is_enabled: 1,
    imageUrl: "",
    imagesUrl: ["", "", "", "", ""],
  });

  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    if (type === "create") {
      setTempData({
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "個",
        description: "",
        content: "",
        is_enabled: 1,
        imageUrl: "",
        imagesUrl: ["", "", "", "", ""],
      });
    } else if (type === "edit") {
      setTempData(tempProduct);
    }
  }, [type, tempProduct]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (["price", "origin_price"].includes(name)) {
      setTempData({
        ...tempData,
        [name]: Number(value),
      });
    } else if (name === "is_enabled") {
      setTempData({
        ...tempData,
        [name]: +e.target.checked, // boolean
      });
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      });
    }
  };
  const hadleChangeImages = (e) => {
    const index = parseInt(e.target.name);
    setTempData({
      ...tempData,
      imagesUrl: tempData.imagesUrl.map((item, i) =>
        i === index ? e.target.value : item,
      ),
    });
  };

  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`;
      let method = "post";
      if (type === "edit") {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`;
        method = "put";
      }
      const res = await axios[method](api, {
        data: tempData,
      });
      handleSuccessMessage(dispatch, res);
      closeProductModal();
      getProducts();
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };
  const uploadFile = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
        formData,
        {
          headers: {
            authorization: token,
          },
        },
      );
      if (e.target.name === "imageUrl") {
        setTempData({
          ...tempData,
          [name]: res.data.imageUrl,
        });
      } else {
        const index = parseInt(e.target.name);
        setTempData({
          ...tempData,
          imagesUrl: tempData.imagesUrl.map((item, i) =>
            i === index ? res.data.imageUrl : item,
          ),
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="number"]');

    const handleWheel = (e) => {
      e.preventDefault();
    };

    inputs.forEach((input) => {
      // 為每個 input 添加非 passive 的事件監聽器
      input.addEventListener("wheel", handleWheel, { passive: false });
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("wheel", handleWheel);
      });
    };
  }, []);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="productModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === "create" ? "建立新商品" : `編輯`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeProductModal}
            />
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group mb-5">
                  <label className="w-100 " htmlFor="image">
                    輸入主圖網址
                    <input
                      type="text"
                      name="imageUrl"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </label>
                  <div className="form-group ">
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      name="imageUrl"
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                  {tempData.imageUrl && (
                    <img className="w-100" src={tempData.imageUrl} alt="..." />
                  )}
                </div>
                <div className="form-group mb-5">
                  <label className="w-100" htmlFor="image">
                    輸入圖片網址 1
                    <input
                      type="text"
                      name="0"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={hadleChangeImages}
                    />
                  </label>
                  <div className="form-group ">
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      name="0"
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                  {tempData.imagesUrl[0] && (
                    <img
                      className="w-100"
                      src={tempData.imagesUrl[0]}
                      alt="..."
                    />
                  )}
                </div>
                <div className="form-group mb-5">
                  <label className="w-100" htmlFor="image">
                    輸入圖片網址 2
                    <input
                      type="text"
                      name="1"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={hadleChangeImages}
                    />
                  </label>
                  <div className="form-group ">
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      name="1"
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                  {tempData.imagesUrl[1] && (
                    <img
                      className="w-100"
                      src={tempData.imagesUrl[1]}
                      alt="..."
                    />
                  )}
                </div>
                <div className="form-group mb-5">
                  <label className="w-100" htmlFor="image">
                    輸入圖片網址 3
                    <input
                      type="text"
                      name="2"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={hadleChangeImages}
                    />
                  </label>
                  <div className="form-group ">
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      name="2"
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                  {tempData.imagesUrl[2] && (
                    <img
                      className="w-100"
                      src={tempData.imagesUrl[2]}
                      alt="..."
                    />
                  )}
                </div>
                <div className="form-group mb-5">
                  <label className="w-100" htmlFor="image">
                    輸入圖片網址 4
                    <input
                      type="text"
                      name="3"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={hadleChangeImages}
                    />
                  </label>
                  <div className="form-group ">
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      name="3"
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                  {tempData.imagesUrl[3] && (
                    <img
                      className="w-100"
                      src={tempData.imagesUrl[3]}
                      alt="..."
                    />
                  )}
                </div>
                <div className="form-group mb-5">
                  <label className="w-100" htmlFor="image">
                    輸入圖片網址 5
                    <input
                      type="text"
                      name="4"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={hadleChangeImages}
                    />
                  </label>
                  <div className="form-group ">
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      name="4"
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                  {tempData.imagesUrl[4] && (
                    <img
                      className="w-100"
                      src={tempData.imagesUrl[4]}
                      alt="..."
                    />
                  )}
                </div>
              </div>
              <div className="col-sm-8">
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="title">
                    標題
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.title}
                    />
                  </label>
                </div>
                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="category">
                      分類
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        name="category"
                        onChange={handleChange}
                        value={tempData.category}
                      >
                        <option value="" disabled>
                          請選擇分類
                        </option>
                        <option value="apple">apple</option>
                        <option value="others">others</option>
                        <option value="gameConsole">gameConsole</option>
                        <option value="controller">controller</option>
                      </select>
                    </label>
                  </div>
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="unit">
                      單位
                      <input
                        type="unit"
                        id="unit"
                        name="unit"
                        placeholder="請輸入單位"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.unit}
                      />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="origin_price">
                      原價
                      <input
                        type="number"
                        id="origin_price"
                        name="origin_price"
                        placeholder="請輸入原價"
                        className="form-control noscroll"
                        onChange={handleChange}
                        value={tempData.origin_price}
                        // ref={inputRef}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="price">
                      售價
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="請輸入售價"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.price}
                      />
                    </label>
                  </div>
                </div>
                <hr />
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="description">
                    產品描述
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      placeholder="請輸入產品描述"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.description.trim()}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="content">
                    說明內容
                    <textarea
                      type="text"
                      id="content"
                      name="content"
                      placeholder="請輸入產品說明內容"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.content}
                      style={{ height: "300px" }}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <div className="form-check">
                    <label
                      className="w-100 form-check-label"
                      htmlFor="is_enabled"
                    >
                      是否啟用
                      <input
                        type="checkbox"
                        id="is_enabled"
                        name="is_enabled"
                        placeholder="請輸入產品說明內容"
                        className="form-check-input"
                        onChange={handleChange}
                        checked={!!tempData.is_enabled}
                      />
                    </label>
                  </div>
                </div>
                <div className="modal-footer mt-5">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeProductModal}
                  >
                    關閉
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submit}
                  >
                    儲存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductModal;
