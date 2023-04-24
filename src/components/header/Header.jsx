import React, { Component } from "react";
import styled from "styled-components";
import logo from "../../assets/img/logo.png";

// style
const LogoWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 230px;
  flex: 0.4;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
`;

class Header extends Component {
  render() {
    return (
      <LogoWrapper>
        <a href="http://localhost:3000/">
          <Logo src={logo} />
        </a>
      </LogoWrapper>
    );
  }
}

export default Header;
