"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
// import GUI from "lil-gui";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphere/fragment.glsl";

/**
 * 🌍 Earth Component
 */
const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load textures
  const [dayTexture, nightTexture, specularCloudsTexture] = useTexture([
    "/images/static/earth/day.jpg",
    "/images/static/earth/night.jpg",
    "/images/static/earth/specularClouds.jpg",
  ]);

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  dayTexture.anisotropy = 8;
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.anisotropy = 8;
  specularCloudsTexture.anisotropy = 8;

  // GUI Parameters
  const [atmosphereDayColor] = useState("#00aaff");
  const [atmosphereTwilightColor] = useState("#ff6600");
  const [phi] = useState(Math.PI * 0.5);
  const [theta] = useState(0.5);
  const sunDirection = new THREE.Vector3();
  const sunSpherical = new THREE.Spherical(1, phi, theta);
  sunDirection.setFromSpherical(sunSpherical);

  // 🌍 Earth ShaderMaterial
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms: {
      uDayTexture: { value: dayTexture },
      uNightTexture: { value: nightTexture },
      uSpecularCloudsTexture: { value: specularCloudsTexture },
      uSunDirection: { value: sunDirection },
      uAtmosphereDayColor: { value: new THREE.Color(atmosphereDayColor) },
      uAtmosphereTwilightColor: {
        value: new THREE.Color(atmosphereTwilightColor),
      },
    },
  });

  // 🌌 Atmosphere ShaderMaterial
  const atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
      uSunDirection: { value: sunDirection },
      uAtmosphereDayColor: { value: new THREE.Color(atmosphereDayColor) },
      uAtmosphereTwilightColor: {
        value: new THREE.Color(atmosphereTwilightColor),
      },
    },
  });

  // Animation Loop
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    sunDirection.setFromSpherical(sunSpherical);

    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    earthMaterial.uniforms.uAtmosphereDayColor.value.set(atmosphereDayColor);
    earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(
      atmosphereTwilightColor
    );

    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
      atmosphereDayColor
    );
    atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(
      atmosphereTwilightColor
    );
  });

  // // GUI
  // useEffect(() => {
  //   const gui = new GUI();
  //   gui
  //     .addColor({ atmosphereDayColor }, "atmosphereDayColor")
  //     .onChange(setAtmosphereDayColor);
  //   gui
  //     .addColor({ atmosphereTwilightColor }, "atmosphereTwilightColor")
  //     .onChange(setAtmosphereTwilightColor);
  //   gui.add({ phi }, "phi", 0, Math.PI).onChange(setPhi);
  //   gui.add({ theta }, "theta", -Math.PI, Math.PI).onChange(setTheta);
  //   return () => gui.destroy();
  // }, []);

  return (
    <>
      {/* 🌍 Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* 🌌 Atmosphere */}
      <mesh ref={atmosphereRef} scale={1.04}>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </>
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
const EarthScene: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [12, 5, 4], fov: 15 }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Earth */}
      <Earth />

      {/* Controls */}
      <OrbitControls enableDamping enableZoom={false} />
      {/* Scene Setup */}
      <SceneSetup />
    </Canvas>
  );
};

export default EarthScene;
