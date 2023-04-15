import styled from 'styled-components';
import { useState } from 'react';

const RoomListContainer = styled.div`
  display: inline-grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 50px;
  width: 100%; /* RoomListContainer의 크기를 고정 */
`;

const Room = styled.div`
  background-color: #64DFDF;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  border-radius: 10px;
  height: 150px; /* 높이를 150px로 지정 */
  width: 100%; 
`;

const Button = styled.button`
  background-color: #64DFDF;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  height : ;
  width: 100px; /* Room 컴포넌트의 width와 height를 100%로 지정 */
  &:hover {
    background-color: #80FFDB;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin-top: 20px;
  align-items: center;
`;

const RoomList = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleLeftButtonClick = () => {
    const container = document.getElementById('room-list-container');
    container.scrollBy({ left: -200, behavior: 'smooth' });
    setScrollPosition(container.scrollLeft - 200);
  };

  const handleRightButtonClick = () => {
    const container = document.getElementById('room-list-container');
    container.scrollBy({ left: 200, behavior: 'smooth' });
    setScrollPosition(container.scrollLeft + 200);
  };

  return (
    <>
      <RoomListContainer id="room-list-container">
        <Room>Room 1</Room>
        <Room>Room 2</Room>
        <Room>Room 3</Room>
        <Room>Room 4</Room>
        <Room>Room 5</Room>
        <Room>Room 6</Room>
      </RoomListContainer>

      <Container>
        <Button onClick={handleLeftButtonClick} disabled={scrollPosition <= 0}>
          {'<'}
        </Button>
        <Button onClick={handleRightButtonClick} disabled={scrollPosition >= 200}>
          {'>'}
        </Button>
      </Container>
    </>
  );
};

export default RoomList;