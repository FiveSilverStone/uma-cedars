import { finishLinePosition, sectionData } from './setting';

const { early, mid, end } = sectionData;
const sectionWidth = {
  early : window.innerWidth * (finishLinePosition * early / 100),
  mid : window.innerWidth * (finishLinePosition * mid / 100),
  end : window.innerWidth * (finishLinePosition * end / 100)
}

export const getCurrentSection = (position) => {
  if(position >= 0 && position <= sectionWidth.early) return { section: 'early', msg: '초반' };
  else if(position >= sectionWidth.early && position <= sectionWidth.mid) return { section: 'mid', msg: '중반' };
  else if(position >= sectionWidth.mid && position <= sectionWidth.end) return { section: 'end', msg:'종반' };
  else return { section: 'last', msg:'마지막 스퍼트' };
}