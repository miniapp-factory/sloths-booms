'use client';

import { useState, useEffect } from 'react';
import { Share } from '@/components/share';
import { url } from '@/lib/metadata';

const fruits = ['Apple', 'Banana', 'Cherry', 'Lemon'];
const fruitImages: Record<string, string> = {
  Apple: '/apple.png',
  Banana: '/banana.png',
  Cherry: '/cherry.png',
  Lemon: '/lemon.png',
};

function randomFruit(): string {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit)));
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  useEffect(() => {
    if (!spinning) return;
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        // shift each column down
        for (let col = 0; col < 3; col++) {
          const newCol = [randomFruit(), ...prev.slice(0, 2).map(row => row[col])];
          for (let row = 0; row < 3; row++) {
            newGrid[row][col] = newCol[row];
          }
        }
        return newGrid;
      });
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      const winner =
        (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2] && grid[0][0]) ||
        (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2] && grid[1][0]) ||
        (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2] && grid[2][0]) ||
        (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0] && grid[0][0]) ||
        (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1] && grid[0][1]) ||
        (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2] && grid[0][2]) ||
        null;
      setWin(winner);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [spinning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={fruitImages[fruit]}
            alt={fruit}
            width={64}
            height={64}
          />
        ))}
      </div>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
        onClick={() => setSpinning(true)}
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">You won with {win}s!</span>
          <Share text={`I just won with ${win}s in the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
