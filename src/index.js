import React from 'react';
import {Provider} from "react-redux";
import ReactDOM from 'react-dom/client';
import App from './App';
import {CssBaseline, ThemeProvider} from "@mui/material";
import { theme } from "./theme";
import {BrowserRouter} from "react-router-dom";
import './index.scss';
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
          <BrowserRouter>
              <Provider store={store}>
                  <App />
              </Provider>
          </BrowserRouter>
      </ThemeProvider>
  </>
);


