import './User.css';
import { finishLinePosition, trackLineLength, defaultSpeed, bunningSpeed, staminaCorrectionSpeed } from '../setting';
import { useEffect, useState } from 'react';

function User({sequence, user, handleUserUpdate, handleFinish}) {
  const [bunning, setBunning] = useState({
    state: false,
    turn: 0
  });

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const checkBunningSequence = () => {
    let correctionRate = 1.0;
    if(user.stamina > 0) correctionRate = staminaCorrectionSpeed;
    const nextPosition = user.position+(Math.random() * defaultSpeed * bunningSpeed * correctionRate);

    handleUserUpdate({
      ...user,
      position: nextPosition,
      stamina: user.stamina <= 0 ? 0 : user.stamina - 1
    })

    const updateTurn = bunning.turn + 1;
    if(updateTurn > 200) setBunning({ state: false, turn: 0 });
    else setBunning({ ...bunning, turn: updateTurn });
  }

  useEffect(()=>{
    if(!user.finished){
      if(user.position >= window.innerWidth * (finishLinePosition/100) && user.position <= window.innerWidth * (trackLineLength/100)){
        handleFinish(user);
        handleUserUpdate({
          ...user,
          finished: true
        })
      } else if(sequence%100 === 0){
        if(!bunning.state && getRandomInt(1, 100) > 90 ) setBunning({ state: true, turn: 0});
      } else {
        if(bunning.state) checkBunningSequence();
        else {
          const nextPosition = user.position+(Math.random() * defaultSpeed);
          handleUserUpdate({
            ...user,
            position: nextPosition
          })
        }
      } 
    }
  },[sequence]);

  return (    
    <div id='horse2' className="horse runRight character runRight" style={{left: user.position}}>
      <div className="rider">
        <div className="head" />
        <div className="body" />
      </div>
      <span>{user.name}</span>
      {bunning.state ? <span className="bunning">버닝중!! {bunning.turn}</span> : null}
      <progress value={user.stamina} max={user.maxStamina}></progress>
    </div>        
  );
}

export default User;
