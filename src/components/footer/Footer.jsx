import React from "react";
import styled from "styled-components";

// style
import "./Footer.css";

const FooterWrapper = styled.div`
  width: 100%;
  // height: 15%;
  max-height: 25%;
  bottom: 0px;
  position: relative;
  border-top: 3px solid #252525;
  margin-top: 25px;
  padding-top: 15px;
  font-size: 11px;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <nav>
        <a
          href="https://www.notion.so/dreamkakao/About-d98c5ff019e948c89e047da01a3beca9?pvs=4"
          target="_blank"
        >
          Notion
        </a>{" "}
        |
        <a href="https://github.com/Dream-Kakao" target="_blank">
          Github
        </a>
      </nav>
      <p>
        <span>저자: Dream Kakao</span>
        <br />
        <span>대표 메일: musicq0503@gmail.com</span>
        <br />
        <br />
        <span>팀원 메일</span>
        <br />
        <span>손병주: thsqudwn05@gmail.com</span>
        <br />
        <span>이현범: hb19971127@gmail.com</span>
        <br />
        <span>정솔리: jeongpine14@gmail.com</span>
        <br />
        <span>정채윤: chxrryda@gmail.com</span>
        <br />
        <br />
        <span>Copyright 2020. cocoder. All Rights Reserved.</span>
      </p>
    </FooterWrapper>
  );
};

export default Footer;
