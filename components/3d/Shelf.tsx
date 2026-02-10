
import React, { Suspense, useMemo, useState } from 'react';
import { BookSpine3D } from './BookSpine3D';
import { useLibrary, BookLite } from '../../stores/library';
import { RoundedBox, Text } from '@react-three/drei';

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

type ShelfProps = { 
  id: string; 
  books: BookLite[]; 
  y?: number;
  seedOffset?: number;
  title?: string;
  label?: string; // e.g. S01
};

const BOOK_SPACING = 0.04;
const SHELF_CAPACITY = 10;
const ICE_WHITE = "#f0f8ff";

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return hash;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const Shelf: React.FC<ShelfProps> = ({ id, books, y = 0, seedOffset = 0, title, label }) => {
  const floatBook = useLibrary((s) => s.floatBook);
  const bookStates = useLibrary((s) => s.bookStates);
  
  const SHELF_THICKNESS = 0.2;
  const SHELF_Y = -0.8 - (SHELF_THICKNESS / 2);

  const bookConfig = useMemo(() => {
    const configs = [];
    let totalWidth = 0;
    
    for (let i = 0; i < SHELF_CAPACITY; i++) {
        const book = books[i] || null;
        const seedStr = book ? book.id : `${id}-empty-${i}`;
        const rng = mulberry32(stringToSeed(seedStr) + seedOffset);
        
        const randTurn = (rng() - 0.5) * (Math.PI / 10);
        const randLean = (rng() - 0.5) * (Math.PI / 12);
        const thickness = 0.14 + (rng() * 0.24);
        const hScale = book ? 0.88 + (rng() * 0.17) : 0.85; 

        // Generate a fallback letter if book object is missing
        const fallbackLetter = LETTERS[i % LETTERS.length];

        configs.push({
            book,
            fallbackLetter,
            thickness,
            hScale,
            randTurn,
            randLean,
            key: book ? book.id : `empty-${id}-${i}`,
        });
        totalWidth += thickness;
    }

    totalWidth += (SHELF_CAPACITY - 1) * BOOK_SPACING;
    let startX = -totalWidth / 2;
    
    return {
        items: configs.map(cfg => {
            const xPos = startX + (cfg.thickness / 2);
            startX += cfg.thickness + BOOK_SPACING;
            return {
                ...cfg,
                x: xPos,
                y: -0.8 + (0.8 * cfg.hScale)
            };
        }),
        totalWidth
    };

  }, [id, books, seedOffset]);

  const shelfBoardWidth = Math.max(bookConfig.totalWidth + 0.5, 3.5); 

  return (
    <group position={[0, y, 0]}>
      {/* Books */}
      {bookConfig.items.map((item) => {
         // Only hide from shelf if it's currently flying or held
         const isPresentOnShelf = !item.book || (bookStates[item.book.id] !== 'flying' && bookStates[item.book.id] !== 'held');
         if (!isPresentOnShelf) return null;

         return (
            <BookSpine3D
              key={item.key}
              title={item.book?.title}
              spineLetter={item.book?.spineLetter || item.fallbackLetter}
              color={item.book?.spineColor}
              isEmpty={!item.book}
              thickness={item.thickness}
              position={[item.x, item.y, 0]}
              rotation={[0, item.randTurn, item.randLean]}
              scale={[1, item.hScale, 1]}
              onFloat={() => {
                 if (item.book) floatBook(item.book.id);
              }}
            />
          );
      })}
      
      {/* Shelf Board - Ice White Stack */}
      <group position={[0, SHELF_Y, 0]}>
        <RoundedBox args={[shelfBoardWidth, SHELF_THICKNESS, 1.2]} radius={0.02} smoothness={2} receiveShadow>
            <meshStandardMaterial color={ICE_WHITE} roughness={0.1} metalness={0.8} />
        </RoundedBox>
        <mesh position={[0, -0.11, 0.5]} rotation={[Math.PI/2,0,0]}>
            <planeGeometry args={[shelfBoardWidth, 0.1]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.05} />
        </mesh>

        {/* Shelf Label (S01-S20) */}
        {label && (
            <Suspense fallback={null}>
                <Text 
                    position={[-(shelfBoardWidth/2) + 0.3, 0, 0.61]} 
                    fontSize={0.15}
                    anchorX="left"
                    anchorY="middle"
                >
                    {label}
                    <meshStandardMaterial color={ICE_WHITE} emissive={ICE_WHITE} emissiveIntensity={2.5} toneMapped={false} />
                </Text>
            </Suspense>
        )}
      </group>
    </group>
  );
};
