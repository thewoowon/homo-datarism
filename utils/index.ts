import * as THREE from "three";

export const latLonToXYZ = (radius: number, lat: number, lon: number) => {
  const phi = THREE.MathUtils.degToRad(90 - lat); // 위도를 radian으로 변환
  const theta = THREE.MathUtils.degToRad(lon); // 경도를 radian으로 변환

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};
