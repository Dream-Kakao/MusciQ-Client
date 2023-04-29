import styled from "styled-components";
import RoomListItem from "./RoomListItem";

const RoomList = (props) => {
  const rooms = [];

  for (let i = 0; i < props.rooms.length; i++) {
    const { roomId, gameName, roomTitle } = props.rooms[i];
    rooms.push(
      <RoomListItem
        key={i}
        roomId={roomId}
        gameName={gameName}
        roomTitle={roomTitle}
      /> // 변경된 코드
    );
  }

  return (
    <RoomListContainer id="room-list-container">{rooms}</RoomListContainer>
  );
};

export default RoomList;

const RoomListContainer = styled.div`
  display: inline-grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 6%;
  padding: 50px;
  width: 100%;
  height: 100%;
  border: 4px solid #6930c3; /* border 속성 추가 */
`;
