'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=__dirname;
const assets=new Set(['index.html','room.js','bot-ai.js','soldier.js']);
const portArg=process.argv.find(a=>a.startsWith('--port='));
const requested=portArg?Number(portArg.slice(7)):8080;
if(!Number.isInteger(requested)||requested<0||requested>65535){console.error('Invalid port');process.exit(1);}
const server=http.createServer((req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  let file;try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}catch{res.writeHead(400);res.end();return;}
  if(!assets.has(file)){res.writeHead(404);res.end('Not found');return;}
  fs.readFile(path.join(root,file),(err,data)=>{
    if(err){res.writeHead(404);res.end('Game asset missing');return;}
    res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:data);
  });
});
let port=requested;
server.on('error',err=>{
  if(err.code==='EADDRINUSE'&&requested!==0&&port<requested+10&&port<65535){port++;server.listen(port,'127.0.0.1');}
  else{console.error('Could not start game server: '+err.message);process.exitCode=1;}
});
server.on('listening',()=>{
  const url='http://127.0.0.1:'+server.address().port+'/';
  console.log('Undead Soldiers: '+url+'\nKeep this window open while playing. Close it or press Ctrl+C to stop.');
  if(process.platform==='win32'&&!process.argv.includes('--no-browser')){
    const browser=spawn(process.env.ComSpec||'cmd.exe',['/d','/s','/c','start "" "'+url+'"'],{windowsHide:true,stdio:'ignore'});
    browser.on('error',()=>console.log('Open the game URL above in your browser.'));
  }
});
server.listen(port,'127.0.0.1');
process.on('SIGINT',()=>server.close(()=>process.exit(0)));
