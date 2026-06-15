import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store, { useAppDispatch } from "./redux/store";
import { checkAuth } from "./redux/authSlice";
import Layout from "./components/Layout";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Bookmarks from "./pages/Bookmarks";

// Inner application component to consume dispatch and execute startup checks
const MainApp: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // If a token exists in localStorage, verify/load profile
    if (localStorage.getItem("token")) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="*" element={<Feed />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
