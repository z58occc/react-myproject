import { useRef, useState, useEffect,useContext } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import moment from "moment";
import ArticleModal from "../../components/ArticleModal";
import DeleteModal from "../../components/DeleteModal";
import "moment/locale/zh-tw";
import Pagination from "../../components/Pagination";
import {
  MessageContext,
  handleErrorMessage,
} from "../../contexts/MessageContext";

function AdminArticle() {
  const [, dispatch] = useContext(MessageContext);
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});

  //  type:決定 modal 展開的用途
  const [type, setType] = useState("create"); //   edit
  const [tempArticle, setTempArticle] = useState({});

  const articleModal = useRef(null);
  const deleteModal = useRef(null);

  const openArticleModal = async (method, article) => {
    setType(method);
    setTempArticle(article);
    try {
      const response = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${article.id}`,
      );
      setTempArticle(response.data.article);
      articleModal.current.show();
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };
  const closeArticleModal = () => {
    articleModal.current.hide();
  };
  const openDeleteModal = (article) => {
    setTempArticle(article);
    deleteModal.current.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };
  const getArticles = async (page = 1) => {
    const articleRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/admin/articles?page=${page}`,
    );
    setArticles(articleRes.data.articles);
    setPagination(articleRes.data.pagination);
  };
  const deleteArticle = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${id}`,
      );
      if (res.data.success) {
        getArticles();
        deleteModal.current.hide();
      }
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  useEffect(() => {
    moment.locale("zh-tw");
    getArticles();
    articleModal.current = new Modal("#articleModal", {
      backdrop: "static",
    });
    deleteModal.current = new Modal("#deleteModal", {
      backdrop: "static",
    });
  }, []);

  return (
    <div className="p-3">
      <ArticleModal
        closeArticleModal={closeArticleModal}
        type={type}
        tempArticle={tempArticle}
        getArticles={getArticles}
      />
      <DeleteModal
        close={closeDeleteModal}
        text={tempArticle?.title}
        handleDelete={deleteArticle}
        id={tempArticle?.id}
      />
      <h3>文章列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openArticleModal("create", {})}
        >
          建立新文章
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">編號</th>
            <th scope="col">標題</th>
            <th scope="col">作者</th>
            <th scope="col">公開狀態</th>
            <th scope="col">建立時間</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.num}</td>
              <td>{article.title}</td>
              <td>{article.author}</td>
              <td>{article.isPublic ? "啟用" : "未啟用"}</td>
              <td>{moment.unix(article.create_at).format("YYYY-MM-DD")}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openArticleModal("edit", article)}
                >
                  編輯
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={() => openDeleteModal(article)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination pagination={pagination} changePage={getArticles} />
    </div>
  );
}

export default AdminArticle;
