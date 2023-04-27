import React, { useState } from "react";
import { createStage, checkCollision } from "../gameHelpers";

// Styled Components
import { StyledTetris, StyledTetrisWrapper } from "./styles/StyledTetris";

//Custom Hooks
import { useInterval } from '../hooks/useInterval'
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Display from "./Display";
import Stage from "./Stage";
import StartButton from "./StartButton";

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  console.log("re-render");

  const movePlayer = (dir) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const startGame = () => {
    console.log("test");
    //Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
  };

  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) *10) {
      setLevel(prev => prev + 1);
      // Allso increase speed
      setDropTime(1000 / (level + 1) + 200);
    }
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      //Game Over
      if (player.pos.y < 1) {
        console.log("GAME OVER");
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropToBottom = () => {
    console.log("★★★★★★★★★★★★★★★★★★11111111");
    if(checkCollision !== true) {
      console.log("★★★★★★★★★★★★★★★★★★2222222");
      
      if (player.pos.y === 0) {
        console.log("★★★★★★★★★★★★★★★★★★33333333333");
        setDropTime(1000 / (level + 1) + 200);
      }
    } 
    
  }

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        console.log("interval on");
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  }

  const dropPlayer = () => {
    console.log("interval off");
    setDropTime(null);
    drop();
  };

  let flagHold = true;
  const move = ({ keyCode }) => {
    
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
        console.log("xxxxxxxxxxxxxxxxxxxx"+player.pos.y);
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      } else if (keyCode === 32) {
        //updatePlayerPos({ x: 0, y: 0, collided: true });
       // const test = () => {
       //   setDropTime(1);
       // }
       dropToBottom(); 
       // test();
        //drop();
      } /*else if (keyCode === 13) {
        if (flagHold===true) {
        setDropTime(null);
        flagHold = false;
        } else {
          setDropTime(1000 / (level + 1) + 200);
        }
        
      }*/
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);


  return (
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Row: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame}/>
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
