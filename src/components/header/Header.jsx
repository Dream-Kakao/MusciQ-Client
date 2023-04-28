import React, { Component } from "react";
import styled from "styled-components";
import logo from "../../assets/img/logo.png";

class Header extends Component {
  render() {
    const onClickLogo = () => {
      window.location.replace('/')
    }
    return (
      <LogoWrapper>
        <Logo src={logo} onClick={onClickLogo} />
      </LogoWrapper>
    );
  }
}

export default Header;

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