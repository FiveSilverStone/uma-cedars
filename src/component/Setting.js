import { useState } from 'react';
import Modal from 'react-modal';
import { rankUserCount, trackLineLength } from '../setting';

const customStyles = {
  overlay: {
    zIndex: 100
  },
  content: {
    top: '50%',
    left: '50%',
    width: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',    
  },
};



function Setting({ userList, setMaxCount }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [userListText, setUserListText] = useState(userList);
  const [rankCount, setRankCount] = useState(rankUserCount);
  const [distance, setDistance] = useState(trackLineLength)

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setMaxCount(rankCount);
    localStorage.setItem('rankCount', rankCount);
    localStorage.setItem('userList', userListText);
    localStorage.setItem('trackLineLength', distance);
  }

  return <>
    <button onClick={openModal}>설정 변경</button>
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <label style={{fontSize: '3em'}}>
          참가자:
          <textarea value={userListText} onChange={ e => setUserListText(e.target.value)} style={{fontSize: '1em', width: '100%'}} rows={5}></textarea>
        </label>
        <label style={{fontSize: '3em'}}>
          수상 등수:
          <input type='number' value={rankCount} onChange={ e => setRankCount(e.target.value)}  style={{fontSize: '1em', width: '100%'}} />
        </label>
        <label style={{fontSize: '3em'}}>
          트랙 길이: (화면 너비 * 배수)
          <input type='number' value={distance/100} onChange={ e => setDistance(e.target.value*100)}  style={{fontSize: '1em', width: '100%'}} />
        </label>
        <button onClick={closeModal}  style={{fontSize: '3em', marginTop:'20px', float: 'right'}}>저장하기</button>
      </Modal>
  </>
}

export default Setting;