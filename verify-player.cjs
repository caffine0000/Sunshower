const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),storage=new Map();
function node(s){if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){}},addEventListener(){},setAttribute(){},focus(){},showModal(){},close(){}});return nodes.get(s)}
const ctx={console,assert,process,window:{},document:{querySelector:node,addEventListener(){},querySelectorAll(){return []}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},crypto:require('node:crypto').webcrypto,TextEncoder,TextDecoder,btoa,atob,setTimeout(fn){fn()},clearTimeout(){},confirm:()=>true};
const code=fs.readFileSync('dist/engine.mjs','utf8').replace(/export /g,'')+'\n'+fs.readFileSync('dist/app.js','utf8').replace(/^import .*?;\n/,'');
vm.runInNewContext(code+`
 project.stats=[{id:'stat-will',name:'의지',min:0,max:10,initial:2}];
 save=normalizePlayer({build:{name:'캐릭터',stats:{'stat-will':7},completed:false}});
 render();assert.ok($('#app').innerHTML.includes('start-screen'));assert.ok($('#app').innerHTML.includes('여우비와'));assert.ok(!$('#app').innerHTML.includes('CYOA STUDIO'));actions.enter();assert.equal(screen,'game');assert.equal(playerTab,'building');assert.ok($('#app').innerHTML.includes('build-next'));assert.ok($('#app').innerHTML.includes('build-cutscene'));assert.ok(!$('#app').innerHTML.includes('class="player-tabs"'));actions.menu();assert.ok($('#modalBody').innerHTML.includes('익스트렉션/인스크립트'));assert.ok($('#modalBody').innerHTML.includes('Suitcase of Investigator'));assert.ok(!$('#modalBody').innerHTML.includes('nav-group'));assert.equal(($('#modalBody').innerHTML.match(/class="nav-icon-slot"/g)||[]).length,5);
 actions['build-next']();actions['build-next']();$('#cutsceneStat').value='7';actions['build-next']();assert.ok($('#app').innerHTML.includes('build-complete'));actions['build-complete']();assert.equal(save.build.completed,true);assert.ok(!$('#app').innerHTML.includes('data-action="build-complete"'));
 for(const tab of ['story','bonds','info','transfer']){actions['player-tab'](tab);assert.ok($('#app').innerHTML.includes('player-panel'))}
 const backup=encodePlayer(project,save);save=normalizePlayer();$('#playerInput').value=backup;actions['player-restore']();assert.equal(save.build.name,'캐릭터');assert.equal(save.build.stats['stat-will'],7);assert.equal(save.build.completed,true);
 loadSave();assert.equal(save.build.name,'캐릭터');
 actions['title-screen']();assert.equal(screen,'start');actions.enter();assert.equal(playerTab,'story');assert.equal(save.build.name,'캐릭터');assert.ok($('#app').innerHTML.includes('rain-layer'));assert.equal(project.title,'여우비와 커튼월');
 (async()=>{save=normalizePlayer();const first=replay(project,save).scene.choices[0];const pending=choose(first.id);assert.equal(busy,true);await choose(first.id);await pending;assert.equal(save.history.length,1);assert.equal(busy,false);console.log('PASS: rain transition locks duplicate choices; start screen, drawer, building, import and save preservation');})().catch(e=>{console.error(e);process.exitCode=1});
`,ctx);
