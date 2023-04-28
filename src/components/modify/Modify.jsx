import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

// logic
function Modify() {
  const navigate = useNavigate()

  // 전송할 실제 이미지 파일
  const [postImage, setPostImage] = useState(null);

  // DB에 저장할 이미지 정보
  const [changeInfo, setChangeInfo] = useState({
    nickname: '',
    memberImage: {
      uuid: '',
      path: '',
      profile_img: ''
    }
  })

  // 현재 이미지
  const [imageFile, setImageFile] = useState();

  // 현재 비밀번호
  const [curPassword, setCurPassword] = useState();

  // 변경할 비밀번호 
  const [newPassword, setNewPassword] = useState();

  // 변경할 비밀번호 확인
  const [chkNewPassword, setNewChkPassword] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("UserID")
    const url = `${process.env.REACT_APP_API_URL_V1}members/member/${userId}`
    fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {

        setChangeInfo({
          ...changeInfo,
          nickname: res.data.nickname,
          memberImage: {
            uuid: res.data.profile_img.uuid,
            path: res.data.profile_img.path,
            profile_img: res.data.profile_img.profile_img
          }
        })

        setImageFile(res.data.profile_img.path + res.data.profile_img.uuid + res.data.profile_img.profile_img)
      })
      .catch((error) => {
        
        console.log(error)
        navigate("/roomlist")
      })
  }, [])


  // 현재 프로필 이미지 미리보기 및 업로드할 이미지를 미리보기 한다.
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(URL.createObjectURL(file));
      setPostImage(file);
    }
  }

  // 닉네임 Input 변경하기
  const onChangeNickNameInput = (e) => {
    setChangeInfo({
      ...changeInfo,
      nickname: e.target.value
    })
  }

  // 회원정보 수정 요청
  const onClickModifyButton = () => {
    if (window.confirm("회원정보를 업데이트 하시겠습니까?")) {
      if (postImage) {
        const url = `${process.env.REACT_APP_API_URL_V1}members/member/upload/S3`;
        const formData = new FormData();
        formData.append('uploadFile', postImage);

        fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        })
          .then((res) => {
            return res.json()
          })
          .then((res) => {
            const userId = localStorage.getItem("UserID");
            const url = `${process.env.REACT_APP_API_URL_V1}members/member/${userId}`;
            fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                nickname: changeInfo.nickname,
                memberImage: {
                  uuid: res.uuid,
                  path: res.path,
                  profile_img: res.profile_img
                }
              })
            })
              .then((res) => {
                return res.json()
              })
              .then((res) => {
                alert(`${res.data.nickname}님, 회원정보가 정상적으로 변경되었습니다.`)
                navigate("/mypage")
              })
              .catch((err) => {
                console.log(err)
                alert("현재 닉네임 변경이 불가능합니다, 죄송합니다.")
                navigate("/")
              })
          })
          .catch((err) => {
            console.log(err)
            alert("현재 이미지 업로드가 불가능합니다, 죄송합니다.")
            navigate("/")
          })
      } else {

        // 이미지가 없는 경우 
        const userId = localStorage.getItem("UserID");
        const url = `${process.env.REACT_APP_API_URL_V1}members/member/${userId}`;
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            nickname: changeInfo.nickname,
            memberImage: {
              uuid: changeInfo.memberImage.uuid,
              path: changeInfo.memberImage.path,
              profile_img: changeInfo.memberImage.profile_img
            }
          })
        })
          .then((res) => {
            return res.json()
          })
          .then((res) => {
            alert(`${res.data.nickname}님, 회원정보가 정상적으로 변경되었습니다.`)
            navigate("/mypage")
          })
          .catch((err) => {
            console.log(err)
            alert("현재 닉네임 변경이 불가능합니다, 죄송합니다.")
            navigate("/")
          })
      }
    }
  }

  const onChangeInputCurPW = (e) => {
    setCurPassword(e.target.value)
  }

  const onChangeInputNewPW = (e) => {
    setNewPassword(e.target.value)
  }

  const onChangeInputNewPWCheck = (e) => {
    setNewChkPassword(e.target.value)
  }

  // password 유효성 검사
  const validatePassword = (password) => {
    const passwordRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return false; // 비밀번호 유효성 X
    } else {
      return true; // 비밀번호 유효성 O
    }
  };

  // password 같은지 검사
  const equalPassword = (password, passwordConfirm) => {
    if (password !== passwordConfirm) {
      return false; // 비밀번호 다름
    } else {
      return true; // 비밀번호 같음
    }
  };

  const onClickModifyPW = () => {

    if (validatePassword(curPassword) === false) {
      alert("현재 비밀번호는 숫자+영문자+특수문자 조합으로 8자리 이상 으로 구성되어 있습니다.")
      return;
    }

    if (validatePassword(newPassword) === false) {
      alert("변경할 비밀번호는 숫자+영문자+특수문자 조합으로 8자리 이상 으로 구성되어야 합니다.")
      return;
    }

    if (equalPassword(newPassword, chkNewPassword) === false) {
      alert("변경할 비밀번호 확인이 잘못되었습니다, 다시 한번 확인해 주세요.")
      return;
    }

    const userId = localStorage.getItem("UserID");
    const url = `${process.env.REACT_APP_API_URL_V1}members/password/${userId}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        curPassword: curPassword,
        changedPassword: newPassword,
        chkChangedPassword: chkNewPassword
      })
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.success === true) {
          if(window.confirm("입력하신 새로운 비밀번호로 변경하시겠습니까?")){
            alert("비밀번호가 정상적으로 변경되었습니다.")
            navigate("/mypage")
          }
        } else {
          if (res.error === 'NOT_EQUALS_INPUT_CURRENT_PW') {
            alert("현재 비밀번호가 일치하지 않습니다.")
          } else if (res.error === 'NOT_EQUALS_INPUT_CHANGED_PW') {
            alert("변경할 비밀번호 확인이 잘못되었습니다, 다시 한번 확인해 주세요.")
          } else {
            alert("현재 비밀번호 변경이 불가능합니다, 죄송합니다.")
            navigate("/")
          }
        }
      })
      .catch((err) => {
        console.log(err)
        alert("현재 비밀번호 변경이 불가능합니다, 죄송합니다.")
        navigate("/")
      })
  }

  const onClickWithdrawal = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      const userId = localStorage.getItem("UserID");
      const url = `${process.env.REACT_APP_API_URL_V1}members/member/${userId}`;

      fetch(url, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then((res) => {
          return res.json()
        })
        .then(
          fetch(`${process.env.REACT_APP_API_URL_V1}members/logout`, {
            method: "GET",
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              const success = data.success;
              if (success) {
                localStorage.removeItem("Auth");
                localStorage.removeItem("AuthExpiration");
                alert("정상적으로 회원 정보가 삭제 되었습니다.");
                navigate("/login");
              }
            })
            .catch((err) => {
              console.log(err);
              alert("비정상 적인 요청 경로로 입장했습니다.");
              navigate("/login");
            })
        )
        .catch((err) => {
          console.log(err)
          alert("현재 회원탈퇴가 불가능합니다, 죄송합니다.")
        })
    }
  }

  return (
    <ModifyContainer>
      <InfoWrapper>
        <ProfileImageWrapper>
          <label htmlFor="profileImage">
            <ProfileImage src={imageFile} alt="Profile Picture" />
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
        </ProfileImageWrapper>
        <ModifyInput1 id="nickname" type="text" value={changeInfo.nickname} onChange={onChangeNickNameInput} />

        <ButtonWrapper1>
          <ModifyButton1 onClick={onClickModifyButton}>회원정보 수정</ModifyButton1>
        </ButtonWrapper1>

        <ModifyInput2 id="curpassword" type="password" placeholder="현재 비밀번호" onChange={onChangeInputCurPW} />
        <ModifyInput2 id="password" type="password" placeholder="변경할 비밀번호" onChange={onChangeInputNewPW} />
        <ModifyInput2 id="passwordConfirm" type="password" placeholder="변경 비밀번호 확인" onChange={onChangeInputNewPWCheck} />

        <ButtonWrapper2>
          <ModifyButton2 onClick={onClickModifyPW}>비밀번호 수정</ModifyButton2>
          <UnregisterButton onClick={onClickWithdrawal}>탈퇴</UnregisterButton>
        </ButtonWrapper2>
      </InfoWrapper>
    </ModifyContainer>
  );
}

export default Modify;

// style
const ModifyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModifyInput1 = styled.input`
  border: 3px solid #6930c3;
  width: 400px;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #000;
  color: #fff;
  box-shadow: 0px 0px 5px #ccc;
  font-size: 20px;
`;

const ModifyInput2 = styled.input`
  border: 3px solid #6930c3;
  width: 400px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #000;
  color: #fff;
  box-shadow: 0px 0px 5px #ccc;
  font-size: 20px;
`;

const ButtonWrapper1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ButtonWrapper2 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ModifyButton1 = styled.button`
  background-color: #64dfdf;
  width: 160px;
  height: 50px;
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 50px;
  color: #6930c3;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #80ffdb;
  }
`;

const ModifyButton2 = styled.button`
  background-color: #64dfdf;
  width: 160px;
  height: 50px;
  padding: 10px 20px;
  margin-top: 20px;
  color: #6930c3;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #80ffdb;
  }
`;

const UnregisterButton = styled.button`
  width: 140px;
  height: 50px;
  padding: 10px 20px;
  margin-top: 20px;
  color: #fff;
  border: 3px solid #64dfdf;
  border-radius: 5px;
`;