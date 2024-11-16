import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import CouponModal from "../../components/CouponModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";

function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [pagination, setPagination] = useState({});

    //  type:決定 modal 展開的用途
    const [type, setType] = useState('create');//   edit
    const [tempCoupon, setTempCoupon] = useState({});

    const couponModal = useRef(null);
    const deleteModal = useRef(null);


    const getCoupons = async (page = 1) => {
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`);
        setCoupons(res.data.coupons);
        setPagination(res.data.pagination);
    };

    useEffect(() => {
        couponModal.current = new Modal('#couponModal', {
            backdrop: 'static'
        });
        deleteModal.current = new Modal('#deleteModal', {
            backdrop: 'static'
        });

        getCoupons();

    }, []);

   
    const openCouponModal = (type, item) => {
        setType(type);
        setTempCoupon(item);
        couponModal.current.show();

    };
    const closeModal = () => {
        couponModal.current.hide();

    };
    const openDeleteModal = (product) => {
        setTempCoupon(product);
        deleteModal.current.show();

    };
    const closeDeleteModal = () => {
        deleteModal.current.hide();

    };
    const deleteCoupon = async (id) => {
        try {
            const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`);
            if (res.data.success) {
                getCoupons();
                deleteModal.current.hide();
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="p-3">
            <CouponModal
                closeModal={closeModal}
                getCoupons={getCoupons}
                tempCoupon={tempCoupon}
                type={type}
            />
            <DeleteModal
                close={closeDeleteModal}
                text={tempCoupon.title}
                handleDelete={deleteCoupon}
                id={tempCoupon.id}/>
            <h3>優惠卷列表</h3>
            <hr />
            <div className="text-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openCouponModal('create', {})}
                >
                    建立新優惠卷
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">標題</th>
                        <th scope="col">折扣</th>
                        <th scope="col">到期日</th>
                        <th scope="col">優惠碼</th>
                        <th scope="col">啟用狀態</th>
                        <th scope="col">編輯</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((product) => 
                         (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>{product.percent}</td>
                                <td>{new Date(product.due_date).toDateString()}</td>
                                <td>{product.code}</td>
                                <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={() => openCouponModal('edit', product)}>
                                        編輯
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm ms-2"
                                        onClick={() => openDeleteModal(product)}
                                    >
                                        刪除
                                    </button>
                                </td>
                            </tr>
                        )
                    )}

                </tbody>
            </table>

            <Pagination pagination={pagination}
                changePage={getCoupons}/>
        </div>
    );
}
export default AdminCoupons;