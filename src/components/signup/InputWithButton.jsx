import React from "react";
import styled from "styled-components";

function InputWithButton({
  value,
  onChange,
  onClick,
  error,
  errorMessage,
  okMessage,
  ...rest
}) {
  return (
    <InputWrapper>
      <div>
        <Input value={value} onChange={onChange} error={error} {...rest} />
        <Button type="button" onClick={onClick}>
          확인
        </Button>
      </div>
      {error ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : (
        <OkMessage>{okMessage}</OkMessage>
      )}
    </InputWrapper>
  );
}

export default InputWithButton;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 300px;
  height: 50px;
  padding: 10px;
  border: 3px solid #6930c3;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 25px;
  background-color: #000;
  color: #fff;
`;

const Button = styled.button`
  height: 50px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  background-color: #6930c3;
  color: #fff;
  margin-top: 0;

  &:hover {
    background-color: #aa77ff;
  }
`;

const ErrorMessage = styled.span`
  position: absolute;
  top: 50px;
  left: 0;
  right: -350px;
  font-size: 13px;
  color: #f00;
  text-align: left;
`;

const OkMessage = styled.span`
  position: absolute;
  top: 50px;
  left: 0;
  right: -350px;
  font-size: 13px;
  color: #80ffdb;
  text-align: left;
`;