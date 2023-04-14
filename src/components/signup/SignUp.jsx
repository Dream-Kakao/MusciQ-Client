import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import InputField from "./InputField";

// style
const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background-color: #64dfdf;
  width: 140px;
  height: 50px;
  color: #6930c3;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #80ffdb;
  }
`;

// logic
function SignUp() {
  // form에 입력된 데이터들
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    nickname: "",
    passwordConfirm: "",
  });

  // 에러 메세지 초기화
  const [error, setError] = useState(false); // 에러가 한번이라도 났는지
  const [idError, setIdError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordStateError, setPasswordStateError] = useState(""); // 비밀번호 조건에 안맞을때
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 확인이 틀렸을때
  const [registerError, setRegisterError] = useState("");

  // formData 핸들링
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // 데이터 들고 서버에 post 요청
  //   const handleDataPost = async (data) => {
  //     const { id, email, nickname, password } = data;
  //     const postData = { id, email, nickname, password };

  //     await axios
  //       .post("http://localhost:8080/api/v1/members/member", postData)
  //       .then((res) => {
  //         console.log(res, "회원가입 성공");
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         setRegisterError("회원가입에 실패하였습니다. 다시 시도해주세요.");
  //       });
  //   };

  // 회원가입 핸들링
  const handleSignUp = (e) => {
    e.preventDefault();

    const joinData = {
      id: formData.id,
      email: formData.email,
      nickname: formData.nickname,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
    };
    //console.log(joinData);
    const { id, email, nickname, password, passwordConfirm } = joinData;

    // todo nickname 유효성 검사

    // password 유효성 검사
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegex.test(password)) {
      setPasswordStateError(
        "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!"
      );
      setError(true);
    } else {
      setPasswordStateError("");
    }

    // password 동일한지 판별
    if (password !== passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      setError(true);
    } else {
      setPasswordError("");
    }

    if (passwordRegex.test(password) && password === passwordConfirm) {
      //handleDataPost(joinData);
      console.log("회원가입 성공");
    } else {
      console.log("회원가입 실패");
    }
  };

  return (
    <SignUpForm onSubmit={handleSignUp}>
      <InputField
        id="id"
        value={formData.id}
        type="text"
        placeholder="ID"
        error={error}
        errorMessage={idError}
        onChange={handleInputChange}
      />
      <InputField
        id="email"
        value={formData.email}
        type="email"
        placeholder="E-mail"
        onChange={handleInputChange}
      />
      <InputField
        id="nickname"
        value={formData.nickname}
        type="test"
        placeholder="Nickname"
        error={error}
        errorMessage={nicknameError}
        onChange={handleInputChange}
      />
      <InputField
        id="password"
        value={formData.password}
        type="password"
        placeholder="Password"
        error={error}
        errorMessage={passwordStateError}
        onChange={handleInputChange}
      />
      <InputField
        id="passwordConfirm"
        value={formData.passwordConfirm}
        type="password"
        placeholder="Password 확인"
        error={error}
        errorMessage={passwordError}
        onChange={handleInputChange}
      />
      <Button>Sign Up!</Button>
    </SignUpForm>
  );
}

export default SignUp;
