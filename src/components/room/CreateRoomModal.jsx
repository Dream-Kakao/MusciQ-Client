import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FormDialog() {
  const [open, setOpen] = useState(false); // Dialog의 open 여부를 관리하는 state 변수
  const [roomName, setRoomName] = useState(""); // 방 제목을 관리하는 state 변수
  const [gameType, setGameType] = useState("낭독퀴즈"); // 게임 종류를 관리하는 state 변수
  const [sessionId, setSessionId] = useState("");

  const navigate = useNavigate();

  const handleClickOpen = async () => {
    setOpen(true); // 모달창 먼저 열기

    try {
      const sessionId = await axios.post(
        `${process.env.REACT_APP_API_URL_V1}rooms/create`,
        {},
        { withCredentials: true }
      );
      setSessionId(sessionId.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGameTypeChange = (e) => {
    setGameType(e.target.value);
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleCreate = async () => {
    try {
      localStorage.setItem("sessionID", sessionId);
      setOpen(false);
      navigate("/openvidu");
    } catch (error) {
      console.log(error);
    }
  };

  const isRoomNameEmpty = roomName === "";

  return (
    <div>
      <CreateRoomButton variant="outlined" onClick={handleClickOpen}>
        방 생성
      </CreateRoomButton>
      <CustomDialog open={open} onClose={handleClose}>
        <DialogTitle>방 생성</DialogTitle>
        <DialogContent>
          <RoomName
            autoFocus
            margin="dense"
            id="roomName"
            label="방 제목"
            type="text"
            fullWidth
            variant="outlined"
            value={roomName}
            onChange={handleRoomNameChange}
          />
          <Box sx={{ minWidth: 120 }}>
            <StyledFormControl fullWidth>
              <InputLabel id="gameType">게임장르</InputLabel>
              <StyledSelect
                labelId="gameType"
                id="gameSelect"
                value={gameType}
                label="게임종류"
                onChange={handleGameTypeChange}
              >
                <StyledMenuItem value={"낭독퀴즈"}>낭독퀴즈</StyledMenuItem>
              </StyledSelect>
            </StyledFormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <DialogCreateButton onClick={handleCreate} disabled={isRoomNameEmpty}>
            생성
          </DialogCreateButton>
          <DialogCancelButton onClick={handleClose}>취소</DialogCancelButton>
        </DialogActions>
      </CustomDialog>
    </div>
  );
}

const StyledMenuItem = styled(MenuItem)`
  && {
    color: #64dfdf;
    background-color: #252525;
    &:hover {
      background-color: #64dfdf;
      color: #6930c3;
    }
    &:focus {
      outline: 2px solid #64dfdf;
    }
  }
`;

const StyledFormControl = styled(FormControl)`
  && {
    width: 100%;
    margin-top: 16px;

    /* outline 색상 변경 */
    &:not(.Mui-focused) .MuiOutlinedInput-notchedOutline {
      border-color: #64dfdf;
    }
    &:not(.Mui-focused) .MuiInputLabel-outlined {
      color: #6930c3;
    }
    /* 포커싱됬을 때 outline 색상 변경 */
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #6930c3;
    }
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: orange;
    }
  }
  }
`;

const StyledSelect = styled(Select)`
  && {
    border-radius: 4px;
    background-color: #252525;
    color: #64dfdf;

    border: 1px solid #252525;
  }

  &:focus {
    background-color: #e0e0e0;
  }

  label {
    color: #6930c3;
  }
`;

const CreateRoomButton = styled.button`
  background-color: #64dfdf;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 100px;
  font-weight: bold;
  color: #6930c3;

  &:hover {
    background-color: #80ffdb;
  }
`;

const CustomDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #252525;
    border: 1px solid black;
    border-radius: 8px;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.3);
  }

  .MuiDialogTitle-root {
    background-color: #64dfdf;
    color: #6930c3;
    font-weight: bold;
    font-size: 20px;
  }

  .MuiDialogContent-root {
    padding: 24px;
    font-size: 16px;
    line-height: 1.5;
    color: white;
  }

  .MuiDialogActions-root {
    padding: 16px;
  }

  .MuiButton-containedPrimary {
    color: white;
    background-color: #007bff;
    &:hover {
      background-color: #0069d9;
    }
  }
`;

const DialogCreateButton = styled(Button)`
  && {
    width: 20%;
    height: auto;
    background: #64dfdf;
    border: 2px solid #64dfdf;
    border-radius: 100px;
    font-weight: bold;
    font-size: 16px;
    color: #6930c3;
  }
`;

const DialogCancelButton = styled(Button)`
  && {
    width: 20%;
    height: auto;
    background: #64dfdf;
    border: 2px solid #64dfdf;
    border-radius: 100px;
    font-weight: bold;
    font-size: 16px;
    color: #6930c3;
  }
`;

const RoomName = styled(TextField)`
  label.Mui-focused {
    color: #6930c3;
  }
  .MuiOutlinedInput-root {
    color: white;
    &:hover fieldset {
      border-color: #6930c3;
    }
    &.Mui-focused fieldset {
      border-color: #6930c3;
    }
  }
  & .MuiInputBase-input {
    color: #64dfdf; // 바꾸고 싶은 색상으로 변경
  }

  & .MuiOutlinedInput-notchedOutline {
    border-color: #64dfdf; /* 원하는 색상으로 변경 */
  }

  label {
    color: #6930c3;
  }

  margin-bottom: 20px;
`;