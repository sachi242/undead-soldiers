/* Bake Mixamo motion into the supplied Blockbench rig; retain its original clips. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),T={...require('three')};
const root=path.join(__dirname,'..'),input=path.join(root,'assets/Soldier_01.gltf');
const g=JSON.parse(fs.readFileSync(input,'utf8'));
const ctx={THREE:T,fflate:require('three/examples/js/libs/fflate.min.js'),TextDecoder,console,window:{URL}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(require.resolve('three/examples/js/loaders/FBXLoader.js'),'utf8'),ctx);
function accessor(index){const a=g.accessors[index],v=g.bufferViews[a.bufferView],b=Buffer.from(g.buffers[v.buffer].uri.split(',')[1],'base64'),C={5126:Float32Array,5123:Uint16Array,5125:Uint32Array,5121:Uint8Array}[a.componentType],n={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}[a.type];return new C(b.buffer,b.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*n);}
const chunks=[];let offset=0;g.buffers.push({byteLength:0,uri:''});const bufferIndex=g.buffers.length-1;
function append(values,type,componentType=5126){const C=componentType===5126?Float32Array:Uint16Array,data=Buffer.from(new C(values).buffer);while(offset%4){chunks.push(Buffer.alloc(1));offset++;}const view=g.bufferViews.push({buffer:bufferIndex,byteOffset:offset,byteLength:data.length})-1;chunks.push(data);offset+=data.length;const width={SCALAR:1,VEC3:3,VEC4:4}[type],a={bufferView:view,componentType,count:values.length/width,type};if(type==='SCALAR'&&componentType===5126){a.min=[Math.min(...values)];a.max=[Math.max(...values)];}return g.accessors.push(a)-1;}
const joints=g.skins[0].joints,primitive=g.meshes[0].primitives[0],positions=accessor(primitive.attributes.POSITION),weights=accessor(primitive.attributes.WEIGHTS_0),indices=accessor(primitive.indices),skinIndices=accessor(primitive.attributes.JOINTS_0);
function region(vertex){let strongest=0;for(let k=1;k<4;k++)if(weights[vertex*4+k]>weights[vertex*4+strongest])strongest=k;const name=g.nodes[joints[skinIndices[vertex*4+strongest]]].name;if(/^L_(Shoulder|Arm|Hand)/.test(name))return 'leftArm';if(/^R_(Shoulder|Arm|Hand)/.test(name))return 'rightArm';if(/^L_(Thigh|Leg|Foot)/.test(name))return 'leftLeg';if(/^R_(Thigh|Leg|Foot)/.test(name))return 'rightLeg';if(name==='Head')return positions[vertex*3+1]>1.2?'helmet':'head';return 'body';}
const regions=Object.fromEntries(['body','head','helmet','leftArm','rightArm','leftLeg','rightLeg'].map(k=>[k,[]]));
for(let i=0;i<indices.length;i+=3){const tri=Array.from(indices.slice(i,i+3)),votes=tri.map(region);const part=votes.find(x=>votes.filter(y=>x===y).length>=2)||votes[0];regions[part].push(...tri);}
g.meshes[0].primitives=Object.entries(regions).map(([name,values])=>{if(!values.length)throw Error('Empty damage region '+name);const mat=structuredClone(g.materials[0]);mat.name='UDS_'+name;const material=g.materials.push(mat)-1;return {attributes:primitive.attributes,indices:append(values,'SCALAR',5123),material,extras:{gamePart:name}};});
g.nodes[16].name='SoldierRoot'; // Avoid collision with the actual Hips bone.
const target=g.nodes.map((n,i)=>{const o=new T.Bone();o.name=n.name;o.position.fromArray(n.translation||[0,0,0]);o.quaternion.fromArray(n.rotation||[0,0,0,1]);o.scale.fromArray(n.scale||[1,1,1]);return o;});
g.nodes.forEach((n,i)=>(n.children||[]).forEach(k=>target[i].add(target[k])));target[16].updateMatrixWorld(true);
const bind=target.map(o=>o.getWorldQuaternion(new T.Quaternion()));
const mapping={Hips:'Hips',Torso:'Spine2',Neck:'Neck',Head:'Head',L_Shoulder:'LeftArm',L_Arm_Lower:'LeftForeArm',L_Hand:'LeftHand',R_Shoulder:'RightArm',R_Arm_Lower:'RightForeArm',R_Hand:'RightHand',L_Thigh:'LeftUpLeg',L_Leg_Lower:'LeftLeg',L_Foot:'LeftFoot',R_Thigh:'RightUpLeg',R_Leg_Lower:'RightLeg',R_Foot:'RightFoot'};
const next={Hips:'Spine',Spine2:'Neck',Neck:'Head',Head:'HeadTop_End',LeftArm:'LeftForeArm',LeftForeArm:'LeftHand',LeftHand:'LeftHandMiddle1',RightArm:'RightForeArm',RightForeArm:'RightHand',RightHand:'RightHandMiddle1',LeftUpLeg:'LeftLeg',LeftLeg:'LeftFoot',LeftFoot:'LeftToeBase',RightUpLeg:'RightLeg',RightLeg:'RightFoot',RightFoot:'RightToeBase'};
const sources={idle:'Rifle Aiming Idle',run:'Rifle Run',fire:'Firing Rifle',strafe:'Rifle Side Step',crouch:'Rifle Crouch Walk',reload:'Reloading',proneReload:'Prone Reloading',crawl:'Prone Forward',lowCrawl:'Low Crawl',jump:'Jump',land:'Jumping Down',death:'Rifle Death'};
const basis=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),Math.PI),basisInverse=basis.clone().invert(),summary=[];
for(const [name,file] of Object.entries(sources)){
  const bytes=fs.readFileSync(path.join(root,'assets/animations/mixamo',file+'.fbx')),source=new T.FBXLoader().parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');source.updateMatrixWorld(true);
  const bones={};source.traverse(o=>{if(o.isBone)bones[o.name.replace(/^mixamorig:?/,'')]=o;});
  const sourceBind={},alignment={};
  for(const index of joints){const n=g.nodes[index],sourceName=mapping[n.name],bone=bones[sourceName];if(!bone)throw Error('Missing source '+sourceName);sourceBind[index]=bone.getWorldQuaternion(new T.Quaternion());
    const childIndex=(n.children||[]).find(k=>joints.includes(k));let direction=childIndex!==undefined?target[childIndex].getWorldPosition(new T.Vector3()).sub(target[index].getWorldPosition(new T.Vector3())):target[index].getWorldPosition(new T.Vector3()).sub(target[index].parent.getWorldPosition(new T.Vector3()));
    if(n.name==='Head')direction.set(0,1,0);
    const child=bones[next[sourceName]],sourceDirection=child?child.getWorldPosition(new T.Vector3()).sub(bone.getWorldPosition(new T.Vector3())):new T.Vector3(0,1,0);
    alignment[index]=new T.Quaternion().setFromUnitVectors(direction.normalize(),sourceDirection.applyQuaternion(basis).normalize());
  }
  const clip=source.animations[0],mixer=new T.AnimationMixer(source);mixer.clipAction(clip).play();
  const frameCount=Math.ceil(clip.duration*30)+1,times=[],rotations=Object.fromEntries(joints.map(i=>[i,[]])),hipPositions=[];
  const hipScale=g.nodes[16].translation[1]/bones.Hips.getWorldPosition(new T.Vector3()).y;
  for(let frame=0;frame<frameCount;frame++){
    const t=Math.min(frame/30,Math.max(0,clip.duration-1e-6));times.push(t);mixer.setTime(t);source.updateMatrixWorld(true);
    const desired={};
    for(const i of joints){const sourceBone=bones[mapping[g.nodes[i].name]];desired[i]=basis.clone().multiply(sourceBone.getWorldQuaternion(new T.Quaternion())).multiply(sourceBind[i].clone().invert()).multiply(basisInverse).multiply(alignment[i]).multiply(bind[i]).normalize();}
    for(const i of joints){const parentIndex=g.nodes.findIndex(n=>(n.children||[]).includes(i)),parentQ=desired[parentIndex]||bind[parentIndex]||new T.Quaternion(),q=parentQ.clone().invert().multiply(desired[i]).normalize(),values=rotations[i];if(values.length){const last=new T.Quaternion().fromArray(values,values.length-4);if(last.dot(q)<0)q.set(-q.x,-q.y,-q.z,-q.w);}values.push(...q.toArray().map(v=>+v.toFixed(6)));}
    const h=bones.Hips.getWorldPosition(new T.Vector3());hipPositions.push(0,+(h.y*hipScale-g.nodes[16].translation[1]).toFixed(6),0);
  }
  const timeAccessor=append(times,'SCALAR'),animation={name:'mixamo_'+name,samplers:[],channels:[],extras:{source:file,retargeted:true,rootMotion:'XZ removed; vertical posture retained'}};
  for(const i of joints){const sampler=animation.samplers.push({input:timeAccessor,output:append(rotations[i],'VEC4'),interpolation:'LINEAR'})-1;animation.channels.push({sampler,target:{node:i,path:'rotation'}});}
  const sampler=animation.samplers.push({input:timeAccessor,output:append(hipPositions,'VEC3'),interpolation:'LINEAR'})-1;animation.channels.push({sampler,target:{node:15,path:'translation'}});
  g.animations.push(animation);summary.push({name:animation.name,source:file+'.fbx',frames:times.length,duration:times.at(-1)});mixer.stopAllAction();mixer.uncacheRoot(source);
}
const binary=Buffer.concat(chunks);g.buffers[bufferIndex]={byteLength:binary.length,uri:'data:application/octet-stream;base64,'+binary.toString('base64')};g.asset.extras={retarget:'Mixamo world-space rest alignment to Blockbench rig, 30fps',runtimeFacingCorrection:'Y rotation PI',regions:Object.keys(regions)};
fs.writeFileSync(path.join(root,'assets/Soldier_01_animated.gltf'),JSON.stringify(g));fs.writeFileSync(path.join(root,'assets/animations/retarget-report.json'),JSON.stringify({mapping,clips:summary},null,2)+'\n');console.log('Baked '+summary.length+' Mixamo clips; preserved original idle clips; '+Object.values(regions).map(x=>x.length/3).join('/')+' triangles per region.');
// Correct foot penetration after fitting the motion to different limb lengths.
// Vertical world travel belongs to the game controller, including jumping.
ctx.window=ctx;ctx.self=ctx;ctx.atob=atob;ctx.setTimeout=setTimeout;ctx.clearTimeout=clearTimeout;ctx.Blob=Blob;ctx.URL=URL;
vm.runInContext(fs.readFileSync(require.resolve('three/examples/js/loaders/GLTFLoader.js'),'utf8'),ctx);
const headless=structuredClone(g);for(const m of headless.materials)delete m.pbrMetallicRoughness.baseColorTexture;delete headless.images;delete headless.textures;
new T.GLTFLoader().parse(JSON.stringify(headless),'',loaded=>{
  const mixer=new T.AnimationMixer(loaded.scene),meshes=[];loaded.scene.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);});
  for(const definition of g.animations.filter(a=>a.name.startsWith('mixamo_'))){
    mixer.stopAllAction();const clip=loaded.animations.find(c=>c.name===definition.name);mixer.clipAction(clip).reset().play();
    const channel=definition.channels.find(c=>c.target.node===15&&c.target.path==='translation'),sampler=definition.samplers[channel.sampler],view=g.bufferViews[g.accessors[sampler.output].bufferView],values=new Float32Array(binary.buffer,binary.byteOffset+view.byteOffset,g.accessors[sampler.output].count*3),timesView=g.bufferViews[g.accessors[sampler.input].bufferView],times=new Float32Array(binary.buffer,binary.byteOffset+timesView.byteOffset,g.accessors[sampler.input].count);
    for(let frame=0;frame<times.length;frame++){
      mixer.setTime(times[frame]);loaded.scene.updateMatrixWorld(true);let min=Infinity;
      for(const mesh of meshes){mesh.skeleton.update();for(const index of new Set(mesh.geometry.index.array)){const p=new T.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,index);mesh.boneTransform(index,p);p.applyMatrix4(mesh.matrixWorld);min=Math.min(min,p.y);}}
      values[frame*3+1]-=min;
    }
  }
  g.buffers[bufferIndex].uri='data:application/octet-stream;base64,'+binary.toString('base64');g.asset.extras.floorPolicy='Root XZ removed; sampled visible geometry grounded; game physics owns world elevation';
  fs.writeFileSync(path.join(root,'assets/Soldier_01_animated.gltf'),JSON.stringify(g));console.log('Grounded all retargeted clips for controller-driven movement.');
},error=>{console.error(error);process.exitCode=1;});
