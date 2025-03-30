import { latLonToXYZ } from "@/utils";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import { useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const HurricaneLayer: React.FC<{ lat: number; lon: number }> = ({
  lat,
  lon,
}) => {
  const hurricaneRef = useRef<THREE.Mesh>(null);
  const hurricaneTexture = useTexture("/images/static/earth/hurricane.png"); // 태풍 텍스처 로드
  const position = latLonToXYZ(2.05, lat, lon); // 특정 위치에 배치

  useEffect(() => {
    if (!hurricaneRef.current) return;
    gsap.fromTo(
      hurricaneRef.current.rotation,
      { z: 0 },
      { z: Math.PI * 2, duration: 5, repeat: -1, ease: "linear" }
    ); // 태풍 회전 애니메이션
  }, []);

  return (
    <mesh ref={hurricaneRef} position={position} scale={0.3}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshStandardMaterial
        map={hurricaneTexture}
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </mesh>
  );
};

export default HurricaneLayer;
