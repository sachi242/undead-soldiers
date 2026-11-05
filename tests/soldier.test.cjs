const {test}=require('node:test');
const assert=require('node:assert/strict');
const T=require('three'),build=require('../soldier.js');
const material=new T.MeshBasicMaterial();
function soldier(){return build(T,material,{dark:material,metal:material,skin:material,red:material});}
test('limbs have joint pivots and raycastable children',()=>{
  const b=soldier();for(const name of ['leftArm','rightArm','leftLeg','rightLeg']){
    assert.ok(b.parts[name].isGroup);assert.ok(b.joints[name].isGroup);assert.ok(b.parts[name].children.length>=3);
    b.parts[name].visible=false;assert.equal(b.parts.body.visible,true);b.parts[name].visible=true;
  }
  b.group.updateMatrixWorld(true);const hits=new T.Raycaster(new T.Vector3(0,1.82,3),new T.Vector3(0,0,-1)).intersectObjects([b.parts.head],true);assert.ok(hits.length);
});
test('pose keeps detached limbs hidden and preserves airborne remote height',()=>{
  const b=soldier();b.parts.leftArm.visible=false;b.pose(1,true,1,2,true,2);
  assert.equal(b.parts.leftArm.visible,false);assert.equal(b.group.position.y,2);assert.notEqual(b.joints.rightArm.rotation.x,0);
  b.pose(2,true,0,0);assert.equal(b.group.position.y,-1.02);assert.ok(b.weapon.parent===b.group);
});
