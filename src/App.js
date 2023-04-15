import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import SignUp from "./components/signup/SignUp";
import OpenviduDefault from "./components/webrtc/OpenviduDefault";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import RoomListContainer from "./components/room/RoomListContainer";


const App = () => {
  return (
    <div className="body" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="headerWrap">
        <Header />
      </div>

      <div style={{ flexGrow: "1", paddingTop: "100", paddingBottom: "100",  }}>
        <BrowserRouter>
          <Routes>
            <Route path="/openvidu" element={<OpenviduDefault></OpenviduDefault>} />
            <Route path="signup" element={<SignUp></SignUp>} />
            <Route path="/roomlist" element={<RoomListContainer/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      {/* <Footer className="footer" /> */}
    </div>
  );
};

export default App;