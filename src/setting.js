// 경기장 총 길이, 화면 너비의 vw로 잡음
// ex) 680 -> 화면 너비의 6.8배
export const trackLineLength = parseInt(localStorage.getItem('trackLineLength')) || 880;
export const finishLinePosition = trackLineLength - 30;
export const rankUserCount = parseInt(localStorage.getItem('rankCount')) || 3;

export const sprintRate = 0.05;
export const sprintDurationRate = 1.0;

export const defaultSpeed = 6;
export const sprintSpeed = 1.3;
export const staminaCorrectionSpeed = 1.3;

export const defaultMaxStamina = 1000;

export const sectionData = {
  early: 0.2,
  mid: 0.5,
  end: 0.8,
  last: 1.0
}

export const traitList = [{
  id: 1,
  name: '선수필승',
  desc: '초반 구간에서 질주속도가 증가',
  detail: [
    '초반 구간부터 중반 구간 전까지 질주속도 45% 증가하고 질주 발생 확률이 두배로 증가'
  ],
  trigger: (c)=> c.section==='early' && c.section !=='mid',
  effect: {
    target: 'sprintSpeed',
    type: '',
    value: 1.75
  }
},{
  id: 2,
  name: '페이스업',
  desc: '중반 구간에서 질주속도가 증가',
  detail: [
    '중반 구간부터 종반 구간 전까지 질주속도 30% 증가하고 질주 발생 확률이 두배로 증가'
  ],
  trigger: (c)=> c.section==='mid' && c.section !=='end',
  effect: {
    target: 'sprintSpeed',
    type: '',
    value: 1.6
  }
},{
  id: 3,
  name: '뒷심',
  desc: '종반 구간에서 질주속도가 증가',
  detail: [
    '종반 구간부터 라스트 스퍼트 구간 전까지 질주속도 30% 증가하고 질주 발생 확률이 두배로 증가'
  ],
  trigger: (c)=> c.section==='end' && c.section !=='last',
  effect: {
    target: 'sprintSpeed',
    type: '',
    value: 1.6
  }
},{
  id: 4,
  name: '죽기살기',
  desc: '라스트 스퍼트때 질주속도 증가',
  detail: [
    '라스트 스퍼트 구간 부터 질주속도 70% 증가하고 질주 발생 확률이 두배로 증가'
  ],
  trigger: (c)=> c.section==='last',
  effect: {
    target: 'sprintSpeed',
    type: '',
    value: 2
  }
}]