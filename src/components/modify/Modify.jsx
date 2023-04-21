import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import styled from "styled-components";

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
  font-size: 20px;

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
  font-size: 20px;

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
  font-size: 20px;
`;

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
  const [nickname, setNickname] = useState();
  const [path, setPath] = useState();
  const [uuid, setUuid] = useState();
  const [profile_img, setProfile_Img] = useState();

  // 현재 이미지
  const [imageFile, setImageFile] = useState();

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
        // setChangeInfo({
        //   ...changeInfo,
        //   nickname: res.data.nickname,
        //   memberImage: {
        //     uuid: res.data.profile_img.uuid,
        //     path: res.data.profile_img.path,
        //     profile_img: res.data.profile_img.profile_img
        //   }
        // })
        setNickname(res.data.nickname)
        setPath(res.data.profile_img.path)
        setUuid(res.data.profile_img.uuid)
        setProfile_Img(res.data.profile_img.profile_img)
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
    // setChangeInfo({
    //   ...changeInfo,
    //   nickname: e.target.value
    // })
    setNickname(e.target.value)
  }

  // 이미지 업로드 요청
  const uploadS3 = () => {
    console.log(postImage)
    const url = `${process.env.REACT_APP_API_URL_V1}members/member/upload/S3`;
    const formData = new FormData();

    if (postImage) {
      formData.append('uploadFile', postImage);
    }

    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        // setChangeInfo({
        //   ...changeInfo,
        //   memberImage: {
        //     uuid: res.uuid,
        //     path: res.path,
        //     profile_img: res.profile_img
        //   }
        // })
        setPath(res.path)
        setUuid(res.uuid)
        setProfile_Img(res.profile_img)
        
      })
      .catch((error) => {
        alert("현재 이미지 업로드가 불가능합니다, 죄송합니다.")
        //navigate('/roomlist')
      })
  }

  // 회원 정보 수정 요청
  const changeMemberInfo = () => {
    const userId = localStorage.getItem("UserID");
    const url = `${process.env.REACT_APP_API_URL_V1}members/member/${userId}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        nickname: nickname,
        memberImage:{
          uuid: uuid,
          path: path,
          profile_img: profile_img
        }
      }),

    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res)
      })
  }

  // 회원정보 수정
  const onClickModifyButton = () => {
    if (window.confirm("입력하신 정보로 회원 정보를 수정합니다.")) {
      if (postImage != null) {
        uploadS3()
        changeMemberInfo()
        
      } else {
        // 이미지 업로드 하지 않은 경우에 닉네임만 수정 요청하도록 지정
        changeMemberInfo();
        alert("회원 정보 수정 완료.");
      }
    }
  }
  
  return (
    <ModifyContainer>
      <InfoWrapper>
        <ProfileImageWrapper>
          <label htmlFor="profileImage">
            <ProfileImage src={imageFile} alt="Profile Picture"/>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
        </ProfileImageWrapper>
        <ModifyInput1 id="nickname" type="text" value={nickname} onChange={onChangeNickNameInput} />

        <ButtonWrapper1>
          <ModifyButton1 onClick={onClickModifyButton}>회원정보 수정</ModifyButton1>
        </ButtonWrapper1>

        <ModifyInput2 id="password" type="password" placeholder="Password" />
        <ModifyInput2
          id="passwordConfirm"
          type="password"
          placeholder="Password 확인"
        />

        <ButtonWrapper2>
          <ModifyButton2>비밀번호 수정</ModifyButton2>
          <UnregisterButton>탈퇴</UnregisterButton>
        </ButtonWrapper2>
      </InfoWrapper>
    </ModifyContainer>
  );
}

export default Modify;
