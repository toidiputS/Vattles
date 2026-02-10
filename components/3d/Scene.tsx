
import React, { Suspense, useMemo, useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame, createPortal } from '@react-three/fiber';
import { PerfBudget } from './PerfBudget';
import { Shelf } from './Shelf';
import { Desk } from './Desk';
import { BookSpine3D } from './BookSpine3D';
import { useLibrary } from '../../stores/library';
import { useUI } from '../../stores/ui';
import { useSystem } from '../../stores/system';
import { BakeShadows, PerspectiveCamera, PointerLockControls, Text, Environment } from '@react-three/drei';
import type { BookLite, Shelf as LibraryShelf } from '../../stores/library';
import * as THREE from 'three';

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

// --- COMPONENTS ---

const ICE_WHITE = "#f0f8ff"; // AliceBlue / Ice White

function ExitSign() {
  const [hovered, setHover] = useState(false);
  
  const handleExit = () => {
      window.location.href = 'https://itsyouonline.com';
  };

  return (
    <group position={[0, 195, 0]} 
           onClick={(e) => { e.stopPropagation(); handleExit(); }}
           onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
           onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
    >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[18, 0.5, 16, 100]} />
            <meshStandardMaterial 
                color="#ff0000" 
                emissive="#ff0000" 
                emissiveIntensity={hovered ? 8 : 4} 
                toneMapped={false} 
            />
        </mesh>
        <Suspense fallback={null}>
            <group rotation={[Math.PI / 2, Math.PI, 0]}> 
                <Text
                    fontSize={8}
                    anchorX="center"
                    anchorY="middle"
                    color="#ff0000"
                >
                    EXIT SYSTEM
                    <meshBasicMaterial color="#ff0000" toneMapped={false} />
                </Text>
            </group>
        </Suspense>
        {/* Invisible Hitbox */}
        <mesh visible={false}>
            <cylinderGeometry args={[19, 19, 5]} />
        </mesh>
    </group>
  );
}

function FoundationBlock({ x, y, z, rotY, height, showDisplay = false }: { x: number, y: number, z: number, rotY: number, height: number, showDisplay?: boolean, key?: any }) {
    return (
        <group position={[x, y, z]} rotation={[0, rotY, 0]}>
            {/* Block Mesh - Ice White Metallic */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[5.0, height, 2]} />
                <meshStandardMaterial 
                    color={ICE_WHITE} 
                    roughness={0.1} 
                    metalness={0.9} 
                />
            </mesh>
            
            {/* High Ticket UI Text - Display on the FRONT face (Z=1.01) which now faces the desk */}
            {showDisplay && (
                <Suspense fallback={null}>
                    <group position={[0, 0, 1.01]}> 
                        <Text 
                            position={[0, 1.8, 0]} 
                            fontSize={0.25} 
                            anchorX="center" 
                            anchorY="middle"
                            letterSpacing={0.1}
                        >
                            itsyouonline.com
                            <meshStandardMaterial color={ICE_WHITE} emissive={ICE_WHITE} emissiveIntensity={2.5} toneMapped={false} />
                        </Text>
                        <Text 
                            position={[0, 1.2, 0]} 
                            fontSize={0.6} 
                            anchorX="center" 
                            anchorY="middle"
                            letterSpacing={0.05}
                        >
                            ORC - ORACLE
                            <meshStandardMaterial color={ICE_WHITE} emissive={ICE_WHITE} emissiveIntensity={3.0} toneMapped={false} />
                        </Text>
                        <Text 
                            position={[0, 0.6, 0]} 
                            fontSize={0.18} 
                            anchorX="center" 
                            anchorY="middle"
                            letterSpacing={0.2}
                        >
                            PORTALS OS / MASTER NEXUS
                            <meshStandardMaterial color={ICE_WHITE} emissive={ICE_WHITE} emissiveIntensity={2.0} toneMapped={false} />
                        </Text>
                    </group>
                </Suspense>
            )}
        </group>
    );
}

