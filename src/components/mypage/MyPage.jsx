import React from "react";
import styled from "styled-components";

import default_profile from "../../img/default_profile.png";

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
  margin-bottom: 10px;
  margin-top: 10px;
  color: #64dfdf;
`;

const InfoWrapper = styled.div`
  margin-left: 40px;
  flex-direction: row;
`;

const IdLabel = styled.span`
  font-size: 25px;
  margin-right: 5px;
  color: #6930c3;
`;

const Id = styled.p`
  font-size: 20px;
  margin-bottom: 5px;
  color: #fff;
`;

const EmailLabel = styled.span`
  font-size: 25px;
  margin-bottom: 5px;
  color: #6930c3;
`;

const Email = styled.p`
  font-size: 20px;
  margin-bottom: 5px;
  color: #fff;
`;

const NicknameLabel = styled.span`
  font-size: 25px;
  color: #6930c3;
`;

const Nickname = styled.p`
  font-size: 20px;
  color: #fff;
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

  &:hover {
    background-color: #80ffdb;
  }
`;

// logic
function MyPage() {
  return (
    <div>
      <MyPageContainer>
        <Wrapper>
          <ProfileImage src={default_profile} alt="Profile Picture" />
          <Record>🎉100전 100승🎉</Record>
        </Wrapper>

        <InfoWrapper>
          <IdLabel>ID </IdLabel>
          <Id>나는 아이디</Id>

          <EmailLabel>E-mail </EmailLabel>
          <Email>john.doe@example.com</Email>

          <NicknameLabel>Nickname </NicknameLabel>
          <Nickname>나는 닉네임</Nickname>
        </InfoWrapper>
      </MyPageContainer>
      <ModifyButton>정보 수정</ModifyButton>
    </div>
  );
}

export default MyPage;
