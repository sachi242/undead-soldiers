(function(scope){
  'use strict';
  scope.buildSoldier=function(T,material,mats){
    const group=new T.Group(),parts={},joints={},limbRig={};
    const mesh=(geometry,mat,parent,x=0,y=0,z=0)=>{const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
    const box=(w,h,d,mat,parent,x=0,y=0,z=0)=>mesh(new T.BoxGeometry(w,h,d),mat,parent,x,y,z);
    const joint=(r,parent,x=0,y=0,z=0)=>mesh(new T.SphereGeometry(r,10,8),mats.dark,parent,x,y,z);
    const part=(name,x,y,z)=>{const p=new T.Group();p.position.set(x,y,z);group.add(p);parts[name]=p;return p;};
    const body=part('body',0,1.14,0);
    box(.63,.65,.38,material,body);box(.45,.44,.1,mats.metal,body,0,.04,.24);
    box(.5,.18,.32,mats.dark,body,0,-.4,0);joint(.13,body,0,.43,0);
    for(const x of [-.19,.19])box(.15,.17,.13,mats.dark,body,x,-.15,.28);
    const head=part('head',0,1.82,0);mesh(new T.SphereGeometry(.205,14,10),mats.skin,head);box(.26,.09,.1,mats.dark,head,0,.015,.16);
    const helmet=part('helmet',0,1.96,0);mesh(new T.SphereGeometry(.25,14,8,0,Math.PI*2,0,Math.PI*.65),mats.metal,helmet);box(.5,.07,.45,mats.metal,helmet,0,-.05,.02);
    for(const side of [-1,1]){
      const name=side<0?'leftArm':'rightArm',arm=part(name,side*.44,1.46,0);
      joint(.14,arm);box(.24,.32,.26,material,arm,0,-.19,0);
      const elbow=new T.Group();elbow.position.y=-.38;arm.add(elbow);joint(.105,elbow);box(.19,.29,.21,material,elbow,0,-.17,0);joint(.1,elbow,0,-.35,0);
      joints[name]=elbow;limbRig[name]=arm;
      const legName=side<0?'leftLeg':'rightLeg',leg=part(legName,side*.19,.76,0);
      joint(.135,leg);box(.26,.32,.3,material,leg,0,-.18,0);
      const knee=new T.Group();knee.position.y=-.36;leg.add(knee);joint(.115,knee);box(.21,.29,.23,material,knee,0,-.16,0);box(.26,.13,.4,mats.dark,knee,0,-.33,.08);
      joints[legName]=knee;limbRig[legName]=leg;
    }
    // Torso mount survives arm loss, matching the mouth/rig firing mechanic.
    const weapon=new T.Group();weapon.position.set(.17,1.31,.3);group.add(weapon);
    box(.15,.15,.55,mats.dark,weapon,0,0,.2);box(.07,.07,.25,mats.metal,weapon,0,0,.58);
    const aura=new T.Mesh(new T.SphereGeometry(.78,12,8),mats.red);aura.scale.set(1,.65,1);aura.position.y=1.1;aura.visible=false;group.add(aura);
    function pose(time,moving,arms,legs,reloading=false,baseY=0){
      const phase=time*(legs===1?10:8),swing=moving?Math.sin(phase)*.65:0;
      for(const [name,p] of Object.entries(limbRig)){
        const sign=name.startsWith('left')?1:-1,isArm=name.endsWith('Arm');
        p.rotation.set(isArm?(reloading?-1.15:arms?-.6:0)+swing*sign*.35:swing*sign,0,0);
        joints[name].rotation.x=isArm?(reloading?-1.4:-.6):Math.max(0,-swing*sign)*.85;
      }
      body.rotation.z=legs===1&&moving?Math.sin(phase)*.08:legs===0?Math.sin(time*12)*.08:0;
      group.position.y=baseY+(legs===0?(arms===0?-1.02:-.8):legs===1&&moving?Math.abs(Math.sin(phase))*.16:0);
      weapon.rotation.x=reloading?-.7:0;
    }
    function setArmor(state){for(const name of ['leftArm','rightArm','leftLeg','rightLeg']){const plate=parts[name].children.find(m=>m.isMesh&&m.geometry.type==='BoxGeometry');if(plate)plate.material=state[name]?mats.metal:material;}}
    return {group,parts,joints,weapon,aura,pose,setArmor};
  };
  if(typeof module!=='undefined')module.exports=scope.buildSoldier;
})(typeof window!=='undefined'?window:globalThis);
