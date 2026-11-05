const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),THREE={...require('three')};
const fflate=require('three/examples/js/libs/fflate.min.js');
const context={THREE,fflate,TextDecoder,console,window:{URL}};vm.createContext(context);
vm.runInContext(fs.readFileSync(require.resolve('three/examples/js/loaders/FBXLoader.js'),'utf8'),context);
const dir=path.join(root,'assets/animations/mixamo');
const clips=fs.readdirSync(dir).filter(f=>/\.fbx$/i.test(f)).sort().map(file=>{
  const bytes=fs.readFileSync(path.join(dir,file)),buffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
  const model=new THREE.FBXLoader().parse(buffer,'');
  if(!model.animations.length)throw Error(file+' has no animation');
  return {file,role:file.toLowerCase()==='y bot.fbx'?'reference rig':'motion',bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),clips:model.animations.map(a=>({name:a.name,durationSeconds:a.duration,tracks:a.tracks.length}))};
});
const manifest={source:'https://www.mixamo.com/',updated:'2026-11-05',sourceRig:'Y Bot / Mixamo',bakeFPS:30,status:'Loose FBX sources only; archives ignored. Runtime uses assets/Soldier_01_animated.gltf',clips};
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(clips.map(c=>({file:c.file,seconds:c.clips[0].durationSeconds,tracks:c.clips[0].tracks})),null,2));
