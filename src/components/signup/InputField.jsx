import styled from "styled-components";

const InputField = ({ error, errorMessage, ...rest }) => {
  return (
    <InputWrapper>
      <Input error={error} {...rest} />
      {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </InputWrapper>
  );
};

export default InputField;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  border: 3px solid #6930c3;
  width: 378px;
  height: 50px;
  padding: 10px;
  margin-bottom: 25px;
  border-radius: 5px;
  background-color: #000;
  color: #fff;
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