// --- PHYSICS & LOGIC ---

function VortexManager() {
    const bookStates = useLibrary(s => s.bookStates);
    const flyingTimers = useLibrary(s => s.flyingTimers);
    const returnBookToShelf = useLibrary(s => s.returnBookToShelf);
    const setBookState = useLibrary(s => s.setBookState);
    const books = useLibrary(s => s.books);

    // Physics state for floating books
    const physicsRefs = useRef<Record<string, { 
        mesh: THREE.Group, 
        phase: number[], // [p1, p2, p3, p4]
        baseRadius: number,
        heightOffset: number,
        orbitSpeed: number,
        tumbleSpeeds: THREE.Vector3
    }>>({});

    useFrame((state, delta) => {
        const now = Date.now();
        const t = state.clock.getElapsedTime();
        const flyingIds = Object.keys(bookStates).filter(id => bookStates[id] === 'flying');

        flyingIds.forEach(id => {
            // Lifecycle: Return to shelf check
            if (flyingTimers[id] && now > flyingTimers[id]) {
                returnBookToShelf(id);
                delete physicsRefs.current[id];
                return;
            }

            // Ensure physics object exists (safety for late mounting)
            if (!physicsRefs.current[id]) {
                return;
            }

            const phys = physicsRefs.current[id];
            if (phys.mesh) {
                // --- ORGANIC FLUID MOTION ---
                
                // 1. Noise-like drivers (Superimposed sine waves)
                const noise1 = Math.sin(t * 0.2 + phys.phase[0]);
                const noise2 = Math.cos(t * 0.45 + phys.phase[1]);
                const noise3 = Math.sin(t * 0.1 + phys.phase[2]);

                // 2. Vertical Movement:
                const y = phys.heightOffset 
                        + (noise1 * 2.0) 
                        + Math.sin(t * 0.5) * 0.5;

                // 3. Radial Movement:
                const r = phys.baseRadius + (noise2 * 2.0);

                // 4. Orbital Movement:
                const currentSpeed = phys.orbitSpeed * (1 + noise3 * 0.2); 
                const theta = (t * currentSpeed) + phys.phase[3];

                const x = Math.cos(theta) * r;
                const z = Math.sin(theta) * r;

                phys.mesh.position.set(x, y, z);

                // 5. Chaotic Tumble:
                phys.mesh.rotation.x += delta * (phys.tumbleSpeeds.x + noise1 * 0.1);
                phys.mesh.rotation.y += delta * (phys.tumbleSpeeds.y + noise2 * 0.1);
                phys.mesh.rotation.z += delta * (phys.tumbleSpeeds.z + noise3 * 0.1);
            }
        });
    });

    return (
        <>
            {Object.keys(bookStates).map(id => {
                if (bookStates[id] !== 'flying') return null;
                const book = books[id];
                if (!book) return null;

                return (
                    <group 
                        key={id} 
                        // Add click handler to catch floating books
                        onClick={(e) => {
                            e.stopPropagation();
                            setBookState(id, 'held');
                        }}
                        ref={(ref) => { 
                            if(ref) {
                                // Initialize physics immediately upon mount
                                if (!physicsRefs.current[id]) {
                                     physicsRefs.current[id] = {
                                        mesh: ref,
                                        phase: Array(4).fill(0).map(() => Math.random() * Math.PI * 2),
                                        baseRadius: 12 + Math.random() * 6, 
                                        heightOffset: 20 + Math.random() * 40, 
                                        orbitSpeed: (Math.random() - 0.5) * 0.05,
                                        tumbleSpeeds: new THREE.Vector3(
                                            (Math.random() - 0.5) * 0.2,
                                            (Math.random() - 0.5) * 0.2,
                                            (Math.random() - 0.5) * 0.2
                                        )
                                    };
                                    const p = physicsRefs.current[id];
                                    ref.position.set(
                                        Math.cos(p.phase[3]) * p.baseRadius,
                                        p.heightOffset,
                                        Math.sin(p.phase[3]) * p.baseRadius
                                    );
                                } else {
                                    physicsRefs.current[id].mesh = ref;
                                }
                            }
                        }}
                    >
                        <BookSpine3D title={book.title} color={book.spineColor} thickness={0.2} />
                    </group>
                );
            })}
        </>
    );
}

