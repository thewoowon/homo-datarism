"use client";

import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const EarthScene = dynamic(
  () => import("@/components/module/EarthScene/NewEarthScene"),
  {
    ssr: false,
  }
);

export default function Home() {
  // fadeOut 애니메이션을 적용한 후에는 컴포넌트를 제거합니다.
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <section
        style={{ width: "100vw", height: "100vh", position: "relative" }}
      >
        <EarthScene />
        <Warapper>
          <MainSearchInput type="text" placeholder="검색어를 입력하세요" />
        </Warapper>
      </section>
    </div>
  );
}

const Warapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainSearchInput = styled.input`
  width: 600px;
  height: 80px;
  padding: 0 20px;
  border-radius: 80px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 24px;
  padding: 0 40px;

  &::placeholder {
    color: #ffffff;
  }
`;
