import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const CloudLayer: React.FC = () => {
  const cloudRef = useRef<THREE.Mesh>(null);
  const cloudTexture = useTexture("/images/static/earth/clouds.jpg"); // 구름 텍스처 로드
  cloudTexture.anisotropy = 8;
  cloudTexture.colorSpace = THREE.SRGBColorSpace;
  cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

  useFrame(({ clock }) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = clock.getElapsedTime() * 0.02; // 구름 회전 애니메이션
    }
  });

  return (
    <mesh ref={cloudRef} scale={1.03}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={cloudTexture}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </mesh>
  );
};

export default CloudLayer;
