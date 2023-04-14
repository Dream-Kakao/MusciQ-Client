import React from "react";
import styled from "styled-components";

// style
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextButton = styled.button`
  background-color: transparent;
  border: none;
  margin-bottom: 10px;
  color: #64dfdf;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
`;

const LoginInput = styled.input`
  border: 3px solid #6930c3;
  width: 400px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #000;
  color: #fff;
  box-shadow: 0px 0px 5px #ccc;
  font-size: 16px;
`;

const LoginButton = styled.button`
  background-color: #64dfdf;
  width: 140px;
  height: 50px;
  padding: 10px 20px;
  margin-top: 10px;
  color: #6930c3;
  border: none;
  border-radius: 5px;
  font-size: 23px;
  font-weight: 800;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #80ffdb;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

// logic
function Login() {
  return (
    <LoginForm>
      <TextButton>회원가입 하러가기!</TextButton>
      <TextButton>비밀번호를 잊어버렸어요!</TextButton>
      <LoginInput id="id" type="text" placeholder="ID" />
      <LoginInput id="password" type="password" placeholder="Password" />
      <LoginButton>로그인</LoginButton>
    </LoginForm>
  );
}

export default Login;
