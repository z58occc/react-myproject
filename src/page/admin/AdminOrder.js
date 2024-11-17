import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import moment from "moment";
import OrderModal from "../../components/OrderModal";
import Pagination from "../../components/Pagination";
import DeleteModal from "../../components/DeleteModal";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [tempOrder, setTempOrder] = useState({});
  const orderModal = useRef(null);
  const deleteModal = useRef(null);
  const [pagination, setPagination] = useState({});

  const getOrders = async (page = 1) => {
    const orderRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`,
    );
    setOrders(orderRes.data.orders);
    setPagination(orderRes.data.pagination);
  };

  useEffect(() => {
    orderModal.current = new Modal("#orderModal", {
      backdrop: "static",
    });

    deleteModal.current = new Modal("#deleteModal", {
      backdrop: "static",
    });

    getOrders();
  }, []);

  const openOrderModal = (order) => {
    orderModal.current.show();
    setTempOrder(order);
  };

  const closeOrderModal = () => {
    orderModal.current.hide();
  };

  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };

  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${id}`,
      );
      if (res.data.success) {
        getOrders();
        deleteModal.current.hide();
      }
    } catch (error) {}
  };

  return (
    <>
      <OrderModal
        orders={orders}
        closeOrderModal={closeOrderModal}
        tempOrder={tempOrder}
        getOrders={getOrders}
      />
      <DeleteModal
        close={closeDeleteModal}
        text={tempOrder.title}
        handleDelete={deleteOrder}
        id={tempOrder.id}
      />
      {/* Products */}
      <div className="p-3">
        <h3>訂單列表</h3>
        <hr />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">訂單id</th>
              <th scope="col">購買用戶</th>
              <th scope="col">訂單金額</th>
              <th scope="col">付款狀態</th>
              <th scope="col">付款日期</th>
              <th scope="col">留言</th>
              <th scope="col">編輯</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user.email}</td>
                <td>${order.total}</td>
                <td>
                  {order.is_paid ? (
                    <span className="text-success">付款完成</span>
                  ) : (
                    "未付款"
                  )}
                </td>
                <td>
                  {order.payment_date
                    ? moment.unix(order.payment_date).format("ll")
                    : ""}
                </td>
                <td
                  style={{
                    maxWidth: "300px",
                  }}
                >
                  {order.user.message}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openOrderModal(order)}
                  >
                    查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination pagination={pagination} changePage={getOrders} />
      </div>
      {/* Products end */}
    </>
  );
}

export default AdminOrders;
