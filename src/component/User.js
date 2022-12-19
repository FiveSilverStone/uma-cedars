import './User.css';
import { finishLinePosition, trackLineLength, defaultSpeed, sprintSpeed, staminaCorrectionSpeed } from '../setting';
import { useEffect, useState } from 'react';

function User({sequence, user, handleUserUpdate, handleFinish}) {
  const [sprint, setSprint] = useState({
    state: false,
    turn: 0
  });
  const [activeTrait, setActiveTrait] = useState(null);  
  const [nowSprintSpeed, setNowSprintSpeed] = useState(sprintSpeed);
  const { trait } = user;

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const checkSprintSequence = () => {
    let correctionRate = 1.0;
    if(user.stamina > 0) correctionRate = staminaCorrectionSpeed;
    const nextPosition = user.position+(Math.random() * defaultSpeed * nowSprintSpeed * correctionRate);

    handleUserUpdate({
      ...user,
      position: nextPosition,
      stamina: user.stamina <= 0 ? 0 : user.stamina - 1
    })

    const updateTurn = sprint.turn + 1;
    if(updateTurn > 200) setSprint({ state: false, turn: 0 });
    else setSprint({ ...sprint, turn: updateTurn });
  }

  useEffect(()=>{
    if(!user.finished){
      if(trait.trigger({section: user.nowSection})){
        setActiveTrait(trait.name);
        setNowSprintSpeed(trait.effect.value);
      } else { 
        setActiveTrait(null);
        setNowSprintSpeed(sprintSpeed);
      }

      if(user.position >= window.innerWidth * (finishLinePosition/100) && user.position <= window.innerWidth * (trackLineLength/100)){
        handleFinish(user);
        handleUserUpdate({
          ...user,
          finished: true
        })
      } else if(sequence%100 === 0){
        if(!sprint.state && getRandomInt(1, 100) > (100 - parseInt(10 * (activeTrait? 2.0 : 1.0)))) setSprint({ state: true, turn: 0});
      } else {
        if(sprint.state) checkSprintSequence();
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

  useEffect(()=>{
    console.log(activeTrait);
    console.log(nowSprintSpeed);
  },[activeTrait])
  return (
    <>
      <div className={`horse${trait.id} horse runRight character runRight`} style={{left: user.position}}>
        <div className="rider">
          <div className="head" />
          <div className="body" />
        </div>
        <span className="username">{user.name} <span>({trait.name})</span></span>
        {activeTrait ? <span className="active-skill"> {activeTrait}!! </span> : null }
        <progress value={user.stamina} max={user.maxStamina}></progress>
        {sprint.state? 
          <>
            <div className="sprint back effect" />
            <div className="sprint front effect" />
          </> 
          : null
        }
        
      </div>     

    </>       
  );
}

export default User;
