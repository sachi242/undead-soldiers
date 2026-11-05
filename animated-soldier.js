(function(scope){
  'use strict';
  const primitiveFactory=scope.buildSoldier;
  let template=null,pending=null;
  const visuals={
    setTemplate(scene,animations){template={scene,animations};pending=Promise.resolve(template);},
    load(T){
      if(pending)return pending;
      if(!T.GLTFLoader||!T.SkeletonUtils)return Promise.reject(Error('Character loader unavailable'));
      pending=new Promise((resolve,reject)=>new T.GLTFLoader().load('./assets/Soldier_01_animated.gltf',g=>{template=g;resolve(g);},undefined,reject));
      return pending;
    }
  };
  scope.SoldierVisuals=visuals;
  scope.buildSoldier=function(T,material,mats){
    const model=primitiveFactory(T,material,mats),fallbackPose=model.pose,fallbackArmor=model.setArmor;
    let visual=null,mixer=null,actions={},active=null,lastTime=null,fireUntil=-1,dying=false,fireAction=null,hitAction=null;
    let lastYaw=null,turnDelta=0,turnState='',turnUntil=-1;
    const colors=new Map();
    model.assetReady=visuals.load(T).then(g=>{
      const copy=T.SkeletonUtils.clone(g.scene),partGroups={},oldParts={};
      for(const name of Object.keys(model.parts)){oldParts[name]=model.parts[name];partGroups[name]=new T.Group();partGroups[name].name='damage_'+name;partGroups[name].visible=oldParts[name].visible;partGroups[name].userData=oldParts[name].userData;}
      const meshes=[];copy.traverse(m=>{if(m.isSkinnedMesh)meshes.push(m);});
      for(const mesh of meshes){
        const part=mesh.material.name.replace(/^UDS_/,'');if(!partGroups[part])throw Error('Unmapped character part '+part);
        const parent=mesh.parent;if(!partGroups[part].parent)parent.add(partGroups[part]);partGroups[part].add(mesh);
        mesh.frustumCulled=false;mesh.castShadow=true;mesh.receiveShadow=true;mesh.material=mesh.material.clone();mesh.material.map&&(mesh.material.map.magFilter=T.NearestFilter);
        mesh.userData={...partGroups[part].userData};colors.set(mesh,mesh.material.color.clone());
      }
      for(const [name,part] of Object.entries(partGroups)){if(!part.children.length)throw Error('Missing mesh '+name);oldParts[name].parent?.remove(oldParts[name]);model.parts[name]=part;}
      visual=new T.Group();visual.name='Soldier_01_Mixamo';visual.rotation.y=Math.PI;
      visual.scale.setScalar(2.05/2.95624125);visual.add(copy);model.group.add(visual);
      mixer=new T.AnimationMixer(copy);
      for(const clip of g.animations){actions[clip.name]=mixer.clipAction(clip);if(/death|jump$|land$|turn(?:Left|Right)$/.test(clip.name)){actions[clip.name].setLoop(T.LoopOnce,1);actions[clip.name].clampWhenFinished=true;}}
      function overlay(name){const clip=g.animations.find(c=>c.name==='mixamo_'+name);if(!clip)return null;const upper=clip.clone();upper.name=name+'_upper_body';upper.tracks=upper.tracks.filter(t=>/Torso|Neck|Head|[LR]_(Shoulder|Arm_Lower|Hand)/.test(t.name));return mixer.clipAction(upper).setLoop(T.LoopOnce,1);}
      fireAction=overlay('fire');hitAction=overlay('hit');
      model.assetLoaded=true;const status=scope.document?.querySelector?.('#undead-arena .status');if(status)status.textContent='Soldier_01 + Mixamo animations loaded · click arena to capture mouse';
      return model;
    }).catch(error=>{
      model.assetError=String(error.message||error);const status=scope.document?.querySelector?.('#undead-arena .status');if(status)status.textContent='Character asset failed to load · procedural fallback active';return model;
    });
    model.trigger=(type,time)=>{
      if(dying)return;
      if(type==='fire'){fireUntil=time+.27;if(fireAction&&!hitAction?.isRunning())fireAction.reset().setEffectiveWeight(1).play();}
      if(type==='hit'&&hitAction){fireAction?.stop();hitAction.reset().setEffectiveWeight(1).play();}
    };
    model.playDeath=()=>{dying=true;fireAction?.stop();hitAction?.stop();return !!visual;};model.isDying=()=>dying;
    model.revive=()=>{dying=false;lastTime=null;lastYaw=null;turnDelta=0;turnUntil=-1;active=null;if(mixer)mixer.stopAllAction();};
    model.animationName=()=>active?.getClip().name;
    model.pose=function(time,moving,arms,legs,reloading=false,baseY=0,context={}){
      if(!visual){fallbackPose(time,moving,arms,legs,reloading,baseY);return;}
      const dt=lastTime===null?0:Math.min(.1,Math.max(0,time-lastTime));lastTime=time;
      const yaw=model.group.rotation.y;
      if(lastYaw!==null&&!moving&&!reloading&&!context.airborne&&legs>0&&!dying){const delta=yaw-lastYaw;turnDelta+=Math.atan2(Math.sin(delta),Math.cos(delta));if(Math.abs(turnDelta)>.38&&time>=turnUntil){turnState=turnDelta>0?'turnLeft':'turnRight';turnUntil=time+.65;turnDelta=0;}}
      else{turnDelta=0;turnUntil=-1;}
      lastYaw=yaw;
      const motion=context.motion||'forward';
      const locomotion=motion==='back'?(context.sprint?'backRun':'backWalk'):motion==='left'?(context.sprint?'strafeFastLeft':'strafeLeft'):motion==='right'?(context.sprint?'strafeFastRight':'strafeRight'):context.walking?'walk':'run';
      let state=dying||context.dead?'death':legs===0?(reloading?'proneReload':arms===0?'lowCrawl':'crawl'):reloading?'reload':context.airborne?'jump':context.landing?'land':context.slide?'crouch':moving?locomotion:time<turnUntil?turnState:'idle';
      const name='mixamo_'+state,action=actions[name]||actions.Idle_Weapon;
      if(action&&action!==active){action.reset().setEffectiveWeight(1).fadeIn(.12).play();if(state==='land')action.time=Math.max(0,action.getClip().duration-.45);if(active)active.fadeOut(.12);active=action;}
      if(active&&(state==='run'||state==='walk'||state.startsWith('strafe')||state.startsWith('back')||state==='crawl'||state==='lowCrawl'))active.setEffectiveTimeScale(moving?1:0);
      if(active&&state==='run'&&context.sprint)active.setEffectiveTimeScale(1.35);
      if(fireAction&&time>fireUntil&&fireAction.isRunning())fireAction.fadeOut(.08);
      mixer.update(dt);model.group.position.y=baseY;
      // Limb groups are independent skinned meshes: visibility never scales the torso.
      model.weapon.position.set(.17,legs===0?.28:1.31,.3);
    };
    model.setArmor=function(state){if(!visual){fallbackArmor(state);return;}for(const name of ['leftArm','rightArm','leftLeg','rightLeg'])model.parts[name].traverse(m=>{if(m.isMesh&&colors.has(m))m.material.color.copy(colors.get(m)).multiplyScalar(state[name]?1:.68);});};
    return model;
  };
  if(typeof module!=='undefined')module.exports={install:factory=>{scope.buildSoldier=factory;},visuals};
})(typeof window!=='undefined'?window:globalThis);
