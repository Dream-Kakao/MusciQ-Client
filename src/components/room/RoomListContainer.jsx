import styled from 'styled-components';
import RoomList from './RoomList';
import React, { useEffect, useState } from "react";

const Container = styled.div`
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  z-index: 1;
  position: relative;
  width: 100%;
  min-height: 80vh;
`;

const RoomListWrapper = styled.div`
  width: 75%;
  height: 70%;
  margin-bottom: 7%;
  position: absolute;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  margin-top: 10px;
  z-index: 1;
`;

const Button = styled.button`
  font-weight: bold;
  background-color: #64DFDF;
  color: #6930C3;
  border: none;
  padding: 10px 20px;
  margin-left: 12%; /* 변경된 부분 */
  margin-right: 12%;
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

const ArrowButton = styled.button`
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

const PageContainer = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
`;

const RoomListContainer = () => {

  const [page, setPage] = useState(1);

  const [rooms, setRooms] = useState([]);
  const [next, setNext] = useState();
  const [curPage, setCurPage] = useState(page);
  const [previous, setPrevious] = useState();

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:80/api/v1/rooms/all?page=${page}`);
    eventSource.onmessage = (event) => {
      const res = JSON.parse(event.data);
      
      if (res.statusCode === 'OK') {
        setRooms(res.body.data)
        setNext(res.body.next)
        setCurPage(res.body.number)
        setPrevious(res.body.previous)
      } else {
        // 교통사고 처리해야됨
        console.error(`Error: ${event.status}`);
      }
    };
    return () => {
      eventSource.close();
    };
  }, [page]);

  // 로그아웃 버튼 클릭 이벤트
  const onClickLogout = () => {
    alert("쿠키 부,,,부셔버렸~")
  }

  // 방 생성 버튼 클릭 이벤트
  const onClickCreateRoom = () => {
    alert("방 생성 페이지 만들어줘 이이이잉~~~")
  }

  // 다음 페이지 버튼 클릭 이벤트
  const onClickNext = async (next) => {
    if(next === true){
      setPage(page + 1);
    } else{
      alert("마지막 처럼, 마마마 마지막처럼~")
    }
  }

  // 이전 페이지 버튼 클릭 이벤트
  const onClickPrevious = async (previous) => {
    if(previous === true){
      setPage(page - 1);
    } else{
      alert("처음처럼~, 그날 참이슬 같던 너~")
    }
  }

  return (
    <Container className="container">
      <RoomListWrapper className="room-list-wrapper">
        <RoomList rooms={rooms}/>
      </RoomListWrapper>
      <PageContainer className="page-container">
        <ArrowButton className="arrow-button left-arrow" onClick={() => onClickPrevious(previous)}>◀</ArrowButton>
        <ArrowButton className="arrow-button right-arrow" onClick={() => onClickNext(next)}>▶</ArrowButton>
      </PageContainer>
      <ButtonContainer className="button-container">
        <Button className="logout-button" onClick={onClickLogout}>Logout</Button>
        <CenteredText className="centered-text">정채윤 바보 멍청이^0^</CenteredText>
        <Button className="create-room-button" onClick={onClickCreateRoom}>Create Room</Button>
      </ButtonContainer>
    </Container>
  );
};

export default RoomListContainer;