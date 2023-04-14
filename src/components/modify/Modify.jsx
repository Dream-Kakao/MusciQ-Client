import React from "react";
import styled from "styled-components";

import default_profile from "../../img/default_profile.png";

// style
const ModifyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ProfileImageWrapper = styled.div`
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

const InfoWrapper = styled.div`
  display: flex;
  margin-left: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModifyInput = styled.input`
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

const BuffonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ModifyButton = styled.button`
  background-color: #64dfdf;
  width: 140px;
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
  return (
    <ModifyContainer>
      <ProfileImageWrapper>
        <ProfileImage src={default_profile} alt="Profile Picture" />
      </ProfileImageWrapper>

      <InfoWrapper>
        <ModifyInput id="nickname" type="text" value="원래 Nickname" />
        <ModifyInput id="password" type="password" placeholder="Password" />
        <ModifyInput
          id="passwordConfirm"
          type="password"
          placeholder="Password 확인"
        />

        <BuffonWrapper>
          <ModifyButton>수정</ModifyButton>
          <UnregisterButton>탈퇴</UnregisterButton>
        </BuffonWrapper>
      </InfoWrapper>
    </ModifyContainer>
  );
}

export default Modify;
