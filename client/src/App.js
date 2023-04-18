import React, { useEffect, useState } from 'react';
import {useKey} from 'react-use';

function App() {

  let [playerPosition, setPlayerPosition] = useState({x: 4, y: 3});
  let [targetPosition, setTargetPosition] = useState({x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8)});

  let [score, setScore] = useState(0);
  let [scoreAnimation, setScoreAnimation] = useState(false);

  let [hills, setHills] = useState([
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: 1, y: 2},
    {x: 1, y: 3},
    {x: 2, y: 2},
    {x: 2, y: 1},
    {x: 3, y: 1},
    {x: 0, y: 1},
    {x: 2, y: 0},
    {x: 3, y: 0},
    {x: 4, y: 0},
    {x: 5, y: 0},
    {x: 6, y: 0},
  ])

  const movePlayer = (x, y) => {

    let newX = playerPosition.x + x;
    let newY = playerPosition.y + y;

    if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {} else {
      setPlayerPosition({
        x: newX,
        y: newY
      })
    }

    if (newX === targetPosition.x && newY === targetPosition.y) {
      moveTarget()
    }
  }

  const moveTarget = () => {
    setTargetPosition({
      x: Math.floor(Math.random() * 8),
      y: Math.floor(Math.random() * 8)
    })


    setScoreAnimation(true)
    setTimeout(() => {
      setScoreAnimation(false)
      setScore(score + 1)
    }, 500)
  }

  useKey('ArrowUp', () => movePlayer(0, -1), {}, [playerPosition]);
  useKey('ArrowDown', () => movePlayer(0, 1), {}, [playerPosition]);
  useKey('ArrowLeft', () => movePlayer(-1, 0), {}, [playerPosition]);
  useKey('ArrowRight', () => movePlayer(1, 0), {}, [playerPosition]);

  useKey('a', () => alert('"a" pressed'));

  useEffect(() => {
  }, []);

  return (
    <div className=' '>
      <section className='absolute top-8 right-8 text-white'>
        
        Score: { score } <span className={' text-green-400 '  + (scoreAnimation ? ' opacity-100 ' : ' opacity-0 ')}> +1</span>
      </section>
      <section className=' bg-orange-800 h-screen overflow-hidden  flex justify-center items-center'>
        {/* 8 by 8 table with rows and columns of equal size */}
        <div id="board" className={`transition-all duration-500 grid grid-cols-8 grid-rows-8 gap-0 w-96 h-96 shadow-2xl`}>
          {/* 64 squares */}
          {
            [...Array(64)].map((e, i) => {
              if (playerPosition.x === i % 8 && playerPosition.y === Math.floor(i / 8)) {
                return (
                  <div key={i} id="player" className='tall bg-red-500 ' />
                )
              } else if (targetPosition.x === i % 8 && targetPosition.y === Math.floor(i / 8))  {
                return (
                  <div key={i} id="target" className='transition-all duration-500 bg-blue-500' />             
                )
              } else if (hills.some(hill => hill.x === i % 8 && hill.y === Math.floor(i / 8))) {
                return (
                  <div key={i} className={`bg-green-500 `} />
                )
              } else {
                return (
                  <div key={i} className={`border border-gray-200 bg-white`} />
                )
              }
            })
          }
        </div>



      </section>
    </div>
  );
}

export default App;