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
    {x: 4, y: 6},
    {x: 5, y: 6},
    {x: 5, y: 5},
    {x: 3, y: 0},
    {x: 4, y: 0},
    {x: 5, y: 0},
    {x: 6, y: 0},
  ])

  const movePlayer = (x, y) => {

    let newX = playerPosition.x + x;
    let newY = playerPosition.y + y;

    // check if new position is in bounds and not a hill
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 &&
      !hills.some(hill => hill.x === newX && hill.y === newY)
    ) {
      setPlayerPosition({
        x: newX,
        y: newY
      })
    }

    if (newX === targetPosition.x && newY === targetPosition.y) {
      moveTarget()

      setScoreAnimation(true)
      setTimeout(() => {
        setScoreAnimation(false)
        setScore(score + 1)
      }, 500)
    }
  }

  const moveTarget = () => {
    // move target to a random position that is not a hill or the current player position

    let originalPosition = targetPosition
    let newTargetPosition = {x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8)}
    while (hills.some(hill => hill.x === newTargetPosition.x && hill.y === newTargetPosition.y) ||
      (newTargetPosition.x === originalPosition.x && newTargetPosition.y === originalPosition.y)
    ) {
      newTargetPosition = {x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8)}
    }

    setTargetPosition(newTargetPosition)
  }

  useKey('ArrowUp', () => movePlayer(0, -1), {}, [playerPosition]);
  useKey('ArrowDown', () => movePlayer(0, 1), {}, [playerPosition]);
  useKey('ArrowLeft', () => movePlayer(-1, 0), {}, [playerPosition]);
  useKey('ArrowRight', () => movePlayer(1, 0), {}, [playerPosition]);

  const rotateBoard = (x, y, z) => {
    // let newRotation = rotation + z
    // setRotation(newRotation)
    document.getElementById("board").style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`
  }

  // usekey on spacebar
  useKey(' ', () => {
    rotateBoard(0, 360, 0)
    setTimeout(() => {
      rotateBoard(60, 360, -45)
    }, 1500)
  }, {}, []);

  useKey('a', () => alert('"a" pressed'));

  useEffect(() => {
    rotateBoard(60, 360, -45)
  }, []);

  return (
    <div className=' '>
      <section className='absolute top-8 right-8 text-white'>
        Score: { score } <span className={' text-green-400 '  + (scoreAnimation ? ' opacity-100 ' : ' opacity-0 ')}> +1</span>
      </section>
      <section className='  bg-orange-800 h-screen overflow-hidden  flex justify-center items-center'>
        {/* 8 by 8 table with rows and columns of equal size */}
        <div className=''>
          <div id="board" style={{transform: `rotateX(0deg) rotateY(360deg) rotateZ(0deg)`}} className={`  transition-all duration-1000 grid grid-cols-8 grid-rows-8 gap-0 w-96 h-96 shadow-2xl`}>
            {/* 64 squares */}
            {
              [...Array(64)].map((e, i) => {
                if (playerPosition.x === i % 8 && playerPosition.y === Math.floor(i / 8)) {
                  return (
                    <div key={i} id="player" className='block bg-orange-600 before:bg-orange-800 after:bg-red-700 ' />
                  )
                } else if (targetPosition.x === i % 8 && targetPosition.y === Math.floor(i / 8))  {
                  return (
                    <div key={i} id="target" className='block bg-blue-600 before:bg-blue-900 after:bg-blue-800 transition-transform duration-500 ' />             
                  )
                } else if (hills.some(hill => hill.x === i % 8 && hill.y === Math.floor(i / 8))) {
                  return (
                    <div key={i} className={`block bg-green-600 before:bg-green-800 after:bg-cyan-600 `} />
                  )
                } else {
                  return (
                    <div key={i} className={`border border-gray-200 bg-white`} />
                  )
                }
              })
            }
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;