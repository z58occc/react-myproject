import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(false);
  const tag = useParams();

  const getArticles = async (page = 1) => {
    setLoading(true);
    const articleRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/articles?page=${page}`,
    );
    setArticles(articleRes.data.articles);
    setPagination(articleRes.data.pagination);
    setLoading(false);
  };



  useEffect(() => {    
    if (tag.tag) {//  可以從articleDetail點擊tag 搜尋該tag的所有文章
      const getTagArticles = async () => {
        setLoading(true);
        const articlesPage1 = await axios.get(
          `/v2/api/${process.env.REACT_APP_API_PATH}/articles`,
        );
        const articlesPage2 = await axios.get(
          `/v2/api/${process.env.REACT_APP_API_PATH}/articles?page=2`,
        );
        const articlesArr = [
          ...articlesPage1.data.articles,
          ...articlesPage2.data.articles,
        ];
        const articleFilter = articlesArr.filter((item) =>
          item?.tag?.includes(tag.tag),
        );
        setArticles(articleFilter);
        setLoading(false);
      };

      getTagArticles();
    } else {
      getArticles(1);
    }
  }, [tag.tag]);
  return (
    <div className=" container mb-10">
      <Loading isLoading={isLoading} />
      {articles.map((article,i) => (
        <div className="row mt-5" key={article.id}>
          <div className="col-sm-4">
            <Link
              to={`/article/${article.id}`}
              style={{
                textDecoration: "none",
              }}
            >
              <img
                className="img-fluid object-cover w-100"
                src={article.image}
                alt={`article-image-${i}`}
                style={{
                  height: "300px",
                }}
              />
            </Link>
          </div>
          <div className="col-sm-8">
            <div>
              <h3>
                <Link
                  to={`/article/${article.id}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  {article.title}
                </Link>
              </h3>
            </div>
            <div>
              <small>
                作者：{article.author} /
                {moment.unix(article.create_at).format("YYYY-MM-DD")}
              </small>
            </div>
            <div className="article-description">
              <big>{article.description}</big>
            </div>
          </div>
        </div>
      ))}
      <nav className="d-flex justify-content-center mt-5">
        <Pagination pagination={pagination} changePage={getArticles} />
      </nav>
    </div>
  );
}

export default Articles;
