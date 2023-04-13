import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import SignUp from "./components/signup/SignUp";
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
        <h1>Music Q!</h1>
        <BrowserRouter>
          <Routes>
            <Route
              path="/openvidu"
              element={<OpenviduDefault></OpenviduDefault>}
            />
            <Route path="signup" element={<SignUp></SignUp>} />
          </Routes>
        </BrowserRouter>
      </div>

      <Footer />
    </div>
  );
};

export default App;