function HeldBookManager() {
    const bookStates = useLibrary(s => s.bookStates);
    const select = useLibrary(s => s.select);
    const books = useLibrary(s => s.books);
    const { camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const heldId = Object.keys(bookStates).find(id => bookStates[id] === 'held');
    const book = heldId ? books[heldId] : null;

    useFrame((state) => {
        if (groupRef.current && book) {
             const time = state.clock.getElapsedTime();
             // Position: Bring closer and center-right.
             // Rotation: Rotate 90 degrees (PI/2) on Y to show the cover (Side Face).
             // Sway: Gentle floating effect.
             groupRef.current.position.set(0.35, -0.25 + Math.sin(time * 1.5) * 0.01, -0.5);
             groupRef.current.rotation.set(
                 0.1, // Slight tilt back
                 Math.PI / 2 + Math.cos(time * 0.8) * 0.05, // Show cover + gentle yaw
                 Math.sin(time * 1) * 0.02 // Gentle roll
             );
        }
    });
    
    if (!book) return null;
    
    return createPortal(
        <group 
            ref={groupRef} 
            onClick={(e) => {
                e.stopPropagation();
                select(book.id);
            }}
        >
             {/* Scale up slightly for held view */}
             <BookSpine3D title={book.title} color={book.spineColor} thickness={0.2} scale={[1.3, 1.3, 1.3]} />
        </group>,
        camera
    );
}

function PlayerController({ isMobile }: { isMobile: boolean }) {
    const { camera, gl } = useThree();
    const { cameraSpeed, keys, user } = useSystem();
    const { view, isCatalogOpen, isSettingsOpen } = useUI();
    const { selectedBookId } = useLibrary();
    
    const isOverlayOpen = isCatalogOpen || isSettingsOpen || !!selectedBookId || !user.isAuthenticated;
    
    useEffect(() => {
        if (view === 'stacks') {
            camera.position.set(0, 60, 0); 
            camera.rotation.set(-Math.PI / 2, 0, 0); 
        }
    }, [view, camera]);

    const moveState = useRef({ forward: false, backward: false, left: false, right: false, up: false, down: false, run: false });

    useEffect(() => {
        const onKey = (e: KeyboardEvent, down: boolean) => {
            const k = e.code;
            if (k === keys.forward) moveState.current.forward = down;
            if (k === keys.backward) moveState.current.backward = down;
            if (k === keys.left) moveState.current.left = down;
            if (k === keys.right) moveState.current.right = down;
            if (k === keys.up) moveState.current.up = down;
            if (k === keys.down) moveState.current.down = down;
            if (k === keys.run) moveState.current.run = down;
        };
        window.addEventListener('keydown', (e) => onKey(e, true));
        window.addEventListener('keyup', (e) => onKey(e, false));
        return () => {};
    }, [keys]);

    useEffect(() => {
        if (!isMobile) return;
        let lastX = 0;
        let lastY = 0;
        const onTouchStart = (e: TouchEvent) => {
             if (e.touches.length > 0) {
                 lastX = e.touches[0].clientX;
                 lastY = e.touches[0].clientY;
             }
        };
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const clientX = e.touches[0].clientX;
                const clientY = e.touches[0].clientY;
                const deltaX = clientX - lastX;
                const deltaY = clientY - lastY;
                lastX = clientX;
                lastY = clientY;
                const sensitivity = 0.005 * cameraSpeed;
                camera.rotation.y -= deltaX * sensitivity;
                const newPitch = camera.rotation.x - (deltaY * sensitivity);
                camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, newPitch));
            }
        };
        const canvas = gl.domElement;
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => {
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchmove', onTouchMove);
        };
    }, [isMobile, camera, gl, cameraSpeed]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
             if (view !== 'stacks') return;
             const strength = 0.05 * cameraSpeed;
             let delta = -e.deltaY * strength; 
             delta = Math.max(-5, Math.min(5, delta));
             const camDirection = new THREE.Vector3();
             camera.getWorldDirection(camDirection);
             camera.position.addScaledVector(camDirection, delta);
             if (camera.position.y < 2.0) camera.position.y = 2.0;
             if (camera.position.y > 80) { 
                 window.location.href = 'https://itsyouonline.com';
             }
        };
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [view, camera, cameraSpeed]);

    useFrame((state, delta) => {
        if (view !== 'stacks') return;
        if (document.pointerLockElement) {
             state.pointer.x = 0;
             state.pointer.y = 0;
        }
        if (camera.position.y > 80) { 
            window.location.href = 'https://itsyouonline.com';
            return;
        }
        const baseSpeed = 8.0 * cameraSpeed; 
        const speed = moveState.current.run ? baseSpeed * 3.0 : baseSpeed;
        const camDirection = new THREE.Vector3();
        camera.getWorldDirection(camDirection);
        const camRight = new THREE.Vector3().crossVectors(camDirection, new THREE.Vector3(0, 1, 0)).normalize();
        if (moveState.current.forward) camera.position.addScaledVector(camDirection, speed * delta);
        if (moveState.current.backward) camera.position.addScaledVector(camDirection, -speed * delta);
        if (moveState.current.left) camera.position.addScaledVector(camRight, -speed * delta);
        if (moveState.current.right) camera.position.addScaledVector(camRight, speed * delta);
        if (moveState.current.up) camera.position.y += speed * delta;
        if (moveState.current.down) camera.position.y -= speed * delta;
        if (camera.position.y < 2.0) camera.position.y = 2.0;
    });

    return (view === 'stacks' && !isMobile && !isOverlayOpen) ? <PointerLockControls /> : null;
}

