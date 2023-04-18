// 에러핸들링 하기위해 Input 컴포넌트 커스텀
import styled from "styled-components";

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

const InputField = ({ error, errorMessage, ...rest }) => {
  return (
    <InputWrapper>
      <Input error={error} {...rest} />
      {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </InputWrapper>
  );
};

export default InputField;
