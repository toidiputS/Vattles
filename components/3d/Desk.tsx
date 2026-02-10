
import React, { Suspense, useState, useEffect } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useUI } from '../../stores/ui';
import { useSystem } from '../../stores/system';
import { useLibrary } from '../../stores/library';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      boxGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      coneGeometry: any;
      sphereGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      torusGeometry: any;
      ambientLight: any;
      pointLight: any;
      hemisphereLight: any;
      fog: any;
      color: any;
      gridHelper: any;
    }
  }
}

export function Desk() {
  const setSettingsOpen = useUI((s) => s.setSettingsOpen);
  const { lightingLevel, setLightingLevel } = useSystem();
  const libraryCardName = useLibrary((s) => s.libraryCardName);
  const [hovered, setHover] = useState(false);
  const [lampHover, setLampHover] = useState(false);

  // Toggle Logic: Cycle 0.0 (Off) -> 1.0 (Mid) -> 2.0 (Bright) -> 0.0
  const toggleGlobalLights = (e: any) => {
      e.stopPropagation();
      let newLevel = 0.0;
      if (lightingLevel < 0.5) newLevel = 1.0;       // Off -> Mid
      else if (lightingLevel < 1.5) newLevel = 2.0;  // Mid -> Bright
      else newLevel = 0.0;                           // Bright -> Off
      setLightingLevel(newLevel);
  };

  const openAuth = (e: any) => {
      e.stopPropagation();
      window.dispatchEvent(new Event('open-auth'));
  };

  // Lamp Visuals based on State
  // Determine if the *bulb* inside is on. 
  // Level 0: Bulb Off (but shade glows). Level 1+: Bulb On.
  const isBulbOn = lightingLevel > 0.5;
  const bulbColor = isBulbOn ? "#ffaa00" : "#332200";

  return (
    <group position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
      {/* Desk Surface */}
      <RoundedBox args={[6, 0.2, 3]} radius={0.05} smoothness={4} position={[0, 1.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a120b" roughness={0.2} metalness={0.4} />
      </RoundedBox>

      {/* Legs */}
      {[[-2.5, -1], [2.5, -1], [-2.5, 1], [2.5, 1]].map((pos, i) => (
         <mesh key={i} position={[pos[0], 0.7, pos[1]]} castShadow>
            <boxGeometry args={[0.2, 1.4, 0.2]} />
            <meshStandardMaterial color="#050505" metalness={0.8} />
         </mesh>
      ))}

      {/* Nameplate */}
      <group position={[0, 1.5, 1.0]} rotation={[-0.2, 0, 0]} onClick={openAuth}
             onPointerOver={() => document.body.style.cursor = 'pointer'}
             onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.4, 0.1]} />
          <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.9} />
        </mesh>
        <Suspense fallback={null}>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.2}
            anchorX="center"
            anchorY="middle"
          >
            {libraryCardName ? libraryCardName.toUpperCase() : "LOGIN"}
            <meshStandardMaterial 
                color="#00FF00" 
                emissive="#00FF00" 
                emissiveIntensity={2.0} 
                toneMapped={false}
            />
          </Text>
        </Suspense>
      </group>

      {/* Settings Panel */}
      <group 
        position={[-2.0, 1.55, 0.5]} 
        rotation={[0, 0.3, 0]}
        onClick={(e) => { e.stopPropagation(); setSettingsOpen(true); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
      >
        <RoundedBox args={[1.0, 0.05, 0.8]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#222" roughness={0.4} emissive={hovered ? "#444" : "#111"} />
        </RoundedBox>
        <Suspense fallback={null}>
          <Text
            position={[0, 0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.08}
            anchorX="center"
            anchorY="middle"
          >
            SYSTEM KEY
            <meshStandardMaterial color={hovered ? "#fff" : "#888"} />
          </Text>
        </Suspense>
      </group>

      {/* THE LAMP */}
      <group position={[2, 0, 0]}>
          {/* Base - The Switch */}
          <group
            onClick={toggleGlobalLights}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setLampHover(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setLampHover(false); }}
          >
            <mesh position={[0, 1.55, 0.5]} castShadow>
                <cylinderGeometry args={[0.2, 0.25, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.5} emissive={lampHover ? "#444" : "#000"} />
            </mesh>
            {/* Click hint */}
             {lampHover && (
                 <mesh position={[0, 1.61, 0.5]} rotation={[-Math.PI/2, 0, 0]}>
                     <ringGeometry args={[0.15, 0.18, 32]} />
                     <meshBasicMaterial color={isBulbOn ? "#ff0000" : "#00ff00"} />
                 </mesh>
             )}
          </group>
          
          <mesh position={[0, 2.2, 0.5]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.4]} />
            <meshStandardMaterial color="#d4af37" metalness={1.0} roughness={0.2} />
          </mesh>
          
          {/* Lampshade - ALWAYS ON (Emissive) */}
          <mesh position={[0, 2.8, 0.5]} castShadow>
            <coneGeometry args={[0.6, 0.4, 32, 1, true]} />
            <meshStandardMaterial 
                color="#0f3d0f" 
                emissive="#0f3d0f"
                emissiveIntensity={2.0} // ALWAYS ON
                side={2} 
                metalness={0.2} 
                roughness={0.1} 
            />
          </mesh>

          {/* BULB */}
          <mesh position={[0, 2.7, 0.5]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color={bulbColor} toneMapped={false} />
          </mesh>

          {/* Local Light for Desk */}
          <pointLight 
            position={[0, 2.6, 0.5]} 
            intensity={isBulbOn ? 5.0 : 0.0} 
            color="#ffaa00" 
            distance={15} 
            decay={2} 
          />
      </group>
    </group>
  );
}
