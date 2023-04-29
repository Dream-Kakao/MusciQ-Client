import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

// logic
function MyPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [imageFile, setImageFile] = useState();

  useEffect(() => {
    const userId = sessionStorage.getItem("UserID");
    const url = `${process.env.REACT_APP_API_URL_V1}members/member/${userId}`;

    fetch(url, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setUser(res.data);
        setImageFile(res.data.profile_img.path + res.data.profile_img.uuid + res.data.profile_img.profile_img);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const onClickModify = () => {
    navigate(`/modify`);
  };

  return (
    <div>
      <MyPageContainer>
        <Wrapper>
          <ProfileImage src={imageFile} alt="Profile Picture" />
          <Record>🎉{user.games_count}전 {user.win_count}승🎉</Record>
        </Wrapper>

        <InfoWrapper>
          <IdLabel>ID </IdLabel>
          <Id>{user.id}</Id>

          <EmailLabel>E-mail </EmailLabel>
          <Email>{user.email}</Email>

          <NicknameLabel>Nickname </NicknameLabel>
          <Nickname>{user.nickname}</Nickname>
        </InfoWrapper>
      </MyPageContainer>
      <ModifyButton onClick={onClickModify}>정보 수정</ModifyButton>
    </div>
  );
}

export default MyPage;

// style
const MyPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  margin-right: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const Record = styled.h1`
  font-size: 35px;
  font-weight: bold;
  margin-top: 10px;
  color: #64dfdf;
`;

const InfoWrapper = styled.div`
  margin-left: 40px;
  flex-direction: row;
`;

const IdLabel = styled.span`
  font-size: 25px;
  color: #6930c3;
`;

const Id = styled.p`
  font-size: 20px;
  color: #fff;
  border-bottom: 4px solid #6930c3;
  margin-bottom: 20px;
`;

const EmailLabel = styled.span`
  font-size: 25px;
  color: #6930c3;
`;

const Email = styled.p`
  font-size: 20px;
  color: #fff;
  border-bottom: 4px solid #6930c3;
  margin-bottom: 20px;
`;

const NicknameLabel = styled.span`
  font-size: 25px;
  color: #6930c3;
`;

const Nickname = styled.p`
  font-size: 20px;
  color: #fff;
  border-bottom: 4px solid #6930c3;
  margin-bottom: 20px;
`;

const ModifyButton = styled.button`
  display: block;
  margin: 0 auto;
  background-color: #64dfdf;
  width: 140px;
  height: 50px;
  padding: 10px 20px;
  margin-top: 10px;
  margin-right: auto;
  color: #6930c3;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 800;

  &:hover {
    background-color: #80ffdb;
  }
`;