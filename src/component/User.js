import './User.css';
import { useEffect, useState } from 'react';

function User({sequence, user, handleUserUpdate}) {
  const [position, setPosition] = useState(0);
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
    const nextPosition = user.position+(Math.random()*6 * 1.3);

    handleUserUpdate({
      ...user,
      position: nextPosition
    })

    const updateTurn = bunning.turn + 1;
    if(updateTurn > 200) setBunning({ state: false, turn: 0 });
    else setBunning({ ...bunning, turn: updateTurn });
  }

  useEffect(()=>{
    if(sequence%100 === 0){
      if(!bunning.state && getRandomInt(1, 100) > 90 ) setBunning({ state: true, turn: 0});
    } else {
      if(bunning.state) checkBunningSequence();
      else {
        const nextPosition = user.position+(Math.random()*6);
        
        // setPosition(nextPosition);
        handleUserUpdate({
          ...user,
          position: nextPosition
        })
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
    </div>        
  );
}

export default User;
