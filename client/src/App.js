import React, { useEffect, useState } from 'react';
import {useKey} from 'react-use';

function App() {

  let boardSize = 30;
  let [playerPosition, setPlayerPosition] = useState({x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize)});
  let [targetPosition, setTargetPosition] = useState({x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize)});

  let [score, setScore] = useState(0);
  let [scoreAnimation, setScoreAnimation] = useState(false);

  let [hills, setHills] = useState([])

  let [translate, setTranslate] = useState({
    translateX: 0,
    translateY: 0,
  })

  let [boardTransform, setBoardTransform] = useState({
    scale: 0.75,
    rotateX: 0,
    rotateY: 360,
    rotateZ: 0,
  })

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
      moveBoard(newX, newY)
    }

    if (newX === targetPosition.x && newY === targetPosition.y) {
      moveTarget()

      setScore(score + 1)
      setScoreAnimation(true)
      setTimeout(() => {
        setScoreAnimation(false)
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

  // move board to correspond with player position
  const moveBoard = (x, y) => {
    setTranslate({
      translateX: ((-x -y) * 10) + (boardSize*10),
      translateY: ((-y +x) * 10) + (boardSize*5),
    })
  }

  // rotate the board
  const rotateBoard = (scale, x, y, z) => {
    setBoardTransform({
      scale: scale,
      rotateX: x,
      rotateY: y,
      rotateZ: z,
    })
  }

  //create a variable to store the scale down size
  // it should be a decimal between 0 and 1, larger for smaller board sizes and smaller for larger board sizes
  let boardScaleDownSize = 1.0 - (boardSize * 0.02)

  let resetBoard = () => {
    setScore(0)
    generateHills()
    moveTarget()
    moveBoard(playerPosition.x, playerPosition.y)

    setTimeout(() => {
      rotateBoard(1,60,360,-45)
    }, 1000)
  }

  useEffect(() => {
    generateHills()
    moveTarget()

    setTimeout(() => {
      rotateBoard(1,60,360,-45)
      moveBoard(playerPosition.x, playerPosition.y)
    }, 1000)
  }, []);

  // usekey to change view
  useKey('v', () => {
    rotateBoard(boardScaleDownSize,0,360,0)
    moveBoard(0, 0)

    setTimeout(() => {
      rotateBoard(1,60,360,-45)
      moveBoard(playerPosition.x, playerPosition.y)
    }, 1500)
  }, {}, []);

  useKey('ArrowUp', () => movePlayer(0, -1), {}, [playerPosition]);
  useKey('ArrowDown', () => movePlayer(0, 1), {}, [playerPosition]);
  useKey('ArrowLeft', () => movePlayer(-1, 0), {}, [playerPosition]);
  useKey('ArrowRight', () => movePlayer(1, 0), {}, [playerPosition]);

  return (
    <div className=' '>
      <section className='absolute top-8 right-8 flex gap-2 z-50'>
        {/* refresh button */}
        <button onClick={() => resetBoard()} type="button" className='text-2xl font-bold text-white px-4 py-2 bg-black bg-opacity-80 rounded-md'>
          {/* refresh icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
        <div className='text-2xl font-bold text-white px-6 py-2 bg-black bg-opacity-80 rounded-md'>
          Score: { score }
        </div>
      </section>
      
      <section className='  bg-orange-800 h-screen overflow-hidden  flex justify-center items-center'>
        {/* boardSize by boardSize table with rows and columns of equal size */}
        <div style={{transform: ` translateX(${translate.translateX}px) translateY(${translate.translateY}px)`}} className=' transition-transform duration-200 '>
          <div
            id="board"
            className={`  transition-all duration-1000 grid `}
            style={{
              transform: `scale(${boardTransform.scale}) rotateX(${boardTransform.rotateX}deg) rotateY(${boardTransform.rotateY}deg) rotateZ(${boardTransform.rotateZ}deg)`,
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
              height: `${(boardSize*12)/4}rem`,
              width: `${(boardSize*12)/4}rem`}}
          >
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