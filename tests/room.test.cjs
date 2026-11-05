const {test}=require('node:test');
const assert=require('node:assert/strict');
const {EventEmitter}=require('node:events');
const PinRoom=require('../room.js');
class Connection extends EventEmitter {
  constructor(){super();this.open=false;this.sent=[];this.bufferSize=0;}
  send(data){this.sent.push(data);}
  close(){this.open=false;this.closed=true;this.emit('close');}
}
class Peer extends EventEmitter {
  static peers=[];
  constructor(id){super();this.id=id;Peer.peers.push(this);}
  connect(id){this.target=id;return this.outgoing=new Connection();}
  destroy(){this.destroyed=true;}
}
function setup(){let events=[],packets=[];return {events,packets,room:new PinRoom(Peer,(...args)=>events.push(args),p=>packets.push(p))};}
test('PIN preserves leading zeros and rejects ambiguous inputs',()=>{
  for(const p of ['0000','0042','9999'])assert.equal(PinRoom.validPin(p),true);
  for(const p of ['123','12345','12a4',1234,' 1234'])assert.equal(PinRoom.validPin(p),false);
  const {room}=setup();room.start('guest','oops');assert.equal(room.peer,null);
});
test('host advertises PIN after signaling opens and admits only one guest',()=>{
  const {room,events}=setup();room.start('host');const peer=room.peer;
  assert.match(room.pin,/^\d{4}$/);assert.equal(peer.id,PinRoom.id(room.pin));
  peer.emit('open');assert.equal(events.at(-1)[0],'waiting');
  const one=new Connection();peer.emit('connection',one);one.open=true;one.emit('open');
  assert.equal(events.at(-1)[0],'connected');
  const two=new Connection();peer.emit('connection',two);two.open=true;two.emit('open');
  assert.deepEqual(two.sent,[{type:'full'}]);assert.equal(two.closed,true);assert.equal(room.connection,one);room.leave();
});
test('join routes to the correct room and closes on disconnect',()=>{
  const {room,events,packets}=setup();room.start('guest','0042');const peer=room.peer;peer.emit('open');
  assert.equal(peer.target,'undead-soldiers-v1-0042');let c=peer.outgoing;c.open=true;c.emit('open');
  c.emit('data',{type:'state',x:3});assert.equal(packets.length,1);assert.equal(room.send({type:'hit'}),true);
  c.bufferSize=21;assert.equal(room.send({type:'state'}),false);
  c.close();assert.equal(room.role,null);assert.equal(peer.destroyed,true);assert.equal(events.at(-1)[0],'error');
});
test('stale events cannot revive a room after leaving',()=>{
  const {room,events}=setup();room.start('host');const peer=room.peer;room.leave();const n=events.length;
  peer.emit('open');peer.emit('error',{type:'network'});assert.equal(events.length,n);assert.equal(room.peer,null);
});
test('occupied host PIN retries and missing guest PIN yields useful error',()=>{
  const {room,events}=setup();room.start('host');const first=room.peer;first.emit('error',{type:'unavailable-id'});
  assert.notEqual(room.peer,first);assert.equal(first.destroyed,true);room.leave();
  room.start('guest','1234');room.peer.emit('error',{type:'peer-unavailable'});
  assert.match(events.at(-1)[1],/Room not found/);assert.equal(room.peer,null);
});
test('missing library fails without breaking solo play',()=>{
  let result;new PinRoom(null,(...a)=>result=a,()=>{}).start('host');assert.equal(result[0],'error');
});
