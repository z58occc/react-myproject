import { Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Dashboard from "./page/admin/Dashboard";
import AdminProducts from "./page/admin/AdminProducts";
import AdminCoupons from "./page/admin/AdminCoupons";
import AdminOrders from "./page/admin/AdminOrder";
import AdminArticle from "./page/admin/AdminArticle";
import FrountLayout from "./page/front/FrountLayout";
import Home from "./page/front/Home";
import Products from "./page/front/Products";
import Articles from "./page/front/Articles";
import OrderQuery from "./page/front/OrderQuery";
import ProdeuctDetail from "./page/front/ProductDetail";
import ArticleDetail from "./page/front/ArticleDetail";
import Cart from "./page/front/Cart";
import Checkout from "./page/front/Checkout";
import Success from "./page/front/Success";
import ScrollToTop from "./components/ScrollToTop";
import BuyLater from "./page/front/BuyLater";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<FrountLayout />}>
          <Route path="" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:tag" element={<Articles />} />
          <Route path="orderQuery" element={<OrderQuery />} />
          <Route path="BuyLater" element={<BuyLater />} />
          <Route path="products/:searchWord" element={<Products />} />
          <Route path="product/:id" element={<ProdeuctDetail />} />
          <Route path="article/:id" element={<ArticleDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/cart/checkout" element={<Checkout />} />
          <Route path="success/:orderId" element={<Success />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />}>
          <Route path="products" element={<AdminProducts />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="articles" element={<AdminArticle />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
