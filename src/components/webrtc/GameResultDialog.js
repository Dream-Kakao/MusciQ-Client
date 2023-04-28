import * as React from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    props.handlePlayMusic();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AnswerButton
        disabled={props.answer === false}
        variant="outlined"
        onClick={handleClickOpen}
      >
        정답
      </AnswerButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
      >
        <DialogTitle>{"🎉 게임 결과 🎉"}</DialogTitle>
        <DialogContent>
          {/* <GameResultTable id="alert-dialog-slide-description" /> */}
          <p>
            <span style={{ color: "#80FFDB" }}>{props.winnerName}</span>
            <span style={{ color: "white" }}>승리!</span>
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const AnswerButton = styled.button`
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border-radius: 5px;
  background: #6930c3;
  font-weight: bold;
  font-size: 20px;
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #80ffdb;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;
