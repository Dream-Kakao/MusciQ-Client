import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material";

// components
import SignUp from "./components/signup/SignUp";
import Login from "./components/login/Login";
import MyPage from "./components/mypage/MyPage";
import Modify from "./components/modify/Modify";
import OpenviduDefault from "./components/webrtc/OpenviduDefault";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import RoomListContainer from "./components/room/RoomListContainer";

const theme = createTheme({
  typography: {
    fontFamily: "'NeoDunggeunmo Pro', serif"
  },
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <div className="headerWrap">
          <Header />
        </div>

        <ContentsWrapper>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SignUp></SignUp>} />
                <Route path="/openvidu" element={<OpenviduDefault></OpenviduDefault>} />
                <Route path="/roomlist" element={<RoomListContainer />} />
                <Route path="/signup" element={<SignUp></SignUp>} />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/mypage" element={<MyPage></MyPage>} />
                <Route path="/modify" element={<Modify></Modify>} />
              </Routes>
            </BrowserRouter>
          </div>
        </ContentsWrapper>

        <div className="footerWrap">
          <Footer />
        </div>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;

// style
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentsWrapper = styled.div`
  flex: 1;
`;