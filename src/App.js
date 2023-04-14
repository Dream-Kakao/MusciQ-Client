import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import SignUp from "./components/signup/SignUp";
import Login from "./components/login/Login";
import MyPage from "./components/mypage/MyPage";
import Modify from "./components/modify/Modify";
import OpenviduDefault from "./components/webrtc/OpenviduDefault";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <div className="body">
      <div className="headerWrap">
        <Header />
      </div>

      <div>
        <BrowserRouter>
          <Routes>
            <Route
              path="/openvidu"
              element={<OpenviduDefault></OpenviduDefault>}
            />
            <Route path="/signup" element={<SignUp></SignUp>} />
            <Route path="/login" element={<Login></Login>} />
            <Route path="/mypage" element={<MyPage></MyPage>} />
            <Route path="/modify" element={<Modify></Modify>} />
          </Routes>
        </BrowserRouter>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
