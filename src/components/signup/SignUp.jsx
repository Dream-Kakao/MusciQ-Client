import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";

import InputField from "./InputField";
import InputWithButton from "./InputWithButton";

// style
const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignupButton = styled.button`
  background-color: #64dfdf;
  width: 140px;
  height: 50px;
  color: #6930c3;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 23px;
  font-weight: 800;

  &:hover:not(:disabled) {
    background-color: #80ffdb;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

// logic
function SignUp() {
  // form에 입력된 데이터들
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });

  // 에러 상태 초기화
  const [idError, setIdError] = useState(false); // id 중복 에러
  const [emailError, setEmailError] = useState(false); // 이메일 중복 에러
  const [nicknameError, setNicknameError] = useState(false); // 닉네임 중복 에러
  const [passwordStateError, setPasswordStateError] = useState(false); // 비밀번호 조건에 안맞을때
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 확인이 틀렸을때

  // 에러 메세지 초기화
  const [idErrorMessage, setIdErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  const [passwordStateErrorMessage, setPasswordStateErrorMessage] =
    useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // 사용 가능 메세지 초기화
  const [idOkMessage, setIdOkMessage] = useState("");
  const [emailOkMessage, setEmailOkMessage] = useState("");
  const [nicknameOkMessage, setNicknameOkMessage] = useState("");

  // 회원 가입 버튼 활성화 유무
  const [ok, setOk] = useState(false);

  // formData에 입력 값들이 모두 존재하면 ok 값을 true로 변경
  useEffect(() => {
    if (
      formData.id &&
      formData.email &&
      formData.nickname &&
      formData.password &&
      formData.passwordConfirm
    ) {
      setOk(true);
    }
  }, [formData]);

  // formData 핸들링
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // method
  // id 유효성 검사, 중복 검사
  const checkId = async (id) => {
    // 유효성 검사
    const idRegex = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    if (!idRegex.test(id)) {
      setIdError(true);
      setIdErrorMessage(
        "아이디는 알파벳과 숫자를 반드시 포함한 6~20자리여야 합니다!"
      );

      return;
    } else {
      setIdError(false);
      setIdErrorMessage("");
    }

    // 중복 검사
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/members/id/${id}`
      );
      const jsonRes = res.data; // json으로 바꾼 data
      console.log(jsonRes);

      if (jsonRes.success) {
        // id 중복되지 않음
        setIdError(false);
        setIdOkMessage("사용 가능 😆");
        console.log("id 사용 가능");
      } else {
        // id 중복됨
        setIdError(true);
        setIdErrorMessage("중복된 ID 입니다.");
      }
    } catch (err) {
      // api 호출 실패
      console.error(err);
    }
  };

  // email 중복 검사
  // email 유효성은 input 자체에서 해줌
  const existEmail = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/members/email/${email}`
      );
      const jsonRes = res.data; // json으로 바꾼 data
      console.log(jsonRes);

      if (jsonRes.success) {
        // email 중복되지 않음
        setEmailError(false);
        setEmailOkMessage("사용 가능 😆");
        console.log("email 사용 가능");
      } else {
        // email 중복됨
        setEmailError(true);
        setEmailErrorMessage("중복된 email 입니다.");
      }
    } catch (err) {
      console.error(err); // api 호출 실패
    }
  };

  // nickname 유효성 검사, 중복 검사
  const checkNickname = async (id, nickname) => {
    // 유효성 검사
    const nicknameRegex = /^[ㄱ-ㅎ가-힣a-z0-9-_]{2,10}$/;
    if (!nicknameRegex.test(nickname)) {
      setNicknameError(true);
      setNicknameErrorMessage(
        "닉네임은 특수문자를 제외한 2~10자리여야 합니다!"
      );

      return;
    } else {
      setNicknameError(false);
      setNicknameErrorMessage("");
    }

    // 중복 검사
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/members/nickname/${id}/${nickname}`
      );
      const jsonRes = res.data; // json으로 바꾼 data
      console.log(jsonRes);

      if (jsonRes.success) {
        // nickname 중복되지 않음
        setNicknameError(false);
        setNicknameOkMessage("사용 가능 😆");
        console.log("nickname 사용 가능");
      } else {
        // nickname 중복됨
        setNicknameError(true);
        setNicknameErrorMessage("중복된 nickname 입니다.");
      }
    } catch (err) {
      console.error(err); // api 호출 실패
    }
  };

  // password 유효성 검사
  const validatePassword = (password) => {
    const passwordRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}$/;
    if (!passwordRegex.test(password)) {
      setPasswordStateError(true);
      setPasswordStateErrorMessage(
        "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!"
      );
    } else {
      setPasswordStateError(false);
      setPasswordStateErrorMessage("");
    }
  };

  // password 같은지 검사
  const equalPassword = (password, passwordConfirm) => {
    if (password !== passwordConfirm) {
      setPasswordError(true);
      setPasswordErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
  };

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

    const { id, email, nickname, password, passwordConfirm } = joinData;

    validatePassword(password);
    equalPassword(password, passwordConfirm);

    if (
      !idError &&
      !emailError &&
      !nicknameError &&
      !passwordStateError &&
      !passwordError
    ) {
      handleDataPost(joinData);
      alert("회원가입 성공! 🎉");
    } else {
      console.log("id, email, nickname, password 중에 문제있음");
    }
  };

  // 데이터 들고 서버에 post 요청
  const handleDataPost = async (data) => {
    const { id, email, nickname, password } = data;
    const postData = { id, email, nickname, password };

    await axios
      .post("http://localhost:8080/api/v1/members/member", postData)
      .then((res) => {
        console.log(res, "회원가입 성공");
      })
      .catch((err) => {
        console.error(err);
        setRegisterError("회원가입에 실패하였습니다. 다시 시도해주세요.");
      });
  };

  return (
    <SignUpForm>
      <InputWithButton
        id="id"
        value={formData.id}
        type="text"
        placeholder="ID"
        error={idError}
        errorMessage={idErrorMessage}
        okMessage={idOkMessage}
        onChange={handleInputChange}
        onClick={() => {
          checkId(formData.id);
        }}
      />
      <InputWithButton
        id="email"
        value={formData.email}
        type="email"
        placeholder="E-mail"
        error={emailError}
        errorMessage={emailErrorMessage}
        okMessage={emailOkMessage}
        onChange={handleInputChange}
        onClick={() => existEmail(formData.email)}
      />
      <InputWithButton
        id="nickname"
        value={formData.nickname}
        type="test"
        placeholder="Nickname"
        error={nicknameError}
        errorMessage={nicknameErrorMessage}
        okMessage={nicknameOkMessage}
        onChange={handleInputChange}
        onClick={() => checkNickname(formData.id, formData.nickname)}
      />
      <InputField
        id="password"
        value={formData.password}
        type="password"
        placeholder="Password"
        error={passwordStateError}
        errorMessage={passwordStateErrorMessage}
        onChange={handleInputChange}
      />
      <InputField
        id="passwordConfirm"
        value={formData.passwordConfirm}
        type="password"
        placeholder="Password 확인"
        error={passwordError}
        errorMessage={passwordErrorMessage}
        onChange={handleInputChange}
      />
      <SignupButton disabled={ok === false} onClick={handleSignUp}>
        Sign Up
      </SignupButton>
    </SignUpForm>
  );
}

export default SignUp;
