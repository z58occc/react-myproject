import {  useEffect, useState } from "react";
import moment from "moment/moment";

function QueryModal({ closeOrderModal, tempOrder }) {
    const [progress, setProgress] = useState(0);
    const [tempData, setTempData] = useState({
        create_at: "",
        id: "",
        is_paid: "",
        message: "",
        products: [
            {
                id: "",
                product_id: "",
                qty: ""

            },
        ],
        user: {
            address: "",
            email: "",
            name: "",
            tel: ""
        },
        num: 2

    });
    useEffect(() => {
        setTempData({
            ...tempOrder,
            create_at: moment.unix(tempOrder?.create_at).format('ll')
        });
        const { status } = tempOrder;
        switch (status) {
            case "未確認":
                setProgress(0);
                break;
            case "已確認":
                setProgress(33);
                break;
            case "外送中":
                setProgress(66);
                break;
            case "已送達":
                setProgress(99);
                break;

            default:
                break;
        }
    }, [tempOrder]);


    return (
        <div
            className='modal fade'
            tabIndex='-1'
            id='queryModal'
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'
        >
            <div className='modal-dialog modal-lg'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h1 className='modal-title fs-5' id='exampleModalLabel'>
                            {`查看 ${tempData?.id}`}
                        </h1>
                        <button
                            type='button'
                            className='btn-close'
                            aria-label='Close'
                            onClick={closeOrderModal}
                        />
                    </div>

                    <div className='modal-body'>
                        <div>
                            配送進度：{tempData?.status}
                        </div>
                        <table className="table mt-3 mb-0 table-bordered border-primary small-table"
                            style={{
                                tableLayout: 'fixed',
                                fontSize: '13px'
                            }}
                        >
                            <tbody>
                                <tr className="text-center ">
                                    <td className={progress >= 33 ? 'table-primary' : ""}>已確認</td>
                                    <td className={progress >= 66 ? 'table-primary' : ""}>外送中</td>
                                    <td className={progress >= 99 ? 'table-primary' : ""}>已送達</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='mb-3 mt-3 row'>
                            <span className='col-sm-2  col-form-label'>購買日期</span>
                            <div className='col-sm-10  '>
                                <input
                                    type='text'
                                    readOnly
                                    className='form-control-plaintext'
                                    id='staticEmail'
                                    defaultValue={tempData?.create_at}
                                />
                            </div>
                        </div>
                        <div className='mb-3 row'>
                            <span className='col-sm-2 col-form-label'>Email</span>
                            <div className='col-sm-10'>
                                <input
                                    type='email'
                                    readOnly
                                    className='form-control-plaintext'
                                    id='staticEmail'
                                    defaultValue={tempData?.user?.email}
                                />
                            </div>
                        </div>
                        <div className='mb-3 row'>
                            <span className='col-sm-2 col-form-label'>訂購者</span>
                            <div className='col-sm-10'>
                                <input
                                    type='text'
                                    readOnly
                                    className='form-control-plaintext'
                                    id='staticEmail'
                                    defaultValue={tempData?.user?.name}
                                />
                            </div>
                        </div>
                        <div className='mb-3 row'>
                            <span className='col-sm-2 col-form-label'>外送地址</span>
                            <div className='col-sm-10'>
                                <input
                                    type='text'
                                    readOnly
                                    className='form-control-plaintext'
                                    defaultValue={tempData?.user?.address}
                                />
                            </div>
                        </div>
                        <div className='mb-3 row'>
                            <span className='col-sm-2 col-form-label'>付款狀態</span>
                            <div className='col-sm-10'>
                                <input
                                    type='text'
                                    readOnly
                                    className='form-control-plaintext'
                                    defaultValue={tempData?.is_paid ? '已付款' : '未付款'}
                                />
                            </div>
                        </div>

                        <div className='mb-3 row'>
                            <span className='col-sm-2 col-form-label'>留言</span>
                            <div className='col-sm-10'>
                                <textarea
                                    name=''
                                    id=''
                                    cols='30'
                                    readOnly
                                    className='form-control-plaintext'
                                    defaultValue={tempData?.user?.message}
                                />
                            </div>
                        </div>
                        {tempData?.products && (
                            <table className='table'>
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
                                        <td className='border-0 text-end'>總金額</td>
                                        <td className='border-0'>${tempData?.total}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>
                    <div className='modal-footer'>
                            <button
                                type='button'
                                className='btn btn-secondary'
                                onClick={closeOrderModal}
                            >
                                關閉
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default QueryModal;




