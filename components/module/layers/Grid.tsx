import { useRef } from "react";
import * as THREE from "three";

const GridLayer: React.FC = () => {
  const gridRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={gridRef} scale={1.05}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial color="white" wireframe transparent opacity={0.5} />
    </mesh>
  );
};

export default GridLayer;
