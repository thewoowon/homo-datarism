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
import { latLonToXYZ } from "@/utils";
import { gsap } from "gsap";
import GridLayer from "../layers/Grid";
import CloudLayer from "../layers/Cloud";

const Marker: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const markerRef = useRef<THREE.Mesh>(null);
  const position = latLonToXYZ(2.05, lat, lon); // 지구 반지름보다 약간 바깥쪽에 위치

  return (
    <mesh ref={markerRef} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="red"
        emissive="red"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
};

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
      {/* <GridLayer /> */}
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

type EarthSceneProps = {
  mode: "onboarding" | "normal";
};

/**
 * 🎥 Scene & Renderer
 */
const EarthScene = ({ mode }: EarthSceneProps) => {
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const [context, setContext] = useState<{
    fov: number;
    position: [number, number, number];
  }>({
    fov: 15,
    position: [12, 5, 4],
  });
  useEffect(() => {
    if (mode === "normal" && camera.current) {
      console.log("🌍 EarthScene: mode changed to normal");

      gsap.to(camera.current, {
        fov: 40,
        duration: 2,
        onUpdate: () => {
          camera.current!.updateProjectionMatrix();
        },
      });

      gsap.to(camera.current!.position, {
        x: 10,
        y: 5,
        z: 3,
        duration: 2,
      });
    }
  }, [mode]);

  return (
    <Canvas
      camera={{ position: context.position, fov: context.fov }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera: createdCamera }) => {
        camera.current = createdCamera as THREE.PerspectiveCamera;
      }}
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