function MainContent() {
  const shelves = useLibrary((s) => s.shelves);
  const books = useLibrary((s) => s.books);
  
  const allShelfData = useMemo(() => {
    return Object.values(shelves).map((shelf: LibraryShelf) => ({
      ...shelf,
      bookDetails: shelf.bookIds.map((id) => books[id]).filter((b): b is BookLite => !!b),
    }));
  }, [shelves, books]);

  const SHELVES_PER_RING = 14; 
  const RADIUS = 15; 
  const LEVEL_HEIGHT = 2.8;
  const VISUAL_FLOOR_Y = -2.5;
  const SHELF_START_Y = 2.4; 
  const SHELF_CONTENT_DROP = 0.9; 
  const BLOCK_TOP_Y = SHELF_START_Y - SHELF_CONTENT_DROP;
  const BLOCK_HEIGHT = BLOCK_TOP_Y - VISUAL_FLOOR_Y; 
  const BLOCK_CENTER_Y = VISUAL_FLOOR_Y + (BLOCK_HEIGHT / 2);

  const foundationBlocks = useMemo(() => {
      const blocks = [];
      for(let s = 0; s < SHELVES_PER_RING; s++) {
          const angle = (s / SHELVES_PER_RING) * Math.PI * 2;
          const x = Math.cos(angle) * RADIUS;
          const z = Math.sin(angle) * RADIUS;
          
          // FACING INSIDE: rotY = -angle - PI/2
          const rotY = -angle - Math.PI / 2; 

          // Show Text on the first block (index 0), which usually aligns with Start
          const showDisplay = (s === 0);

          blocks.push({ key: `block-${s}`, x, y: BLOCK_CENTER_Y, z, rotY, showDisplay });
      }
      return blocks;
  }, [BLOCK_CENTER_Y, RADIUS, SHELVES_PER_RING]);

  const shelfPositions = useMemo(() => {
      const positions = [];
      let idx = 0;
      const rings = Math.ceil(Math.max(allShelfData.length, 1) / SHELVES_PER_RING);
      for (let r = 0; r < rings; r++) {
          for (let s = 0; s < SHELVES_PER_RING; s++) {
              if (idx >= allShelfData.length) break;
              const angle = (s / SHELVES_PER_RING) * Math.PI * 2;
              const x = Math.cos(angle) * RADIUS;
              const z = Math.sin(angle) * RADIUS;
              const y = SHELF_START_Y + (r * LEVEL_HEIGHT);
              
              // FACING INSIDE: rotY = -angle - PI/2
              const rotY = -angle - Math.PI / 2;
              
              const label = `S${(r + 1).toString().padStart(2, '0')}`;
              positions.push({ data: allShelfData[idx], x, y, z, rotY, label, key: allShelfData[idx].id });
              idx++;
          }
      }
      return positions;
  }, [allShelfData, SHELF_START_Y, LEVEL_HEIGHT, RADIUS, SHELVES_PER_RING]);

  const [limit, setLimit] = useState(0);
  useEffect(() => {
      if (shelfPositions.length < 50) {
          setLimit(shelfPositions.length);
          return;
      }
      let current = 0;
      const batchSize = 42; 
      const interval = setInterval(() => {
          current += batchSize;
          setLimit(c => Math.min(c + batchSize, shelfPositions.length));
          if (current >= shelfPositions.length) {
              clearInterval(interval);
          }
      }, 50);
      return () => clearInterval(interval);
  }, [shelfPositions.length]);

  return (
    <>
      {foundationBlocks.map((blk) => (
          <FoundationBlock 
            key={blk.key} 
            x={blk.x} 
            y={blk.y} 
            z={blk.z} 
            rotY={blk.rotY} 
            height={BLOCK_HEIGHT} 
            showDisplay={blk.showDisplay}
          />
      ))}
      {shelfPositions.slice(0, limit).map((pos) => (
            <group key={pos.key} position={[pos.x, pos.y, pos.z]} rotation={[0, pos.rotY, 0]}>
                <Shelf id={pos.data.id} title={pos.data.title} books={pos.data.bookDetails} label={pos.label} />
            </group>
      ))}
      <group position={[0, 0, 0]}>
          <Desk />
      </group>
      <VortexManager />
      <HeldBookManager />
      <ExitSign />
    </>
  );
}

