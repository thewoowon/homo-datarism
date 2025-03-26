"use client";

import {
  Canvas,
  useFrame,
  useLoader,
  extend,
  useThree,
} from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";

/**
 * 🌍 Earth Material (ShaderMaterial)
 */
const EarthMaterial = shaderMaterial(
  {
    uDayTexture: new THREE.Texture(),
    uNightTexture: new THREE.Texture(),
    uSpecularCloudsTexture: new THREE.Texture(),
    uSunDirection: new THREE.Vector3(0, 0, 1),
    uAtmosphereDayColor: new THREE.Color("#00aaff"),
    uAtmosphereTwilightColor: new THREE.Color("#ff6600"),
  },
  earthVertexShader as string,
  earthFragmentShader as string
);

/**
 * 🌌 Atmosphere Material
 */
const AtmosphereMaterial = shaderMaterial(
  {
    uSunDirection: new THREE.Vector3(0, 0, 1),
    uAtmosphereDayColor: new THREE.Color("#00aaff"),
    uAtmosphereTwilightColor: new THREE.Color("#ff6600"),
  },
  atmosphereVertexShader as string,
  atmosphereFragmentShader as string
);

// Three.js에서 확장 선언
extend({ EarthMaterial, AtmosphereMaterial });

/**
 * 🌍 Earth Component
 */
const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);

  // Load Textures
  const dayTexture = useLoader(
    THREE.TextureLoader,
    "/images/static/earth/day.jpg"
  );

  const nightTexture = useLoader(
    THREE.TextureLoader,
    "/images/static/earth/night.jpg"
  );

  const specularCloudsTexture = useLoader(
    THREE.TextureLoader,
    "/images/static/earth/specularClouds.jpg"
  );

  // Controls (UI 조절)
  const { atmosphereDayColor, atmosphereTwilightColor, phi, theta } =
    useControls("Earth Settings", {
      atmosphereDayColor: "#00aaff",
      atmosphereTwilightColor: "#ff6600",
      phi: { value: Math.PI * 0.5, min: 0, max: Math.PI },
      theta: { value: 0.5, min: -Math.PI, max: Math.PI },
    });

  const sunDirection = new THREE.Vector3();
  const sunSpherical = new THREE.Spherical(1, phi, theta);
  sunDirection.setFromSpherical(sunSpherical);

  // 🌍 Earth Material 생성 (useMemo 사용)
  const earthMaterial = useMemo(() => {
    const material = new EarthMaterial();
    material.uniforms.uDayTexture.value = dayTexture;
    material.uniforms.uNightTexture.value = nightTexture;
    material.uniforms.uSpecularCloudsTexture.value = specularCloudsTexture;
    return material;
  }, [dayTexture, nightTexture, specularCloudsTexture]);

  // 🌌 Atmosphere Material 생성
  const atmosphereMaterial = useMemo(() => {
    return new AtmosphereMaterial();
  }, []);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }

    if (earthMaterial) {
      earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
      earthMaterial.uniforms.uAtmosphereDayColor.value.set(atmosphereDayColor);
      earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(
        atmosphereTwilightColor
      );
    }

    if (atmosphereMaterial) {
      atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
      atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
        atmosphereDayColor
      );
      atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(
        atmosphereTwilightColor
      );
    }
  });

  return (
    <>
      {/* 🌍 Earth Mesh */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* 🌌 Atmosphere Mesh */}
      <mesh ref={atmosphereRef} scale={1.04}>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </>
  );
};

/**
 * 🌞 Sun Debug Sphere
 */
const SunDebug = () => {
  const { phi, theta } = useControls("Earth Settings", {
    phi: { value: Math.PI * 0.5, min: 0, max: Math.PI },
    theta: { value: 0.5, min: -Math.PI, max: Math.PI },
  });

  const sunDirection = new THREE.Vector3();
  const sunSpherical = new THREE.Spherical(1, phi, theta);
  sunDirection.setFromSpherical(sunSpherical);

  return (
    <mesh position={sunDirection.clone().multiplyScalar(5)}>
      <icosahedronGeometry args={[0.1, 2]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
};

const SceneSetup = () => {
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor("#000011");
  }, [gl]);

  return null;
};

/**
 * 🎥 Scene & Renderer
 */
const EarthScene = () => {
  return (
    <Canvas
      camera={{ position: [12, 5, 4], fov: 25 }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: true }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Scene Setup */}
      <SceneSetup />

      {/* Earth */}
      <Earth />

      {/* Sun Debug */}
      <SunDebug />

      {/* Controls */}
      <OrbitControls enableDamping />
    </Canvas>
  );
};

export default EarthScene;
