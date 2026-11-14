const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8'),logic=source.slice(source.indexOf('function whiteLineTransition('),source.indexOf('function microRipples('));
let reduced=false,commits=0,removed=0,created=0;const timers=[],classes=new Set();
const context=vm.createContext({Promise,window:{matchMedia:()=>({matches:reduced})},document:{createElement(){created++;return {setAttribute(){},addEventListener(){},remove(){removed++}}},body:{appendChild(){},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}}},esc:s=>s,setTimeout:(fn,ms)=>{timers.push({fn,ms})},endAllRippleHolds(){},commit:()=>commits++});
vm.runInContext('let busy=false;\n'+logic,context);
(async()=>{
 const play=vm.runInContext("whiteLineTransition(commit)",context);assert.equal(commits,0);assert.equal(vm.runInContext('busy',context),true);assert.ok(classes.has('is-signal-break'));assert.equal(created,1);
 const first=timers.shift();assert.equal(first.ms,420);first.fn();await new Promise(resolve=>setImmediate(resolve));assert.equal(commits,1);assert.equal(removed,0);
 const second=timers.shift();assert.equal(second.ms,560);second.fn();await play;assert.equal(removed,1);assert.equal(vm.runInContext('busy',context),false);assert.equal(classes.size,0);
 const fail=vm.runInContext("whiteLineTransition(()=>{throw Error('commit failed')})",context);timers.shift().fn();await assert.rejects(fail,/commit failed/);assert.equal(vm.runInContext('busy',context),false);assert.equal(removed,2);assert.equal(classes.size,0);
 reduced=true;const before=created;await vm.runInContext("whiteLineTransition(commit)",context);assert.equal(commits,2);assert.equal(created,before);assert.equal(timers.length,0);
 assert.ok(!source.includes('구조 미리보기 · 컷씬 대사'));assert.ok(source.includes('class="cutscene-art"'));
 console.log('PASS: white-line transition timing, single mid-effect commit, error cleanup, reduced motion and removed temporary caption');
})().catch(e=>{console.error(e);process.exitCode=1});
