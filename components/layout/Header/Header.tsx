import styled from "@emotion/styled";

const Header = () => {
  return (
    <Container>
      <Wrapper>{/* <Logo width={100} /> */}</Wrapper>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  padding: 20px 16px;
  height: 57px;
  background-color: #000;
  z-index: 100;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;
