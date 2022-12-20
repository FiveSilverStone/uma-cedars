import './App.css';
import { useEffect, useState, useRef } from 'react';
import { useImmer } from 'use-immer';
import { getCurrentSection } from './module';

import { trackLineLength, finishLinePosition, rankUserCount, defaultMaxStamina, sectionData, traitList } from './setting';
import Setting from './component/Setting';


import User from './component/User';

const userList = localStorage.getItem('userList') ? localStorage.getItem('userList').split(',') : ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const settingRandomTrait = () => {
  return traitList[Math.floor(Math.random() * traitList.length)];
}

const userData = userList.map(name => {
  return { 
    name, 
    position: 0,
    isBunning: false, 
    finished: false,
    nowSection: getCurrentSection(0),
    stamina: defaultMaxStamina,
    maxStamina: defaultMaxStamina,
    trait: settingRandomTrait()
  }
})

let topRankUser = {
  name: null,
  position: 0,
};

let interval;

function App() {
  const [sequence, setSequence] = useState(0);
  const [maxCount, setMaxCount] = useState(rankUserCount);  
  const [users, setUsers] = useImmer(userData);
  const [rankUsers, setRankUsers] = useImmer([]);
  const [isStart, setIsStart] = useState(false);
  const scrollElement = useRef(null);
  const trackElement = useRef(null);

  const handleUserUpdate = (nextUser) => {    
    setUsers(draft => {
      const user = draft.find(t => t.name === nextUser.name)
      user.position = nextUser.position;
      user.nowSection = getCurrentSection(nextUser.position).section;
      user.finished = nextUser.finished;
      user.stamina = nextUser.stamina;
      user.maxStamina = nextUser.maxStamina;
    })

    if(topRankUser.position < nextUser.position) topRankUser = nextUser;
  }

  const handleFinish = (user) => {
    setRankUsers(draft => {
      const findExist = draft.find(topUser => topUser.name === user.name);
      if(!findExist) draft.push(user);
    });
  }

  const finishDistance = (rankPosition) => {
    const distance = parseInt((window.innerWidth*(finishLinePosition/100)) - rankPosition);
    return distance > 0 ? distance : 0;
  }

  useEffect(() => {
    if(isStart) {
      interval = setInterval(() => {
        setSequence(c => c + 1);
      }, 10);
    }    
  }, [isStart]); 

  useEffect(() => {    
    scrollElement.current.scrollLeft = (topRankUser.position - 1700);    
  }, [sequence]); 

  useEffect(() => {
    if(rankUsers.length >= maxCount) {
      clearInterval(interval);    
      setIsStart(false);
    }
  }, [rankUsers]);

  const remainDistance = finishDistance(topRankUser.position);
  const nowSection = getCurrentSection(topRankUser.position);
  const { early, mid, end, last } = sectionData;

  const topBushs = [];
  const bottomBushs = [];
  for(let i=0; i <= trackLineLength; i++){
    if(i % 30 === 0) {
      topBushs.push(<div className="bush top" style={{left: `${i}vw`}} key={`bush${i}`} />);
      bottomBushs.push(<div className="bush bottom" style={{left: `${i}vw`}} key={`bush${i}`} />);
    }
  }  

  return (
    <div className="App">
      <a className="help" href="https://gainful-appendix-a7a.notion.site/d825304e6e7a49ac86fd7e8727ea4732" target="_blank" rel="noreferrer">?</a>
      <div className='top-board'>
        {isStart || (
          <div className='btn-panel'>
            <Setting userList={userList} setMaxCount={setMaxCount} />
            <button onClick={()=> window.location.reload()}>준비</button>
            {rankUsers.length > 0 || <button onClick={()=>setIsStart(true)}>시작하기</button>}
          </div>)
        }        
        <div className={`info-board ${rankUsers.length >= maxCount ? 'move-center' : null} ${rankUsers.length <= maxCount && isStart ? '' : 'hidden'}`}>
          {rankUsers.length > 0 ? 
            <>
              {rankUsers.map((user, idx)=><div key={user.name}>{idx+1}위: {user.name}</div>)}
            </>
            :
            <>
              <div>
                현재 1위: {topRankUser.name}
              </div>
              <div>
                남은거리: {remainDistance}m
              </div>
            </>
          }          
        </div>
      </div>
      <div className='nowSection'>{nowSection.msg}!!!</div>
      <div id="scroll" ref={scrollElement}>
        <div className="track" ref={trackElement} style={{width: `${trackLineLength}vw`}}>
          {topBushs}
          <div className="section early" 
                style={{
                  width: `${finishLinePosition * early}vw`, 
                }}/>
          <div className="section mid"
              style={{
                width: `${finishLinePosition * (mid - early)}vw`,
                marginLeft: `${finishLinePosition * early}vw`,
              }}/>
          <div className="section end" 
              style={{
                width: `${finishLinePosition * (end - mid)}vw`, 
                marginLeft: `${finishLinePosition * mid}vw`,
              }}/>
          <div className="section last" 
              style={{
                width: `${finishLinePosition * (last - end)}vw`, 
                marginLeft: `${finishLinePosition * end}vw`,
              }}/>
          <div id="finishline" style={{marginLeft: `${finishLinePosition}vw`}} />
          {users.map((user) => {
            return <User 
                      key={user.name}
                      sequence={sequence} user={user} 
                      handleUserUpdate={handleUserUpdate} 
                      handleFinish={handleFinish}
                      isStart={isStart}
                    /> 
            })}
          {bottomBushs}
        </div>
      </div>
    </div>
  );
}

export default App;
