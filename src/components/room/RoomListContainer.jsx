import styled from "styled-components";
import RoomList from "./RoomList";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "./CreateRoomModal";

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
  background-color: #64dfdf;
  color: #6930c3;
  border: none;
  padding: 10px 20px;
  margin-left: 12%; /* 변경된 부분 */
  margin-right: 12%;
  cursor: pointer;
  border-radius: 100px;
  &:hover {
    background-color: #80ffdb;
  }
`;

const CenteredText = styled.span`
  text-align: center;
  flex: 1;
`;

const ArrowButton = styled.button`
  background-color: #64dfdf;
  color: #6930c3;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 100px;
  &:hover {
    background-color: #80ffdb;
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
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [rooms, setRooms] = useState([]);
  const [next, setNext] = useState();
  const [curPage, setCurPage] = useState(page);
  const [previous, setPrevious] = useState();

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.REACT_APP_API_URL_V1}rooms/all?page=${page}`,
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = (event) => {
      const res = JSON.parse(event.data);

      if (res.statusCode === "OK") {
        console.log(res.body.data);
        setRooms(res.body.data);
        setNext(res.body.next);
        setCurPage(res.body.number);
        setPrevious(res.body.previous);
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
    fetch(`${process.env.REACT_APP_API_URL_V1}members/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const success = data.success;
        if (success) {
          localStorage.removeItem("Auth");
          localStorage.removeItem("AuthExpiration");
          alert("로그 아웃 성공!");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("비정상 적인 요청 경로로 입장했습니다.");
        navigate("/login");
      });
  };

  // 방 생성 버튼 클릭 이벤트
  const onClickCreateRoom = () => {
    alert("방 생성 페이지 만들어줘~");
  };

  // 다음 페이지 버튼 클릭 이벤트
  const onClickNext = async (next) => {
    if (next === true) {
      setPage(page + 1);
    } else {
      alert("마지막 페이지 입니다.");
    }
  };

  // 이전 페이지 버튼 클릭 이벤트
  const onClickPrevious = async (previous) => {
    if (previous === true) {
      setPage(page - 1);
    } else {
      alert("첫번째 페이지 입니다.");
    }
  };

  return (
    <Container className="container">
      <RoomListWrapper className="room-list-wrapper">
        <RoomList rooms={rooms} />
      </RoomListWrapper>
      <PageContainer className="page-container">
        <ArrowButton
          className="arrow-button left-arrow"
          onClick={() => onClickPrevious(previous)}
        >
          ◀
        </ArrowButton>
        <ArrowButton
          className="arrow-button right-arrow"
          onClick={() => onClickNext(next)}
        >
          ▶
        </ArrowButton>
      </PageContainer>
      <ButtonContainer className="button-container">
        <Button className="logout-button" onClick={onClickLogout}>
          Logout
        </Button>
        <CenteredText className="centered-text"></CenteredText>
        <CreateRoomModal />
      </ButtonContainer>
    </Container>
  );
};

export default RoomListContainer;
