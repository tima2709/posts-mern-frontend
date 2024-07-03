import React, {useEffect} from 'react'
import Header from './components/Header/index';
import Home from './pages/Home';
import {Container} from "@mui/material";
import FullPost from "./pages/FullPost";
import AddPost from "./pages/AddPost";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import {Route, Routes} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthMe, selectIsAuth} from "./redux/slices/auth";

function App() {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)

    useEffect(() => {
        dispatch(fetchAuthMe())
    },[])

  return (
      <>
          <Header />
          <Container maxWidth="lg">
              <Routes>
                  <Route path="/" element={<Home />}/>
                  <Route path="/posts/:id" element={<FullPost />}/>
                  <Route path="/posts/:id/edit" element={<AddPost />}/>
                  <Route path="/add-post" element={<AddPost />}/>
                  <Route path="/login" element={<Login />}/>
                  <Route path="/register" element={<Registration />}/>
              </Routes>
              <FullPost />
          </Container>
      </>
  );
}

export default App;
