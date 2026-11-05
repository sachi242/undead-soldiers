const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {T,loadCharacter}=require('./load-character.cjs');
test('provided character loads with seven damage regions and twelve retargeted clips',async()=>{
  const g=await loadCharacter(),meshes=[];g.scene.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);});
  assert.equal(meshes.length,7);assert.equal(g.animations.filter(a=>a.name.startsWith('mixamo_')).length,12);
  assert.ok(g.animations.some(a=>a.name==='Idle_Weapon'));
  for(const mesh of meshes){assert.equal(mesh.skeleton.bones.length,16);assert.ok(mesh.geometry.index.count>0);}
  const bone=g.scene.getObjectByName('L_Arm_Lower'),mixer=new T.AnimationMixer(g.scene),before=bone.quaternion.clone();
  mixer.clipAction(g.animations.find(a=>a.name==='mixamo_reload')).play();mixer.update(.6);g.scene.updateMatrixWorld(true);
  assert.ok(before.angleTo(bone.quaternion)>.05);
  for(const mesh of meshes)for(let i=0;i<mesh.geometry.attributes.position.count;i+=41){const p=new T.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,i);mesh.boneTransform(i,p);assert.ok(p.toArray().every(Number.isFinite));assert.ok(p.length()<20);}
});
test('independent animated actors retain limb visibility and gameplay tags',async()=>{
  const g=await loadCharacter(),ctx={THREE:T,console,document:{querySelector:()=>null},Promise};ctx.window=ctx;vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(require.resolve('../soldier.js'),'utf8'),ctx);
  vm.runInContext(fs.readFileSync(require.resolve('../animated-soldier.js'),'utf8'),ctx);ctx.SoldierVisuals.setTemplate(g.scene,g.animations);
  const m=new T.MeshBasicMaterial(),mats={dark:m,metal:m,skin:m,red:m};
  const a=ctx.buildSoldier(T,m,mats),b=ctx.buildSoldier(T,m,mats);a.parts.leftArm.userData={part:'leftArm',bot:{id:'test'}};
  await Promise.all([a.assetReady,b.assetReady]);assert.equal(a.assetLoaded,true,a.assetError);assert.equal(b.assetLoaded,true,b.assetError);
  assert.equal(a.parts.leftArm.children[0].userData.part,'leftArm');a.parts.leftArm.visible=false;
  a.pose(0,true,1,2);a.pose(.1,true,1,2);b.pose(.1,false,2,2,true);
  assert.equal(a.parts.leftArm.visible,false);assert.equal(b.parts.leftArm.visible,true);
  const askin=a.parts.body.children[0],bskin=b.parts.body.children[0];assert.notEqual(askin.skeleton.bones[0],bskin.skeleton.bones[0]);
  a.trigger('fire',.2);a.pose(.2,false,1,2);assert.equal(a.playDeath(),true);a.pose(.3,false,1,2);a.revive();assert.equal(a.isDying(),false);
});
