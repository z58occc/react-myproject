import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../store/messageStore";



function ArticleModal({ closeArticleModal, type, getArticles, tempArticle }) {
    const imgRef = useRef(null);
    const [tag, setTag] = useState('');
    const [tempData, setTempData] = useState({
        title: "",
        description: "",
        image: "",
        tag: [''],
        create_at: moment(new Date()).unix(),
        author: "",
        isPublic: true,
        content: "",
    });
    // const [tempQuill, setTempQuill] = useState({});
    //  取出token
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hextoken="))
        ?.split("=")[1];
    axios.defaults.headers.common['Authorization'] = token;


    const uploadFile = async (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file-to-upload', file);
        try {
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`, formData, {
                headers: {
                    authorization: token
                }
            });
            if (e.target.name === "image") {
                setTempData({
                    ...tempData,
                    [name]: res.data.imageUrl
                });
            } else {
                const index = parseInt(e.target.name);
                setTempData({
                    ...tempData,
                    imagesUrl: tempData.imagesUrl.map((item, i) => i === index ? res.data.imageUrl : item)
                });
            }
        } catch (error) {
            console.log(error);
        }
    };




    const [, dispatch] = useContext(MessageContext);


    useEffect(() => {
        if (type === 'create') {
            setTempData({
                title: "",
                description: "",
                image: "",
                tag: [''],
                create_at: moment(new Date()).unix(),
                author: "",
                isPublic: true,
                content: "",
            });
            imgRef.current.value = "";
        } else if (type === 'edit') {
            setTempData(tempArticle);
            imgRef.current.value=tempData.image;
        }
    }, [type, tempArticle]);

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name === 'tag') {
            setTag(value);
        } else if (!name) {
            setTempData({
                ...tempData,
                tag: [...tempData.tag, tag.trim()] // 新增value到陣列中
            });
            setTag('');
        } else if (name === "isPublic") {
            setTempData({
                ...tempData,
                isPublic: checked
            });
        }
        else {
            setTempData({
                ...tempData,
                [name]: value.trim()
            });
        }
    };


    const submit = async () => {
        try {
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article`;
            let method = 'post';
            if (type === "edit") {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${tempArticle.id}`;
                method = 'put';
            }
            const res = await axios[method](
                api, {
                data: tempData
            }
            );
            handleSuccessMessage(dispatch, res);
            closeArticleModal();
            getArticles();
        } catch (error) {
            handleErrorMessage(dispatch, error);
        }
    }
    const removeTag = (index) => {
        let removeTags = [...tempData.tag];
        removeTags.splice(index, 1);
        setTempData({
            ...tempData,
            tag: removeTags
        });
    };
    



    return (

        <div
            className='modal fade'
            tabIndex='-1'
            id="articleModal"
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'
        >

            <div className='modal-dialog modal-lg'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h1 className='modal-title fs-5' id='exampleModalLabel'>
                            {type === 'create' ? "建立新文章" : `編輯`}
                        </h1>
                        <button
                            type='button'
                            className='btn-close'
                            aria-label='Close'
                            onClick={closeArticleModal}
                        />
                    </div>
                    <div className='modal-body'>
                        <div className='row'>
                            <div className='col-sm-4'>
                                <div className='form-group mb-5'>

                                    <label className='w-100 ' htmlFor='image'>
                                        輸入主圖網址
                                        <input
                                            type='text'
                                            name='image'
                                            id='image'
                                            placeholder='請輸入圖片連結'
                                            className='form-control'
                                            onChange={handleChange}
                                            ref={imgRef}
                                        />
                                    </label>
                                    <div className='form-group '>
                                        <input
                                            type='file'
                                            id='customFile'
                                            className='form-control'
                                            name='image'
                                            onChange={(e) => uploadFile(e)}
                                        />
                                    </div>
                                    {
                                        tempData?.image && <img className="w-100" src={tempData?.image} alt="..." />
                                    }
                                    <div style={{
                                        maxHeight: "300px", /* 限制容器的最大高度 */
                                        overflow: "auto" /* 當內容超過時，顯示滾動條 */
                                    }}

                                    >
                                        {tempData?.tag?.map((item, i) => 
                                             (
                                                item
                                                    ?
                                                    <button onClick={() => removeTag(i)} key={i} type="button" className={`
                                        me-3 mt-2    rounded btn btn-outline-primary position-relative`}
                                                    >
                                                        <div
                                                            style={{
                                                                maxWidth: "200px", /* 限制按鈕最大寬度 */
                                                                overflow: 'hidden', /* 隱藏超出部分 */
                                                                textOverflow: 'ellipsis', /* 顯示省略號 */
                                                                whiteSpace: 'nowrap' /* 強制單行顯示 */
                                                            }}
                                                        >
                                                            {item}
                                                        </div>
                                                        <span className="position-absolute top-0 start-100 translate-middle    bi bi-x-circle-fill "
                                                            style={{
                                                                opacity: '0.5',
                                                            }}
                                                        />
                                                    </button>
                                                    :
                                                    ''

                                            )
                                        )}
                                    </div>

                                </div>
                            </div>


                            <div className='col-sm-8'>

                                <div className='row'>
                                    <div className='form-group mb-2 col-md-6'>
                                        <label className='w-100' htmlFor='title'>
                                            標題
                                            <input
                                                type='text'
                                                id='title'
                                                name='title'
                                                placeholder='請輸入分類'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempData?.title || ''}
                                            />
                                        </label>
                                    </div>
                                    <div className='form-group mb-2 col-md-6'>
                                        <label className='w-100' htmlFor='author'>
                                            作者
                                            <input
                                                type='author'
                                                id='author'
                                                name='author'
                                                placeholder='請輸入單位'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempData?.author || ''}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <br />
                                <div className='form-group mb-2'>
                                    <label className='w-100' htmlFor='description'>
                                        文章簡述
                                        <textarea
                                            type='text'
                                            id='description'
                                            name='description'
                                            placeholder='請輸入產品描述'
                                            className='form-control'
                                            onChange={handleChange}
                                            value={tempData?.description?.trim() || ''}
                                        />
                                    </label>
                                </div>
                                <div className='form-group mb-2'>
                                    {/* <Editor
                                        setTempQuill={setTempQuill}
                                    ></Editor> */}
                                    <label className='w-100' htmlFor='content'>
                                        文章內容
                                        <textarea
                                            type='text'
                                            id='content'
                                            name='content'
                                            placeholder='請輸入產品說明內容'
                                            className='form-control'
                                            onChange={handleChange}
                                            value={tempData?.content || ''}
                                            style={{ height: '300px' }}
                                        />
                                    </label>
                                </div>
                                <br />

                                <div className='form-group mb-2'>
                                    <div className='form-group mb-2'>
                                        <i className="bi bi-plus-lg float-end btn "
                                            onClick={handleChange}
                                            name='plus'
                                        />
                                        <input
                                            type='text'
                                            id='tag'
                                            name='tag'
                                            placeholder='請輸入自訂標籤'
                                            className='ms-3 mb-5 w-50 text-center float-end 
                                                form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none
                                                '
                                            onChange={handleChange}
                                            value={tag || ''}
                                        />
                                    </div>
                                    <br />
                                    <div className='form-check'>
                                        <label
                                            className='w-100 form-check-label'
                                            htmlFor='isPublic'
                                        >
                                            是否公開
                                            <input
                                                type='checkbox'
                                                id='isPublic'
                                                name='isPublic'
                                                placeholder='請輸入產品說明內容'
                                                className='form-check-input'
                                                onChange={handleChange}
                                                checked={tempData?.isPublic || false}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className='modal-footer mt-3'>
                                    <button type='button' className='btn btn-secondary'
                                        onClick={closeArticleModal}>
                                        關閉
                                    </button>
                                    <button type='button' className='btn btn-primary'
                                        onClick={submit}>
                                        儲存
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </div >
    );
}
export default ArticleModal;



