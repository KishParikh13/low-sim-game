import React, { useEffect, useState } from 'react';
import {useKey} from 'react-use';

function App() {

  let boardSize = 30;
  let [playerPosition, setPlayerPosition] = useState({x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize)});
  let [targetPosition, setTargetPosition] = useState({x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize)});

  let [score, setScore] = useState(0);
  let [scoreAnimation, setScoreAnimation] = useState(false);

  let [hills, setHills] = useState([])


  let generateHills = () => {
    // generate hills in a semi random pattern where they are grouped together
    let newHills = []
    for (let i = 0; i < boardSize*1.5; i++) {
      let x = Math.floor(Math.random() * boardSize)
      let y = Math.floor(Math.random() * boardSize)
      newHills.push({x, y})
    }
    setHills(newHills)

    // add a class of 'two' to some of the hills randomly  (the divs with a class of block and bg-green)
    setTimeout(() => {
      document.querySelectorAll('.block.bg-green-600').forEach(hill => {
        if (Math.random() > 0.8) {
          hill.classList.add('two')
        }
        if (Math.random() > 0.9) {
          hill.classList.add('three')
        }
      })
    }, 1000)
  }

  const movePlayer = (x, y) => {

    let newX = playerPosition.x + x;
    let newY = playerPosition.y + y;

    // check if new position is in bounds and not a hill
    if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize &&
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
    let newTargetPosition = {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize)}
    while (hills.some(hill => hill.x === newTargetPosition.x && hill.y === newTargetPosition.y) ||
      (newTargetPosition.x === originalPosition.x && newTargetPosition.y === originalPosition.y)
    ) {
      newTargetPosition = {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize)}
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

  let resetBoard = () => {
    setScore(0)
    generateHills()
    moveTarget()

    setTimeout(() => {
      rotateBoard(1,60,360,-45)
    }, 1000)
  }

  useEffect(() => {
    generateHills()
    setTimeout(() => {
      rotateBoard(60, 360, -45)
    }, 500)
  }, []);

  return (
    <div className=' '>
      <section className='absolute top-8 right-8 flex gap-2'>
        {/* refresh button */}
        <button onClick={() => resetBoard()} type="button" className='text-2xl font-bold text-white px-4 py-2 bg-black bg-opacity-20 rounded-md'>
          {/* refresh icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
        <div className='text-2xl font-bold text-white px-6 py-2 bg-black bg-opacity-20 rounded-md'>
          Score: { score }
        </div>
      </section>
      
      <section className='  bg-orange-800 h-screen overflow-hidden  flex justify-center items-center'>
        {/* boardSize by boardSize table with rows and columns of equal size */}
        <div className=''>
          <div id="board" style={{transform: `rotateX(0deg) rotateY(360deg) rotateZ(0deg)`, gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`, height: `${(boardSize*12)/4}rem`, width: `${(boardSize*12)/4}rem`}} className={`  transition-all duration-1000 grid `}>
            {
              [...Array(boardSize*boardSize)].map((e, i) => {
                if (playerPosition.x === i % boardSize && playerPosition.y === Math.floor(i / boardSize)) {
                  return (
                    <div key={i} id="player" className='block bg-orange-600 before:bg-orange-800 after:bg-red-700 ' />
                  )
                } else if (targetPosition.x === i % boardSize && targetPosition.y === Math.floor(i / boardSize))  {
                  return (
                    <div key={i} id="target" className='block bg-blue-600 before:bg-blue-900 after:bg-blue-800 transition-transform duration-500 ' />             
                  )
                } else if (hills.some(hill => hill.x === i % boardSize && hill.y === Math.floor(i / boardSize))) {
                  return (
                    <div key={i} className={`block bg-green-600 before:bg-green-800 after:bg-cyan-600 transition-transform duration-500 `} />
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