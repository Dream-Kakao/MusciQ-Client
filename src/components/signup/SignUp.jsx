import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import InputField from "./InputField";
import InputWithButton from "./InputWithButton";

// !logic
function SignUp() {
  useEffect(() => {
    const expiration = localStorage.getItem("AuthExpiration");
    const currentTime = new Date().getTime();

    // Access Token이 만료 됐다면
    if (expiration && currentTime > parseInt("AuthExpiration")) {
      localStorage.removeItem("Auth"); // Access Token 제거
      localStorage.removeItem("AuthExpiration");
    }
    const accessToken = localStorage.getItem("Auth")
    if (accessToken != null) {
      window.location.replace("/login")
    }
  }, []);

  // form에 입력된 데이터들
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    emailAuth: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });

  // 에러 상태 초기화
  const [idError, setIdError] = useState(false); // id 중복 에러
  const [emailError, setEmailError] = useState(false); // 이메일 중복 에러
  const [emailAuthError, setEmailAuthError] = useState(false); // 이메일 인증코드 에러
  const [nicknameError, setNicknameError] = useState(false); // 닉네임 중복 에러
  const [passwordStateError, setPasswordStateError] = useState(false); // 비밀번호 조건에 안맞을때
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 확인이 틀렸을때

  // 에러 메세지 초기화
  const [idErrorMessage, setIdErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [emailAuthErrorMessage, setEmailAuthErrorMessage] = useState("");
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  const [passwordStateErrorMessage, setPasswordStateErrorMessage] =
    useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // 사용 가능 메세지 초기화
  const [idOkMessage, setIdOkMessage] = useState("");
  const [emailOkMessage, setEmailOkMessage] = useState("");
  const [emailAuthOkMessage, setEmailAuthOkMessage] = useState("")
  const [nicknameOkMessage, setNicknameOkMessage] = useState("");

  // 회원 가입 버튼 활성화 유무
  const [ok, setOk] = useState(false);

  // 이메일 인증 코드 값
  const [authCode, setAuthCode] = useState(null);

  // formData에 입력 값들이 모두 존재하면 ok 값을 true로 변경
  useEffect(() => {
    if (
      formData.id &&
      formData.email &&
      formData.emailAuth &&
      formData.nickname &&
      formData.password &&
      formData.passwordConfirm
    ) {
      setOk(true);
    } else {
      setOk(false);
    }
    let timer = null;

    if (authCode !== null) {
      timer = setTimeout(() => {
        setAuthCode(null);
      }, 3 * 60 * 1000); // 3분
    }

    return () => {
      clearTimeout(timer);
    };
  }, [formData, authCode]);

  // formData 핸들링
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const navigate = useNavigate();

  // !method
  const onClickGotoLogin = () => {
    navigate("/");
  };

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

    // 중복검사
    await axios
      .get(`${process.env.REACT_APP_API_URL_V1}members/id/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        // id 중복되지 않음
        const jsonRes = res.data;

        setIdError(false);
        setIdOkMessage("사용 가능 😆");
      })
      .catch((err) => {
        // id 중복됨
        const jsonRes = err.response.data;

        setIdError(true);
        setIdErrorMessage("중복된 ID 입니다.");
      });
  };

  // email 유효성 검사, 중복 검사
  const checkEmail = async (email) => {
    // 유효성 검사
    const emailRegex = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("이메일 형식이 올바르지 않습니다!");

      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // 중복 검사
    await axios
      .get(`${process.env.REACT_APP_API_URL_V1}members/email/${email}`, {
        withCredentials: true,
      })
      .then((res) => {
        // email 중복되지 않음
        const jsonRes = res.data;

        setEmailError(false);
        setEmailOkMessage("사용 가능 😆");
        return jsonRes;
      })
      .then((jsonRes) => {

        if (jsonRes.success) {
          axios.get(`${process.env.REACT_APP_API_URL_V1}members/email/authentication/${email}`)
            .then((res) => {
              const jsonRes = res.data;

              if (!jsonRes.success) {
                setEmailError(true);
                alert("현재 이메일 인증이 원할하지 못해 회원가입이 불가능합니다, 죄송합니다.")
              }
              setAuthCode(jsonRes.data)

            })
            .catch((err) => {
              console.log(err);
              alert("현재 이메일 인증이 원할하지 못해 회원가입이 불가능합니다, 죄송합니다.")
            })
        }
      })
      .catch((err) => {
        console.log(err)
        setEmailError(true);
        setEmailErrorMessage("중복된 Email 입니다.");
      });
  };

  // 이메일 인증 코드 비교 검사
  const checkEmailAuth = (emailAuth) => {
    console.log(authCode)
    if (authCode != null && emailAuth === authCode) {
      setEmailAuthError(false)
      setEmailAuthOkMessage("인증완료 😆");
    } else {
      setEmailAuthError(true)
      setEmailAuthErrorMessage("인증실패 😥");
    }
  }

  // nickname 유효성 검사, 중복 검사
  const checkNickname = async (id, nickname) => {
    // 유효성 검사
    const nicknameRegex = /^[ㄱ-ㅎ가-힣A-Za-z0-9-_]{2,10}$/;
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
    await axios
      .get(
        `${process.env.REACT_APP_API_URL_V1}members/nickname/${id}/${nickname}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // 닉네임 중복되지 않음
        const jsonRes = res.data;


        setNicknameError(false);
        setNicknameOkMessage("사용 가능 😆");
      })
      .catch((err) => {
        // 닉네임 중복됨
        const jsonRes = err.response.data;


        setNicknameError(true);
        setNicknameErrorMessage("중복된 nickname 입니다.");
      });
  };

  // password 유효성 검사
  const validatePassword = (password) => {
    const passwordRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}$/;
    if (!passwordRegex.test(password)) {
      setPasswordStateError(true);
      setPasswordStateErrorMessage(
        "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!"
      );

      return false; // 비밀번호 유효성 X
    } else {
      setPasswordStateError(false);
      setPasswordStateErrorMessage("");

      return true; // 비밀번호 유효성 O
    }
  };

  // password 같은지 검사
  const equalPassword = (password, passwordConfirm) => {
    if (password !== passwordConfirm) {
      setPasswordError(true);
      setPasswordErrorMessage("비밀번호가 일치하지 않습니다.");

      return false; // 비밀번호 다름
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");

      return true; // 비밀번호 같음
    }
  };

  // 회원가입 핸들링
  const handleSignUp = (e) => {
    e.preventDefault();

    const joinData = {
      id: formData.id,
      email: formData.email,
      emailAuth: formData.emailAuth,
      nickname: formData.nickname,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
    };

    const { id, email, emailAuth, nickname, password, passwordConfirm } = joinData;

    if (
      !idError &&
      !emailError &&
      !emailAuthError &&
      !nicknameError &&
      validatePassword(password) &&
      equalPassword(password, passwordConfirm)
    ) {
      handleDataPost(joinData);
    } else {
      alert("회원가입에 실패하였습니다. 다시 확인해 주세요.");
    }
  };

  // 데이터 들고 서버에 post 요청
  const handleDataPost = async (data) => {
    const { id, email, nickname, password } = data;
    const postData = { id, email, nickname, password };

    await axios
      .post(`${process.env.REACT_APP_API_URL_V1}members/member`, postData, {
        withCredentials: true,
      })
      .then((res) => {
        alert("회원가입 성공! 🎉");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("회원가입에 실패하였습니다. 다시 확인해 주세요.");
      });
  };

  return (
    <SignUpForm>
      <TextButton onClick={onClickGotoLogin}>로그인 하러가기!</TextButton>
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
        type="text"
        placeholder="E-mail"
        error={emailError}
        errorMessage={emailErrorMessage}
        okMessage={emailOkMessage}
        onChange={handleInputChange}
        onClick={() => checkEmail(formData.email)}
      />
      <InputWithButton
        id="emailAuth"
        value={formData.emailAuth}
        type="text"
        placeholder="인증코드"
        error={emailAuthError}
        errorMessage={emailAuthErrorMessage}
        okMessage={emailAuthOkMessage}
        onChange={handleInputChange}
        onClick={() => checkEmailAuth(formData.emailAuth)}
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

const TextButton = styled.button`
  background-color: transparent;
  border: none;
  margin-bottom: 10px;
  color: #64dfdf;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
`;