export function Scene3D({ isMobile = false }: { isMobile?: boolean }) {
  const lightingLevel = useSystem((s) => s.lightingLevel);
  const ambientIntensity = 0.2 + (lightingLevel * 0.6); 
  const hemiIntensity = 0.1 + (lightingLevel * 0.4);
  const mainLightIntensity = lightingLevel * 2.0; 
  const deskLightIntensity = 1.0 + (lightingLevel * 1.0); 
  const envIntensity = 0.2 + (lightingLevel * 0.6);

  return (
    <Canvas 
      id="root" 
      shadows 
      dpr={isMobile ? [1, 1.5] : [1, 2]} 
      gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
    >
      <PerspectiveCamera makeDefault position={[0, 60, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={isMobile ? 95 : 85} near={0.1} far={500} />
      <PlayerController isMobile={isMobile} />
      
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 250]} />
      
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <hemisphereLight intensity={hemiIntensity} color="#ffffff" groundColor="#333333" />
      <pointLight position={[0, 80, 0]} intensity={mainLightIntensity} color="#fffaf0" distance={150} decay={1} />
      <pointLight position={[0, 20, 0]} intensity={deskLightIntensity} color="#fffaf0" distance={60} decay={1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <circleGeometry args={[60, 64]} />
          <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.2} />
      </mesh>
      
      <gridHelper position={[0, -2.4, 0]} args={[40, 40, '#444', '#111']} />

      <Suspense fallback={null}>
          <Environment preset="warehouse" environmentIntensity={envIntensity} />
      </Suspense>

      <Suspense fallback={null}>
          <MainContent />
          <BakeShadows />
      </Suspense>
      
      <PerfBudget />
    </Canvas>
  );
}
