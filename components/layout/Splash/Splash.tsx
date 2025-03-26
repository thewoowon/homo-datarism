"use client";

import HomoDatarism from "@/components/svg/HomoDatarism";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

const Splash = () => {
  const [boarding, setBoarding] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBoarding(false);
    }, 5000);
  }, []);

  if (!boarding) {
    return null;
  }

  return (
    <Container>
      <HomoDatarism width={400} />
    </Container>
  );
};

export default Splash;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  z-index: 200;
  animation-name: fadeOut;
  animation-duration: 6s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;
