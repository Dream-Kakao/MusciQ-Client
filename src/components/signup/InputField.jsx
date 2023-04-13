// 에러핸들링 하기위해 Input 컴포넌트 커스텀
import styled from "styled-components";

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  border: 1px solid;
  padding: 10px;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.span`
  position: absolute;
  top: 0;
  right: -250px;
  font-size: 10px;
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
