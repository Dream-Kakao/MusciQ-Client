import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const RoomListItem = (props) => {
  const navigate = useNavigate();
  const { roomId, gameName, roomTitle } = props;

  // 방 입장 메서드
  const onClickRoom = (roomId) => {
    localStorage.setItem("sessionID", roomId);
    navigate("/openvidu");
  };

  return (
    <RoomListItemContainer onClick={() => onClickRoom(roomId)}>
      <div>Game Name : {gameName}</div>
      <div>Room Title : {roomTitle}</div>
    </RoomListItemContainer>
  );
};

export default RoomListItem;

const RoomListItemContainer = styled.div`
  background-color: #64dfdf;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  text-align: center;
  cursor: pointer;

  div {
    display: flex;
    font-weight: bold;
    font-size: 100%;
    color: #6930c3;
    width: 100%;
    text-align: left;
    margin-left: 4%;
  }
`;
