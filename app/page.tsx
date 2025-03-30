"use client";

import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";

const EarthScene = dynamic(
  () => import("@/components/module/EarthScene/NewEarthScene"),
  {
    ssr: false,
  }
);

const SEARCH_RESULT: {
  label: string;
  lat: number;
  lng: number;
}[] = [
  {
    label: "서울",
    lat: 37.5665,
    lng: 126.978,
  },
  {
    label: "부산",
    lat: 35.1796,
    lng: 129.0756,
  },
  {
    label: "대구",
    lat: 35.8714,
    lng: 128.6014,
  },
  {
    label: "인천",
    lat: 37.4563,
    lng: 126.7052,
  },
  {
    label: "광주",
    lat: 35.1595,
    lng: 126.8526,
  },
  {
    label: "대전",
    lat: 36.3504,
    lng: 127.3845,
  },
  {
    label: "울산",
    lat: 35.5384,
    lng: 129.3114,
  },
  {
    label: "세종",
    lat: 36.4808,
    lng: 127.2892,
  },
  {
    label: "경기",
    lat: 37.4138,
    lng: 127.5183,
  },
  {
    label: "강원",
    lat: 37.8228,
    lng: 128.1555,
  },
  {
    label: "충북",
    lat: 36.8001,
    lng: 127.6645,
  },
  {
    label: "충남",
    lat: 36.5184,
    lng: 126.8,
  },
  {
    label: "전북",
    lat: 35.7175,
    lng: 127.153,
  },
  {
    label: "전남",
    lat: 34.8679,
    lng: 126.991,
  },
  {
    label: "경북",
    lat: 36.5769,
    lng: 128.5055,
  },
  {
    label: "경남",
    lat: 35.4606,
    lng: 128.2132,
  },
  {
    label: "제주",
    lat: 33.4996,
    lng: 126.5312,
  },
  {
    label: "해외",
    lat: 37.5665,
    lng: 126.978,
  },
];

export default function Home() {
  // fadeOut 애니메이션을 적용한 후에는 컴포넌트를 제거합니다.
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState<
    {
      label: string;
      lat: number;
      lng: number;
    }[]
  >([]);

  const [mode, setMode] = useState<"onboarding" | "normal">("onboarding");

  // 실제 처리 로직 (API 호출 등)
  const handleSearch = (query: string) => {
    console.log("🔍 검색어:", query);
    // 여기서 API 요청 등을 수행하면 됩니다
    setMode("normal");
  };

  // 디바운스된 함수 정의
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      handleSearch(value);
    }, 500), // 0.5초 대기
    []
  );

  // input 값이 바뀔 때마다 디바운스된 함수 실행
  useEffect(() => {
    if (input.trim() === "") return;
    debouncedSearch(input);

    // 언마운트되거나 input이 바뀌기 전 디바운스 취소
    return () => {
      debouncedSearch.cancel();
    };
  }, [input]);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <section
        style={{ width: "100vw", height: "100vh", position: "relative" }}
      >
        <EarthScene mode={mode} />
        <Warapper>
          <div>
            <Title>World Public Data, Refined for You</Title>
          </div>
          <MainSearchInput
            type="text"
            placeholder="what are you looking for?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
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
  flex-direction: column;
`;

const MainSearchInput = styled.input`
  width: 600px;
  height: 60px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  margin: 20px 0;
  background-color: #000011;
  font-size: 12px;
  padding: 0 20px;
  border: 1px solid #666666;
  color: #ffffff;

  &::placeholder {
    color: #666666;
    font-size: 14px;
  }

  &:focus {
    border: 1px solid #ffffff;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
