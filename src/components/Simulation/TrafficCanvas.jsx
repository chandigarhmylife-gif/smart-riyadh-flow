import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Vehicle({ position, color, direction, speed }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current && speed > 0) {
      const movement = speed * delta * 2;
      if (direction === 'north') meshRef.current.position.z -= movement;
      if (direction === 'south') meshRef.current.position.z += movement;
      if (direction === 'east') meshRef.current.position.x += movement;
      if (direction === 'west') meshRef.current.position.x -= movement;
    }
  });

  const rotation = direction === 'north' || direction === 'south' ? [0, 0, 0] : [0, Math.PI / 2, 0];

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.4, 0.3, 0.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function TrafficLight({ position, state, direction }) {
  const colors = {
    red: '#EF4444',
    yellow: '#F59E0B',
    green: '#10B981'
  };

  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      <mesh position={[0, 1.2, 0.06]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={state === 'red' ? colors.red : '#374151'} />
      </mesh>
      <mesh position={[0, 1, 0.06]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={state === 'yellow' ? colors.yellow : '#374151'} />
      </mesh>
      <mesh position={[0, 0.8, 0.06]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={state === 'green' ? colors.green : '#374151'} />
      </mesh>
    </group>
  );
}

function Intersection({ signalStates }) {
  return (
    <>
      {/* Road surfaces */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Vertical road */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 20]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* Horizontal road */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 3]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* Lane markings */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 20]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.1, 20]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>

      {/* Traffic lights at each corner */}
      <TrafficLight position={[2, 0, 2]} state={signalStates.north} direction="north" />
      <TrafficLight position={[-2, 0, -2]} state={signalStates.south} direction="south" />
      <TrafficLight position={[-2, 0, 2]} state={signalStates.east} direction="east" />
      <TrafficLight position={[2, 0, -2]} state={signalStates.west} direction="west" />
    </>
  );
}

export default function TrafficCanvas({ vehicles = [], signalStates = {}, isRunning }) {
  const defaultSignals = {
    north: 'green',
    south: 'green',
    east: 'red',
    west: 'red'
  };

  const displaySignals = Object.keys(signalStates).length > 0 ? signalStates : defaultSignals;
  
  const defaultVehicles = [
    { id: 1, position: [0, 0.15, -5], color: '#3B82F6', direction: 'north', speed: isRunning ? 1 : 0 },
    { id: 2, position: [0, 0.15, 3], color: '#EF4444', direction: 'south', speed: isRunning ? 1 : 0 },
    { id: 3, position: [4, 0.15, 0], color: '#F59E0B', direction: 'west', speed: 0 },
    { id: 4, position: [-6, 0.15, 0], color: '#10B981', direction: 'east', speed: 0 },
  ];

  const displayVehicles = vehicles.length > 0 ? vehicles : defaultVehicles;

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-200 to-slate-100 rounded-xl overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={20}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <Intersection signalStates={displaySignals} />
        
        {displayVehicles.map(vehicle => (
          <Vehicle 
            key={vehicle.id}
            position={vehicle.position}
            color={vehicle.color}
            direction={vehicle.direction}
            speed={vehicle.speed}
          />
        ))}
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}