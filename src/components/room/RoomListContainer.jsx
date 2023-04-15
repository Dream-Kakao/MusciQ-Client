import styled from 'styled-components';
import RoomList from './RoomList';

const Container = styled.div`
  background-color: black;
  color: white;
  padding: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 4px solid #6930C3;
  padding-bottom: 60px;
  flex-wrap: wrap; /* 수정한 부분 */
  z-index: 1;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  margin-top: 1px;
  z-index: 1;
`;

const Button = styled.button`
  background-color: #64DFDF;
  color: #6930C3;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 100px;
  &:hover {
    background-color: #80FFDB;
  }
`;

const CenteredText = styled.span`
  text-align: center;
  flex: 1;
`;

const RoomListContainer = () => {
  return (
    <Container>
      <RoomList/>
      <ButtonContainer>
        <Button>Logout</Button>
        <CenteredText>이현범 바보 멍청이^0^</CenteredText>
        <Button>Create Room</Button>
      </ButtonContainer>
    </Container>
  );
};

export default RoomListContainer;