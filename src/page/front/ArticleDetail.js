import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import Loading from "../../components/Loading";

function ArticleDetail() {
    const [article, setArticle] = useState({});
    const { id } = useParams();
    const [articleNum, setArticleNum] = useState('');
    const [articleAll, setArticleAll] = useState([]);
    const [contentSize, setContentSize] = useState(false);
    const [isLoading, setLoading] = useState(false);


    const handleContentSize = (type) => {
        if (type) {
            setContentSize(true);
        } else {
            setContentSize(false);
        }
    }


    const getArticle = async (id) => {
        setLoading(true);
        const articleRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/article/${id}`);
        setArticle(articleRes.data.article);

        const articlesPage1 = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/articles`)
        const articlesPage2 = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/articles?page=2`)
        const articlesArr = [...articlesPage1.data.articles, ...articlesPage2.data.articles];
        setArticleAll(articlesArr);

        for (let index = 0; index < articlesArr.length; index++) {
            if (articlesArr[index].id == articleRes.data.article.id) {
                setArticleNum(articlesArr[index].num)
                break;
            }
        }
        setLoading(false);
    };


    useEffect(() => {
        getArticle(id);
    }, [id])
    return (
        <div className="container">
            <div className=" mb-5 row">
                <Loading isLoading={isLoading}></Loading>
                <div className="col-lg-9 mt-5">
                    <div>
                        {article?.tag?.map((item, i) => {
                            return (
                                item
                                    ?
                                    <Link key={i} to={`/articles/${item}`}>
                                        <button  type="button" className="me-3  pt-0 pb-0  btn btn-secondary tag"
                                            disabled
                                            style={{
                                                maxWidth: "200px", /* 限制按鈕最大寬度 */
                                                overflow: 'hidden', /* 隱藏超出部分 */
                                                textOverflow: 'ellipsis', /* 顯示省略號 */
                                                whiteSpace: 'nowrap' /* 強制單行顯示 */
                                            }}
                                        >
                                            {item}
                                        </button>
                                    </Link>
                                    :
                                    ""

                            )
                        })}
                    </div>
                    <div className="mt-3">
                        <h1>
                            {article.title}
                        </h1>
                    </div>
                    <div className="mt-3 d-flex justify-content-between ">
                        <big>
                            作者：{article.author} /{moment.unix(article.create_at).format('YYYY-MM-DD')}
                        </big>
                        <div className="me-3 ">
                            字級
                            <b style={{
                                fontSize: '25px'
                            }}
                                className="ms-2 me-1 font-size"
                                onClick={() => handleContentSize(true)}
                            >
                                A
                            </b>
                            <b className="font-size"
                                onClick={() => handleContentSize(false)}
                            >A</b>
                        </div>
                    </div>
                    <hr className="mt-0" />
                    <div style={{
                        fontSize: '20px'
                    }}
                        className="position-relative"
                    >
                        <div className="text-secondary
                         ">
                            {article.description}
                        </div>
                        <hr
                            style={{
                                borderWidth: '1px',
                            }} />
                        <div>
                            <img className="img-fluid object-cover w-100 mt-3" src={article.image} alt=""
                                style={{
                                    height: "500px"
                                }} />
                        </div>
                        <div className="mt-5"
                            style={{
                                fontSize: (contentSize ? '30px' : '20px'),
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {article.content}
                        </div>
                        <Link to={`/articles`}>
                            <button className="btn btn-outline-secondary
                position-absolute botton-0 end-0 mt-3    
                "
                            >回文章列表</button>
                        </Link>
                    </div>
                    <div className="mt-7">
                        <hr />
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-end me-5 text-primary">
                                    <b>
                                        PREVIOUS ARTICLE
                                    </b>
                                </div>
                                <Link to={`/article/${articleAll[articleNum - 2]?.id}`}
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                >
                                    <div className="d-flex justify-content-between me-5 ">
                                        <i className="bi bi-chevron-double-left text-secondary"
                                            style={{ fontSize: '80px' }}
                                        ></i>
                                        <div className="mt-3 next-article text-black">
                                            {articleAll[articleNum - 2]?.title}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col border-start border-black">
                                <div className="d-flex justify-content-start ms-5 text-primary">
                                    <b>
                                        NEXT ARTICLE
                                    </b>
                                </div>
                                <Link to={`/article/${articleAll[articleNum]?.id}`}
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                >
                                    <div className="d-flex justify-content-between ms-5 ">
                                        <div className="mt-3 next-article text-black">
                                            {articleAll[articleNum]?.title}
                                        </div>
                                        <i className="bi bi-chevron-double-right text-secondary"
                                            style={{ fontSize: '80px' }}
                                        ></i>
                                    </div>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 mt-5 latest-articles">
                    <div >
                        <h3 className="mb-3 row g-0 "
                        >
                            <span
                                className="float-start col-3 "
                                style={{
                                    fontSize: '16px',
                                }}>
                                最新文章
                            </span>
                            <b
                                className="border-bottom border-black border-5 col-8"
                                style={{
                                    fontSize: '12px'
                                }}>
                                NEW ARTICLES
                            </b>
                        </h3>
                        {articleAll?.slice(0, 5).map((article) => {
                            return (
                                <Link to={`/article/${article.id}`}
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                    className="text-secondary"
                                    key={article.id}
                                >
                                    <div className="row mb-5">
                                        <div className="col-4">
                                            <img src={article.image} alt=""
                                                style={{
                                                    width: '87px',
                                                    height: '63px'
                                                }}
                                                className="object-cover w-100"
                                            />
                                        </div>
                                        <div className="col-8"
                                            style={{
                                                fontSize: '12px'
                                            }}
                                        >
                                            {article.description}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ArticleDetail