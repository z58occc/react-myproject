import React from 'react';
import ReactDOM from 'react-dom/client';
import "quill/dist/quill.core.css"; 
import './stylesheets/all.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { HashRouter} from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store';


axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
