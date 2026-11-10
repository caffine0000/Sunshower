const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync('dist/app.js','utf8'),logic=app.slice(app.indexOf('function microRipples('),app.indexOf('\nconst actions='));
let clock=0,nextId=0,reduced=false;const timers=new Map(),hits=[];
function advance(ms){const until=clock+ms;while(true){const due=[...timers].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;clock=due[1].at;timers.delete(due[0]);due[1].fn()}clock=until}
const context=vm.createContext({assert,hits,window:{matchMedia:()=>({matches:reduced})},setTimeout:(fn,ms)=>{const id=++nextId;timers.set(id,{fn,at:clock+ms});return id},clearTimeout:id=>timers.delete(id)});
vm.runInContext(logic+`\nrainImpact=e=>hits.push({x:e.clientX,y:e.clientY});`,context);
for(const value of [0,.999999]){const html=vm.runInContext(`microRipples(()=>${value})`,context),count=[...html.matchAll(/class="touch-ring touch-micro"/g)].length;assert.equal(count,value===0?2:6);for(const m of html.matchAll(/--ring-size:([0-9.]+)px/g))assert.ok(+m[1]>=10&&+m[1]<=24)}
for(let i=0;i<100;i++){const html=vm.runInContext('microRipples()',context),count=[...html.matchAll(/touch-micro/g)].length;assert.ok(count>=2&&count<=6);for(const m of html.matchAll(/--ring-size:([0-9.]+)px/g))assert.ok(+m[1]>=10&&+m[1]<=24)}
vm.runInContext(`beginRippleHold({button:0,pointerId:1,target:{},clientX:12,clientY:20})`,context);assert.equal(hits.length,1);advance(299);assert.equal(hits.length,1);advance(1);assert.equal(hits.length,2);
vm.runInContext(`moveRippleHold({pointerId:1,pointerType:'touch',target:{},clientX:35,clientY:46})`,context);advance(360);assert.equal(hits.at(-1).x,35);assert.equal(hits.at(-1).y,46);
vm.runInContext('endRippleHold(1)',context);const stopped=hits.length;advance(2000);assert.equal(hits.length,stopped);assert.equal(timers.size,0);
vm.runInContext(`for(let i=1;i<=6;i++)beginRippleHold({button:0,pointerId:i,target:{},clientX:i,clientY:0});assert.equal(rippleHolds.size,4);endAllRippleHolds();assert.equal(rippleHolds.size,0)`,context);assert.equal(timers.size,0);
reduced=true;const before=hits.length;vm.runInContext(`beginRippleHold({button:0,pointerId:9,target:{},clientX:0,clientY:0})`,context);assert.equal(hits.length,before);assert.equal(timers.size,0);
assert.ok(app.includes("['pointerup','pointercancel','lostpointercapture']"));assert.ok(app.includes("'visibilitychange'"));assert.ok(app.includes("'blur',endAllRippleHolds"));
console.log('PASS: random count/size bounds, hold timing, moving origin, release cleanup, simultaneous hold cap and reduced motion');
