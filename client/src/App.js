import React, { useEffect, useState } from 'react';
import {useKey, useKeyPress} from 'react-use';

function App() {

  let [playerPosition, setPlayerPosition] = useState({
    x: 4,
    y: 3
  });

  const movePlayer = (x, y) => {

    let newX = playerPosition.x + x;
    let newY = playerPosition.y + y;

    if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {

    } else {
      setPlayerPosition({
        x: newX,
        y: newY
      })
    }
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
    <section className='absolute bottom-0 right-0 bg-gray-800 h-1/4 w-1/4 text-white'>
        { playerPosition.x }, {playerPosition.y}
    </section>
      <section className=' bg-gray-800 h-screen overflow-hidden  flex justify-center items-center'>
        {/* 8 by 8 table with rows and columns of equal size */}
        <div id="board" className=' transition-all duration-500 grid grid-cols-8 grid-rows-8 gap-0 w-96 h-96'>
          {/* 64 squares */}
          {
            [...Array(64)].map((e, i) => {
              return (
                <div key={i} className='w-12 h-12 border-2 border-black bg-white'>
                  {
                    // if the square is the player's position, render the player
                    playerPosition.x === i % 8 && playerPosition.y === Math.floor(i / 8) ?
                      <div className='w-full h-full bg-red-500'></div>
                      :
                      null
                  }
                </div>
              )
            }
            )
          }
        </div>



      </section>



    </div>
  );
}

export default App;