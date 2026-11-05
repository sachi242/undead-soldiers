const {test}=require('node:test'),assert=require('node:assert/strict');
const rules=require('../game-rules.js');
test('limb movement and wall-run durations follow the design matrix',()=>{
  assert.equal(rules.movement(2,2).speed,7);
  assert.ok(Math.abs(rules.movement(1,2).speed-7.7)<1e-8);
  assert.equal(rules.movement(0,2).wallTime,3.4);
  assert.equal(rules.movement(2,1).wallTime,1.2);
  assert.equal(rules.movement(2,0).wallTime,0);
  assert.ok(Math.abs(rules.movement(0,0).speed/rules.movement(2,0).speed-1.4)<1e-8);
});
test('armor breaks before a targeted limb is severed; body hits cannot kill',()=>{
  const state={helmet:true,parts:Object.fromEntries(rules.LIMBS.map(k=>[k,true])),armor:rules.armor()};
  assert.equal(rules.hit(state,'leftArm').kind,'armor');assert.equal(state.parts.leftArm,true);
  assert.equal(rules.hit(state,'leftArm').kind,'limb');assert.equal(state.parts.leftArm,false);
  for(let i=0;i<20;i++)assert.notEqual(rules.hit(state,'body').kind,'eliminated');
  assert.equal(rules.hit(state,'head').kind,'helmet');assert.equal(rules.hit(state,'head').kind,'eliminated');
});
