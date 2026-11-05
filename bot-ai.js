(function(scope){
  'use strict';
  // Navigation and decisions are independent of rendering for deterministic checks.
  class ArenaNavigator {
    constructor(walkable,step=1.5){this.walkable=walkable;this.step=step;this.limit=18;}
    route(from,to){
      const s=this.step,limit=this.limit,key=(x,z)=>x+','+z;
      const cell=p=>[Math.max(-limit,Math.min(limit,Math.round(p.x/s))),Math.max(-limit,Math.min(limit,Math.round(p.z/s)))];
      const [sx,sz]=cell(from),[tx,tz]=cell(to),start=key(sx,sz);
      const queue=[[sx,sz]],parents=new Map([[start,null]]);let end=null,best=start,bestDist=Infinity;
      for(let i=0;i<queue.length;i++){
        const [x,z]=queue[i],k=key(x,z),d=Math.hypot(x-tx,z-tz);
        if(d<bestDist){bestDist=d;best=k;}if(d<1){end=k;break;}
        for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nx=x+dx,nz=z+dz,nk=key(nx,nz);
          if(Math.abs(nx)>limit||Math.abs(nz)>limit||parents.has(nk)||!this.walkable(nx*s,nz*s))continue;
          // Check intermediate samples so a grid edge cannot cut through thin cover.
          if(!this.walkable((x+dx*.5)*s,(z+dz*.5)*s))continue;
          parents.set(nk,k);queue.push([nx,nz]);
        }
      }
      const result=[];for(let k=end||best;k&&k!==start;k=parents.get(k)){const [x,z]=k.split(',').map(Number);result.push({x:x*s,z:z*s});}
      return result.reverse();
    }
  }
  class BotBrain {
    constructor(random=Math.random){this.random=random;this.reset();}
    reset(){this.state='ACQUIRE';this.ammo=8;this.reload=0;this.cooldown=.8;this.dodge=0;this.dodgeCooldown=0;this.aimTime=0;this.threat=0;this.direction=1;this.strafeClock=0;}
    threatened(){this.threat=.6;}
    update(dt,p){
      for(const k of ['cooldown','dodgeCooldown','threat'])this[k]=Math.max(0,this[k]-dt);
      let fire=false;
      if(p.limbs===0){this.state='TOMBSTONE RUSH';return {state:this.state,speed:5.8,fire:false,mode:'relic'};}
      const mobility=p.legs===0?.48:p.legs===1?1.3:p.arms===0?4.3:p.arms===1?3.7:3.4;
      if(this.reload>0){this.reload=Math.max(0,this.reload-dt);this.state='RELOAD';if(this.reload===0)this.ammo=8;return {state:this.state,speed:mobility,fire:false,mode:'cover'};}
      if(this.ammo===0){this.reload=p.arms===0?2.6:1.8;this.state='RELOAD';return {state:this.state,speed:mobility,fire:false,mode:'cover'};}
      this.aimTime=p.visible?this.aimTime+dt:0;
      if(this.dodge>0){this.dodge=Math.max(0,this.dodge-dt);this.state='DODGE';return {state:this.state,speed:mobility*1.65,fire:false,mode:'dodge',direction:this.direction};}
      if(p.visible&&(p.aimedAt||this.threat>0)&&this.dodgeCooldown===0&&p.legs>0){
        this.dodge=.38;this.dodgeCooldown=1.4;this.direction=this.random()<.5?-1:1;this.aimTime=0;
        this.state='DODGE';return {state:this.state,speed:mobility*1.65,fire:false,mode:'dodge',direction:this.direction};
      }
      this.strafeClock-=dt;if(this.strafeClock<=0){this.strafeClock=1+this.random();this.direction*=-1;}
      let mode=!p.visible?'pursue':p.distance<7?'retreat':p.distance>16?'pursue':'strafe';
      this.state=!p.visible?'FLANK':mode==='retreat'?'RETREAT':'STRAFE';
      if(p.visible&&p.distance<27&&this.aimTime>.65&&this.cooldown===0){
        fire=true;this.ammo--;this.cooldown=p.arms===0?.8:.4;
      }
      return {state:this.state,speed:mobility,fire,mode,direction:this.direction};
    }
  }
  scope.BotBrain=BotBrain;scope.ArenaNavigator=ArenaNavigator;
  if(typeof module!=='undefined')module.exports={BotBrain,ArenaNavigator};
})(typeof window!=='undefined'?window:globalThis);
