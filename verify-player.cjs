const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),storage=new Map();
function node(s){if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){}},addEventListener(){},showModal(){},close(){}});return nodes.get(s)}
const ctx={console,assert,window:{},document:{querySelector:node,addEventListener(){},querySelectorAll(){return []}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},crypto:require('node:crypto').webcrypto,TextEncoder,TextDecoder,btoa,atob,setTimeout(){},clearTimeout(){},confirm:()=>true};
const code=fs.readFileSync('dist/engine.mjs','utf8').replace(/export /g,'')+'\n'+fs.readFileSync('dist/app.js','utf8').replace(/^import .*?;\n/,'');
vm.runInNewContext(code+`
 project.stats=[{id:'stat-will',name:'의지',min:0,max:10,initial:2}];
 save=normalizePlayer({build:{name:'캐릭터',stats:{'stat-will':7},completed:false}});
 mode='play';render();assert.ok($('#app').innerHTML.includes('추출/입력'));assert.ok($('#app').innerHTML.includes('build-complete'));
 actions['build-complete']();assert.equal(save.build.completed,true);assert.ok(!$('#app').innerHTML.includes('data-action="build-complete"'));
 for(const tab of ['story','bonds','info','transfer']){actions['player-tab'](tab);assert.ok($('#app').innerHTML.includes('player-panel'))}
 const backup=encodePlayer(project,save);save=normalizePlayer();$('#playerInput').value=backup;actions['player-restore']();assert.equal(save.build.name,'캐릭터');assert.equal(save.build.stats['stat-will'],7);assert.equal(save.build.completed,true);
 loadSave();assert.equal(save.build.name,'캐릭터');
 console.log('PASS: five-tab rendering, building-to-summary transition, full import and reload preservation');
`,ctx);
