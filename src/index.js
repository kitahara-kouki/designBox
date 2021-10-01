import React, { Fragment } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from 'react-dom';
import App from './App';
import indexCss from "./css/index.css";

ReactDOM.render(
    <Fragment>
        <Router>
            <App />
        </Router>
    </Fragment>,
    document.getElementById('root')
);
