const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),Three=require('three');
const {BotBrain,ArenaNavigator}=require('../bot-ai.js'),buildSoldier=require('../soldier.js');
test('game initializes one bot and runs movement, weapon and limb lifecycles without a browser',()=>{
  const elements=new Map();
  function element(key){if(!elements.has(key))elements.set(key,{textContent:'',hidden:false,disabled:false,value:'',clientWidth:900,clientHeight:480,isConnected:true,classList:{add(){},remove(){},toggle(){}},appendChild(){},focus(){},matches(){return true;},contains(){return false;},closest(){return null;},addEventListener(){}});return elements.get(key);}
  const root=element('root');root.querySelector=element;
  class Renderer{constructor(){this.shadowMap={};this.domElement=element('canvas');}setPixelRatio(){}setSize(){}render(scene){scene.updateMatrixWorld(true);}dispose(){}}
  let frame;
  const context={THREE:{...Three,WebGLRenderer:Renderer},BotBrain,ArenaNavigator,buildSoldier,GameRules:require('../game-rules.js'),
    PinRoom:class{constructor(){this.role=null;}send(){}},
    document:{getElementById:()=>root,addEventListener(){},pointerLockElement:null,activeElement:null},
    devicePixelRatio:1,ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){this.fn();}disconnect(){}},
    performance:{now:()=>0},requestAnimationFrame:fn=>frame=fn,setTimeout:()=>0,clearTimeout(){},console,addEventListener(){}};
  context.window=context;vm.createContext(context);
  const html=fs.readFileSync(require.resolve('../index.html'),'utf8'),script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('const root='));
  vm.runInContext(script.replace(/\}\)\(\);\s*$/,`globalThis.testGame={bots,fire,detach,restoreBot,switchWeapon,doReload,reset,impact,switchView,playerHit,finishable,updateVertical,keys,getState:()=>({arms,legs,helmet,parts:{...localParts},armor:{...localArmor},rush,wallActive,groundY}),setPosition:(x,y,z)=>{player.set(x,0,z);groundY=y;velocity=0;},getRelic:()=>relic,getAmmo:()=>ammo,getWeapon:()=>weaponIndex,getEffects:()=>effects.length};})();`),context);
  const game=context.testGame;assert.equal(game.bots.length,1);
  element('.enter').onclick();
  // Keep player alive while exercising the bot's full regeneration timer.
  const decide=game.bots[0].brain.update.bind(game.bots[0].brain);
  game.bots[0].brain.update=(dt,p)=>decide(dt,{...p,visible:false});
  for(let t=16;t<2500;t+=16)frame(t);
  assert.ok(element('.bot-readout').textContent.includes('TRAINING BOT'));
  game.switchWeapon();assert.equal(game.getWeapon(),1);assert.equal(game.getAmmo(),24);
  for(let t=2500;t<3000;t+=16)frame(t);game.fire();assert.equal(game.getAmmo(),23);assert.ok(game.getEffects()>0);
  game.doReload();for(let t=3000;t<4500;t+=16)frame(t);assert.equal(game.getAmmo(),24);
  for(const part of ['leftArm','rightArm','leftLeg','rightLeg'])game.detach(game.bots[0],part);
  assert.equal(game.bots[0].limbs,0);assert.ok(game.bots[0].relic);
  for(let t=4500;t<10000;t+=16)frame(t);
  assert.ok(game.bots[0].limbs===4||!game.bots[0].alive);
  game.reset();assert.equal(game.bots.length,1);assert.equal(game.bots[0].limbs,4);
  game.switchView();frame(10016); // Exercise third-person camera and own model.
  game.playerHit('head');assert.equal(game.getState().helmet,false);
  for(const limb of ['leftArm','rightArm','leftLeg','rightLeg']){game.playerHit(limb);game.playerHit(limb);}
  assert.equal(game.getState().arms+game.getState().legs,0);assert.ok(game.getState().rush>0);
  const relic=game.getRelic();game.setPosition(relic.position.x,0,relic.position.z);frame(10032);
  assert.equal(game.getState().arms+game.getState().legs,4);assert.equal(game.getState().helmet,true);
  assert.ok(Object.values(game.getState().parts).every(Boolean));assert.ok(Object.values(game.getState().armor).every(Boolean));
  game.setPosition(6.05,1,-7);game.keys.Space=true;game.keys.KeyW=true;game.updateVertical(.016,1,0,0,0);
  assert.equal(game.getState().wallActive,true);
  game.keys.Space=false;game.keys.KeyW=false;
});
