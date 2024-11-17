import axios from "axios";
import { useContext, useEffect, useState } from "react";
import moment from "moment/moment";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../contexts/MessageContext";

function OrderModal({ closeOrderModal, getOrders, tempOrder }) {
  const [tempData, setTempData] = useState({
    create_at: 1523539519,
    id: "",
    is_paid: "",
    message: "",
    products: [
      {
        id: "",
        product_id: "",
        qty: "",
      },
    ],
    user: {
      address: "",
      email: "",
      name: "",
      tel: "",
    },
    num: 2,
  });
  useEffect(() => {
    setTempData(tempOrder);
  }, [tempOrder]);

  const [, dispatch] = useContext(MessageContext);

  const handleChange = (e) => {
    const { value, name, checked } = e.target;
    if (name === "is_paid") {
      if (checked) {
        setTempData({
          ...tempData,
          [name]: e.target.checked,
          payment_date: moment(new Date()).unix(),
        });
      } else {
        setTempData({
          ...tempData,
          [name]: e.target.checked,
          payment_date: "",
        });
      }
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      });
    }
  };

  const submit = async () => {
    try {
      const api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${tempOrder.id}`;
      const method = "put";

      const res = await axios[method](api, {
        data: tempData,
      });
      handleSuccessMessage(dispatch, res);
      getOrders();
      closeOrderModal();
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="orderModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {`查看 ${tempData?.id}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeOrderModal}
            />
          </div>
          <div className="modal-body">
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">Email</span>
              <div className="col-sm-10">
                <input
                  type="email"
                  readOnly
                  className="form-control-plaintext"
                  id="staticEmail"
                  defaultValue={tempData?.user?.email}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">訂購者</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="staticEmail"
                  defaultValue={tempData?.user?.name}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">外送地址</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempData?.user?.address}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">留言</span>
              <div className="col-sm-10">
                <textarea
                  name=""
                  id=""
                  cols="30"
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempData?.user?.message}
                />
              </div>
            </div>
            {tempData?.products && (
              <table className="table">
                <thead>
                  <tr>
                    <th>品項名稱</th>
                    <th>數量</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(tempData?.products).map((cart) => (
                    <tr key={cart?.id}>
                      <td>{cart?.product?.title}</td>
                      <td>{cart?.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-0 text-end">總金額</td>
                    <td className="border-0">${tempData?.total}</td>
                  </tr>
                </tfoot>
              </table>
            )}

            <div>
              <h5 className="mt-4">修改訂單狀態</h5>
              <div className="form-check mb-4">
                <label className="form-check-label" htmlFor="is_paid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_paid"
                    id="is_paid"
                    onChange={handleChange}
                    checked={!!tempData?.is_paid}
                  />
                  付款狀態 ({tempData?.is_paid ? "已付款" : "未付款"})
                </label>
              </div>
              <div className="mb-4">
                <span className="col-sm-2 col-form-label d-block">
                  外送進度
                </span>
                <select
                  className="form-select"
                  name="status"
                  onChange={handleChange}
                  value={tempData?.status || 0}
                >
                  <option value="未確認">未確認</option>
                  <option value="已確認">已確認</option>
                  <option value="外送中">外送中</option>
                  <option value="已送達">已送達</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeOrderModal}
            >
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderModal;
