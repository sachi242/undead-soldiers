const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
test('launcher serves game assets but not source metadata or traversal paths',async()=>{
  const child=spawn(process.execPath,[require.resolve('../launch-game.cjs'),'--port=0','--no-browser'],{windowsHide:true});
  try{
    const url=await new Promise((resolve,reject)=>{let output='';child.stdout.on('data',d=>{output+=d;const m=output.match(/http:\/\/127\.0\.0\.1:\d+\//);if(m)resolve(m[0]);});child.on('error',reject);child.on('exit',code=>reject(Error('Server exited '+code)));setTimeout(()=>reject(Error('Launch timeout')),5000).unref();});
    for(const file of ['','room.js','bot-ai.js','soldier.js','animated-soldier.js','game-rules.js','assets/Soldier_01_animated.gltf','assets/Soldier_01.png'])assert.equal((await fetch(url+file)).status,200);
    assert.equal((await fetch(url+'assets/Soldier_01.png')).headers.get('content-type'),'image/png');
    assert.ok((await (await fetch(url)).text()).includes('TRAINING BOT'));
    for(const file of ['.git/config','AGENTS.md','../package.json','%2e%2e%2fpackage.json'])assert.equal((await fetch(url+file)).status,404);
  }finally{child.kill();}
});
