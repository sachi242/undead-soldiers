(function(scope){
  'use strict';
  const LIMBS=['leftArm','rightArm','leftLeg','rightLeg'];
  function movement(arms,legs,base=7){
    if(arms===0&&legs===0)return {speed:base*.15*1.4,height:.35,wallTime:0,label:'WORM CRAWL · +40% CRAWL'};
    if(legs===0)return {speed:base*.15,height:.6,wallTime:0,label:'ARM DRAG · −85%'};
    if(legs===1)return {speed:base*.4,height:1.25,wallTime:1.2,label:'SINGLE-LEG HOP · −60%'};
    return {speed:base*(arms===0?1.3:arms===1?1.1:1),height:1.75,wallTime:arms===0?3.4:2.2,label:arms===0?'RIG FIRING · +30%':arms===1?'OFF-HAND · +10%':'STRUCTURE INTACT'};
  }
  function armor(){return Object.fromEntries(LIMBS.map(k=>[k,true]));}
  function hit(state,part){
    if(part==='head'||part==='helmet'){
      if(state.helmet){state.helmet=false;return {kind:'helmet'};}
      return {kind:'eliminated'};
    }
    if(part==='body')part=LIMBS.find(k=>state.parts[k]);
    if(!part||!LIMBS.includes(part)||!state.parts[part])return {kind:'torso'};
    if(state.armor[part]){state.armor[part]=false;return {kind:'armor',part};}
    state.parts[part]=false;return {kind:'limb',part};
  }
  const rules={LIMBS,movement,armor,hit};scope.GameRules=rules;
  if(typeof module!=='undefined')module.exports=rules;
})(typeof window!=='undefined'?window:globalThis);
