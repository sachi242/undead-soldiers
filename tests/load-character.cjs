const fs=require('node:fs'),vm=require('node:vm'),T={...require('three')};
const ctx={THREE:T,TextDecoder,console,setTimeout,clearTimeout,atob,Blob,fetch,URL};ctx.window=ctx;ctx.self=ctx;vm.createContext(ctx);
for(const script of ['loaders/GLTFLoader.js','utils/SkeletonUtils.js'])vm.runInContext(fs.readFileSync(require.resolve('three/examples/js/'+script),'utf8'),ctx);
async function loadCharacter(){
  const g=JSON.parse(fs.readFileSync(require.resolve('../assets/Soldier_01_animated.gltf'),'utf8'));
  // Omit image loading only in the headless check; retain geometry, skins and clips.
  for(const m of g.materials)delete m.pbrMetallicRoughness.baseColorTexture;
  delete g.images;delete g.textures;
  return new Promise((resolve,reject)=>new T.GLTFLoader().parse(JSON.stringify(g),'',resolve,reject));
}
module.exports={T,loadCharacter};
