import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import { useImmer } from 'use-immer';

import { trackLineLength, finishLinePosition, rankUserCount } from './setting';


import User from './component/User';

const userList = ['A', 'B', 'C', 'D', 'E', 'F']

const userData = userList.map(name => {
  return { 
    name, position: 0, isBunning: false, finished: false
  }
})

let rank = {
  name: null,
  position: 0,
};

let interval;

function App() {
  const [sequence, setSequence] = useState(0);
  const [users, setUsers] = useImmer(userData);
  const [rankUsers, setRankUsers] = useImmer([]);
  const scrollElement = useRef(null);
  const trackElement = useRef(null);

  const handleUserUpdate = (nextUser) => {    
    setUsers(draft => {
      const user = draft.find(t => t.name === nextUser.name)
      user.position = nextUser.position;
      user.finished = nextUser.finished;  
    })

    if(rank.position < nextUser.position) rank = nextUser;
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
    interval = setInterval(() => {
      setSequence(c => c + 1);
    }, 10);
    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {    
    scrollElement.current.scrollLeft = (rank.position - 1200);    
  }, [sequence]); 

  useEffect(() => {
    if(rankUsers.length >= rankUserCount) clearInterval(interval);    
  }, [rankUsers]);

  const remainDistance = finishDistance(rank.position);
  return (
    <div className="App">    
      <div className='top-board'>
        <div className='info-board'>
          <div>
            현재 1위: {rank.name}
          </div>
          <div>
            남은거리: {remainDistance}m
          </div>
        </div>
      </div> 
      <div id="scroll" ref={scrollElement}>
        <div className="track" ref={trackElement} style={{width: `${trackLineLength}vw`}}>
          {users.map((user) => <User sequence={sequence} user={user} handleUserUpdate={handleUserUpdate} handleFinish={handleFinish} />)}
          <div className="bush jump1"></div>
          <div className="bush jump2"></div>
          <div className="bush jump3"></div>
          <div className="bush jump4"></div>
          <div className="bush jump5"></div>
          <div className="bush jump6"></div>
          <div id="finishline" style={{marginLeft: `${finishLinePosition}vw`}} />
        </div>       
      </div>
      <div className='top-board'>
        <div className='info-board'>
          {rankUsers.map((user, idx)=><div>{idx+1}위: {user.name}</div>)}
        </div>
      </div>
    </div>
  );
}

export default App;
