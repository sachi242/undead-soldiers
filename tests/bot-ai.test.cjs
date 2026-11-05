const {test}=require('node:test');
const assert=require('node:assert/strict');
const {BotBrain,ArenaNavigator}=require('../bot-ai.js');
const perception={visible:true,aimedAt:false,distance:12,arms:2,legs:2,limbs:4};
test('bot fires a finite magazine then reloads without firing',()=>{
  const b=new BotBrain(()=>.75);let shots=0,sawReload=false;
  for(let i=0;i<100;i++) {const before=b.reload,c=b.update(.1,perception);if(c.fire)shots++;if(before>0){assert.equal(c.fire,false);sawReload=true;}if(sawReload&&b.reload===0)break;}
  assert.equal(shots,8);assert.equal(sawReload,true);assert.equal(b.ammo,8);
});
test('occluded targets cannot be fired at and require reacquisition',()=>{
  const b=new BotBrain();for(let i=0;i<30;i++)assert.equal(b.update(.1,{...perception,visible:false}).fire,false);
  assert.equal(b.update(.1,perception).fire,false);
});
test('aim threat causes dodge with cooldown; legless bot cannot dodge',()=>{
  const b=new BotBrain(()=>.1);assert.equal(b.update(.1,{...perception,aimedAt:true}).mode,'dodge');
  for(let i=0;i<5;i++)b.update(.1,perception);
  assert.notEqual(b.update(.1,{...perception,aimedAt:true}).mode,'dodge');
  b.reset();assert.notEqual(b.update(.1,{...perception,aimedAt:true,legs:0,limbs:2}).mode,'dodge');
});
test('limbless bot prioritizes regeneration over reload or shooting',()=>{
  const b=new BotBrain();b.ammo=0;b.reload=1;
  assert.deepEqual(b.update(.1,{...perception,arms:0,legs:0,limbs:0}),{state:'TOMBSTONE RUSH',speed:5.8,fire:false,mode:'relic'});
});
test('navigation routes around walls rather than through them',()=>{
  const pass=(x,z)=>!(Math.abs(x)<.7&&Math.abs(z)<3),n=new ArenaNavigator(pass,1.5);
  const path=n.route({x:-6,z:0},{x:6,z:0});assert.ok(path.length>8);
  for(const p of path)assert.equal(pass(p.x,p.z),true);
  assert.ok(Math.hypot(path.at(-1).x-6,path.at(-1).z)<1.6);
});
