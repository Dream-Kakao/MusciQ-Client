import styled from 'styled-components';

const RoomListItemContainer = styled.div`
  background-color: #64DFDF;
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
    color: #6930C3;
    width: 100%;
    text-align: left;
    margin-left: 4%;
  }
`;

// 방 입장 메서드
const onClickRoom = () => {
    alert("방 입장 페이지 만들어줘 이이잉 ~")
}

const RoomListItem = (props) => {
    const { roomId, gameName, roomTitle } = props;

    return (
        <RoomListItemContainer onClick={onClickRoom}>
            <div>Room ID    :  {roomId}</div>
            <div>Game Name  :  {gameName}</div>
            <div>Room Title :  {roomTitle}</div>
        </RoomListItemContainer>
    );
};

export default RoomListItem;