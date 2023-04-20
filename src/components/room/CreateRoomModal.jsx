import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import Input from "@mui/material/Input";

const CustomInput = styled(Input)`
  $$ {
    color: white;
    border: 2px solid #64dfdf;
  }
`;

const CreateRoomButton = styled(Button)`
  && {
    width: 100%;
    height: auto;
    background: #64dfdf;
    border: 2px solid #64dfdf;
    border-radius: 100px;
    font-weight: bold;
    font-size: 16px;
    color: #6930c3;
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

const CustomDialogContentText = styled(DialogContentText)`
  /* 여기에 스타일을 추가합니다. */
  && {
    color: white;
  }
`;

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <CreateRoomButton variant="outlined" onClick={handleClickOpen}>
        방 생성
      </CreateRoomButton>
      <CustomDialog open={open} onClose={handleClose}>
        <DialogTitle>방 생성</DialogTitle>
        <DialogContent>
          <CustomDialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </CustomDialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <CustomInput placeholder="방 제목을 적어주세요." />
        </DialogContent>
        <DialogActions>
          <DialogCancelButton onClick={handleClose}>취소</DialogCancelButton>
          <DialogCreateButton onClick={handleClose}>생성</DialogCreateButton>
        </DialogActions>
      </CustomDialog>
    </div>
  );
}
