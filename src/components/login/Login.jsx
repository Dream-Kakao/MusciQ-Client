import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";

// style
const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
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
  margin-bottom: 25px;
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

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL_V1}members/token`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          navigate("/roomlist")
        } else {
          console.log(res.error)
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [inputId, setInputId] = useState();
  const [inputPw, setInputPw] = useState();

  const onClickGotoSignUp = () => {
    navigate('/signup')
  }

  const onChangeIdInput = (e) => {
    setInputId(e.target.value)
  }

  const onChangePasswordInput = (e) => {

    setInputPw(e.target.value)
  }

  const onClickLogin = () => {
    const idReg = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;

    const pwRed = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}/
    if (idReg.test(inputId)) {
      if (pwRed.test(inputPw)) {
        const url = `${process.env.REACT_APP_API_URL_V1}members/login`
        const reqData = {
          id: inputId,
          password: inputPw
        }
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(reqData),
          credentials: "include"
        })
          .then((res) => res.json())
          .then(res => {
            if (res.success) {
              const now = new Date();
              const expirationDate = new Date(now.getTime() + 86400000);
              localStorage.setItem("UserID", inputId)
              localStorage.setItem("Auth", res.data)
              localStorage.setItem('AuthExpiration', expirationDate.getTime().toString());
              navigate('/roomlist')
            } else {
              if (res.error === 'NOT_EXIST_ID') {
                alert("존재하지 않는 ID 입니다.")
              }
              if (res.error === 'NOT_EXIST_PW') {
                alert("비밀번호가 틀렸습니다.")
              }
            }
          })
          .catch((err) => {
            console.log(err.error)
          })
      } else {
        alert("비밀번호는 8~16자 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.")
      }
    } else {
      alert("아이디는 알파벳과 숫자를 반드시 포함한 6~20자리 입니다.")
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onClickLogin();
    }
  }

  // Enter 를 입력하면 LoginButton 을 누르는 것과 같이 만들기
  return (
    <LoginForm>
      <TextButton onClick={onClickGotoSignUp}>회원가입 하러가기!</TextButton>
      {/* <TextButton>비밀번호를 잊어버렸어요!</TextButton> */}
      <LoginInput id="id" type="text" placeholder="ID" onChange={onChangeIdInput} onKeyDown={onKeyDown} />
      <LoginInput id="password" type="password" placeholder="Password" onChange={onChangePasswordInput} onKeyDown={onKeyDown} />
      <LoginButton onClick={onClickLogin}>로그인</LoginButton>
    </LoginForm>
  )
}

export default Login;