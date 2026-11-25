const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),storage=new Map(),listeners=new Map();
function node(s){if(!nodes.has(s))nodes.set(s,{html:'',htmlWrites:0,get innerHTML(){return this.html},set innerHTML(value){this.html=value;this.htmlWrites++},textContent:'',value:'',dataset:{},style:{setProperty(key,value){this[key]=value}},classList:{values:new Set(),add(...names){names.forEach(n=>this.values.add(n))},remove(...names){names.forEach(n=>this.values.delete(n))},contains(n){return this.values.has(n)},toggle(n,on){if(on)this.add(n);else this.remove(n)}},addEventListener(){},setAttribute(){},appendChild(child){child.parentNode=this;child.isConnected=true},matches(selector){return selector===':popover-open'&&this.popoverOpen===true},showPopover(){this.popoverOpen=true;this.popoverShows=(this.popoverShows||0)+1},hidePopover(){this.popoverOpen=false},focus(){},showModal(){this.open=true;this.openCount=(this.openCount||0)+1},close(){this.open=false}});return nodes.get(s)}
const dispatch=(type,event)=>{for(const listener of listeners.get(type)||[])listener(event)};
const rootAttributes=new Map(),audio={
 src:'assets/sunshower-bgm.m4a',volume:1,muted:false,paused:true,duration:NaN,currentTime:0,loadCount:0,
 getAttribute(name){return name==='src'?this.src:null},
 load(){this.paused=true;this.duration=NaN;this.currentTime=0;this.loadCount++},
 play(){this.paused=false;return Promise.resolve()},
 pause(){this.paused=true},
 addEventListener(){}
},giftTimers=[],session=new Map(),cookieJar=new Map(),cookieWrites=[],confirmState={answer:true,calls:0};
const imageTest={data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/nS8AAAAASUVORK5CYII=',width:1600,height:800,closed:0,frames:[],large:0,failStorage:false};
const ctx={console,assert,process,dispatch,storage,audio,rootAttributes,imageTest,giftTimers,session,cookieJar,cookieWrites,confirmState,createImageBitmap:async()=>({width:imageTest.width,height:imageTest.height,close(){imageTest.closed++}}),window:{location:{pathname:'/Sunshower/',hostname:'caffine0000.github.io',protocol:'https:'},sessionStorage:{removeItem:k=>session.delete(k)},matchMedia:()=>({matches:true})},document:{body:node('body'),createElement(tag){if(tag==='div')return node('#created-thought-helper');if(tag!=='canvas')throw Error('unexpected element');return {width:0,height:0,getContext(){return {drawImage(){}}},toDataURL(){imageTest.frames.push([this.width,this.height]);return imageTest.large-->0?'data:image/png;base64,'+'A'.repeat(400001):imageTest.data}}},documentElement:{getAttribute:k=>rootAttributes.get(k)??null,setAttribute:(k,v)=>rootAttributes.set(k,v)},querySelector:selector=>selector==='audio[data-bgm][src]'?audio:node(selector),addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn)},querySelectorAll(selector){return selector==='audio[data-bgm]'?[audio]:selector==='.thought-limit-page,.thought-limit-popup'?[node('.thought-limit-page'),node('.thought-limit-popup')]:[]}},localStorage:{removeItem:k=>storage.delete(k),getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(imageTest.failStorage)throw Error('quota');storage.set(k,v)}},crypto:require('node:crypto').webcrypto,TextEncoder,TextDecoder,btoa,atob,setTimeout(fn,ms){if(ms===3600){giftTimers.push(fn);return 5000+giftTimers.length}fn()},clearTimeout(){},confirm:()=>{confirmState.calls++;return confirmState.answer}};
Object.defineProperty(ctx.document,'cookie',{get:()=>[...cookieJar].map(([k,v])=>k+'='+v).join('; '),set:value=>{cookieWrites.push(value);const name=value.split('=')[0];if(value.includes('Max-Age=0'))cookieJar.delete(name)}});
const code=fs.readFileSync('dist/engine.mjs','utf8').replace(/export /g,'')+'\n'+fs.readFileSync('dist/app.js','utf8').replace(/^import .*?;\n/,'');
vm.runInNewContext(code+`
 function testSiteDataReset(){
 save=normalizePlayer({build:{name:'초기화 전',gender:'female',stats:{},completed:true,thoughtGiftReceived:true,profile:{portrait:imageTest.data}},history:[],perks:['old-perk'],collectibles:['old-item']});persist();preferences={theme:'rain',volume:23,muted:true};savePreferences();storage.set('unrelated.app','keep');storage.set('gallim.save.other-project','keep-other-save');session.set('unrelated.session','keep');session.set(settingsKey,'old');cookieJar.set('sunshower_session','old');const definition=project,editorStorage=storage.get('gallim.project');screen='game';playerTab='building';render();actions.settings();assert.ok($('#modalBody').innerHTML.includes('쿠키 및 플레이 데이터 삭제'));
 const snapshot=save;confirmState.answer=false;const calls=confirmState.calls;actions['reset-site-data']();assert.equal(confirmState.calls,calls+1);assert.equal(save,snapshot);assert.ok(storage.has('gallim.save.'+project.id));assert.equal(cookieWrites.length,0);confirmState.answer=true;actions['reset-site-data']();assert.equal(screen,'start');assert.equal(save.build.name,'');assert.equal(save.build.profile.portrait,'');assert.equal(save.build.thoughtGiftReceived,false);assert.equal(save.build.completed,false);assert.equal(save.history.length,0);assert.equal(save.perks.length,0);assert.equal(save.collectibles.length,0);assert.equal(preferences.volume,60);assert.equal(preferences.muted,false);assert.equal(audio.volume,.6);assert.equal(audio.muted,false);assert.equal(storage.has('gallim.save.'+project.id),false);assert.equal(storage.has(settingsKey),false);assert.equal(session.has(settingsKey),false);assert.equal(storage.get('unrelated.app'),'keep');assert.equal(storage.get('gallim.save.other-project'),'keep-other-save');assert.equal(session.get('unrelated.session'),'keep');assert.equal(storage.get('gallim.project'),editorStorage);assert.equal(project,definition);assert.equal(cookieJar.size,0);assert.ok(cookieWrites.some(value=>value.includes('path=/Sunshower/')));assert.ok(cookieWrites.some(value=>value.includes('domain=caffine0000.github.io')));assert.equal($('#modal').open,false);loadSave();assert.equal(save.build.name,'');assert.equal(readPreferences().volume,60);
 }
 async function testPortraitUpload(){
 save=normalizePlayer({build:{name:'이미지 테스트',gender:'female',completed:false,stats:{},cutscene:{scene:'customization',choices:{'existence-reclaim':'ordinary'}}}});screen='game';playerTab='building';render();actions['custom-section']('profile');assert.ok($('#modalBody').innerHTML.includes('수사관 프로필 이미지 업로드'));
 await uploadCharacterPortrait({type:'image/png',size:1000});assert.equal(save.build.profile.portrait,imageTest.data);assert.ok($('#modalBody').innerHTML.includes('증명사진 교체'));assert.ok($('#modalBody').innerHTML.includes('이미지 삭제'));assert.ok(profileSummary().includes(imageTest.data));assert.equal(imageTest.frames[0][0],1024);assert.equal(imageTest.frames[0][1],512);assert.equal(imageTest.closed,1);
 const uploaded=encodePlayer(project,save);assert.equal(decodePlayer(project,uploaded).build.profile.portrait,imageTest.data);loadSave();assert.equal(save.build.profile.portrait,imageTest.data);
 const previous=save.build.profile.portrait;await uploadCharacterPortrait({type:'image/svg+xml',size:1000});assert.equal(save.build.profile.portrait,previous);await uploadCharacterPortrait({type:'image/png',size:9*1024*1024});assert.equal(save.build.profile.portrait,previous);assert.equal(imageTest.closed,1);
 imageTest.width=6000;imageTest.height=6000;await uploadCharacterPortrait({type:'image/jpeg',size:1000});assert.equal(imageTest.closed,2);assert.equal(save.build.profile.portrait,previous);imageTest.width=1600;imageTest.height=800;
 imageTest.large=2;const frames=imageTest.frames.length;await uploadCharacterPortrait({type:'image/webp',size:1000});assert.equal(imageTest.frames.length,frames+3);assert.ok(imageTest.frames.at(-1)[0]<1024);
 const beforeQuota=save;imageTest.failStorage=true;await uploadCharacterPortrait({type:'image/png',size:1000});assert.equal(save.build.profile.portrait,previous);assert.equal(save,beforeQuota);imageTest.failStorage=false;
 actions['clear-portrait']();assert.equal(save.build.profile.portrait,'');assert.ok(!$('#modalBody').innerHTML.includes('증명사진 교체'));assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.portrait,'');
 const compact=compactCharacterImage;let release;compactCharacterImage=()=>new Promise(resolve=>{release=resolve});const pending=uploadCharacterPortrait({type:'image/png',size:1000});assert.equal(portraitProcessing,true);actions['clear-portrait']();release(imageTest.data);await pending;assert.equal(save.build.profile.portrait,'');assert.equal(portraitProcessing,false);
 const closedPending=uploadCharacterPortrait({type:'image/png',size:1000});close();release(imageTest.data);await closedPending;assert.equal(save.build.profile.portrait,'');assert.equal(portraitProcessing,false);compactCharacterImage=compact;
 }
 function testRaceEditor(){
 const stageWrites=$('#app').htmlWrites;
 actions['custom-section']('race');assert.equal(($('#modalBody').innerHTML.match(/data-action="race-primary"/g)||[]).length,8);actions['race-primary']('human');assert.equal(save.build.race.primary,'human');assert.equal(($('#modalBody').innerHTML.match(/class="race-trait-card"/g)||[]).length,3);assert.ok($('#modalBody').innerHTML.includes('분화: 휴먼'));actions['race-primary']('elf');assert.equal(save.build.race.primary,'elf');actions['race-primary']('bad');assert.equal(save.build.race.primary,'elf');
 const selectElfDivision=id=>actions['race-division'](JSON.stringify(['elf',id]));
 const elfTrait=title=>$('#modalBody').innerHTML.split('</article>').find(card=>card.includes('<h4>'+title+'</h4>'));
 assert.ok($('#modalBody').innerHTML.includes('어떤 엘프들은 돌벽에, 아스팔트에 적응했다.'));
 assert.ok($('#modalBody').innerHTML.includes('어떤 엘프들은 생명 없는 곳에서 살아갔다.'));
 selectElfDivision('modern');
 assert.ok(investigatorCard().includes('엘프(모던)'));
 assert.ok(elfTrait('제육감').includes('race-trait-altered'));
 assert.ok(elfTrait('환경 부적응').includes('race-trait-faded'));
 selectElfDivision('snowfield');
 assert.ok(investigatorCard().includes('엘프(설원)'));
 assert.ok(elfTrait('생명 감지').includes('race-trait-faded'));
 assert.ok(elfTrait('저온 적응').includes('race-trait-altered'));
 assert.ok(!$('#modalBody').innerHTML.includes('제육감'));
 assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.race,'엘프(설원)');
 actions['race-primary']('dwarf');
 assert.ok($('#modalBody').innerHTML.includes('어떤 드워프들은 대지보다 하늘을 멍하니 쳐다봤다.'));
 assert.ok(!$('#modalBody').innerHTML.includes('<h4>천체 공명</h4>'));
 actions['race-division'](JSON.stringify(['dwarf','sky']));
 const skyCards=$('#modalBody').innerHTML.split('</article>');
 for(const title of ['뾰족한 귀','유형성숙','금속 친화','천체 공명']){
  assert.ok(skyCards.some(card=>card.includes('<h4>'+title+'</h4>')));
 }
 const resonance=skyCards.find(card=>card.includes('<h4>천체 공명</h4>'));
 assert.ok(resonance.includes('race-trait-altered'));
 assert.ok(resonance.includes('<small>추가 특성</small>'));
 assert.ok(resonance.includes('길잡이별의 위치'));
 assert.ok(investigatorCard().includes('드워프(천공)'));
 assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.race,'드워프(천공)');
 actions['race-primary']('beastkin');
 const toggleBeastkin=id=>actions['race-division'](JSON.stringify(['beastkin',id]));
 const beastTraits=()=>$('#modalBody').innerHTML;
 assert.ok(beastTraits().includes('어떤 수인들은 조금 이질적이다.'));
 assert.ok(beastTraits().includes('어떤 수인들은 여러 본질을 보유했다.'));
 toggleBeastkin('chimera');
 assert.equal(save.build.profile.race,'수인');
 assert.ok(beastTraits().includes('<h4>혼합된 형질</h4>'));
 assert.ok(!beastTraits().includes('<h4>환수</h4>'));
 toggleBeastkin('mythic-beast');
 assert.ok(investigatorCard().includes('환수인'));
 assert.ok(beastTraits().includes('<h4>혼합된 형질</h4>')&&beastTraits().includes('<h4>환수</h4>'));
 assert.ok(!beastTraits().includes('<h4>동물적 특징</h4>'));
 const cryptid=beastTraits().split('</article>').find(card=>card.includes('<h4>환수</h4>'));
 assert.ok(cryptid.includes('<small>고유 특성 1</small>'));
 assert.ok(!cryptid.includes('<small>추가 특성</small>'));
 for(const id of ['mythic-beast','chimera']){
  assert.ok(beastTraits().split('<button').some(markup=>markup.includes('data-action="race-division"')&&markup.includes(id)&&markup.includes('aria-pressed="true"')));
 }
 const beastBackup=decodePlayer(project,encodePlayer(project,save));
 assert.equal(beastBackup.build.profile.race,'환수인');
 assert.equal(beastBackup.build.race.divisions.beastkin.length,2);
 toggleBeastkin('mythic-beast');
 assert.equal(save.build.profile.race,'수인');
 assert.ok(!beastTraits().includes('<h4>환수</h4>')&&beastTraits().includes('<h4>혼합된 형질</h4>'));
 toggleBeastkin('chimera');
 assert.equal(save.build.race.divisions.beastkin,undefined);
 assert.ok(!beastTraits().includes('<h4>혼합된 형질</h4>'));
 const legacyBeast=normalizePlayer({build:{...save.build,race:{primary:'beastkin',divisions:{beastkin:'mythic-beast'}}}});
 assert.equal(legacyBeast.build.race.divisions.beastkin.join(','),'mythic-beast');
 assert.equal(legacyBeast.build.profile.race,'환수인');
 actions['race-primary']('celestial');
 const celestialTraits=()=>$('#modalBody').innerHTML;
 assert.ok(celestialTraits().includes('어떤 이들은 날개 없이 고요하다.'));
 assert.ok(celestialTraits().includes('어떤 천족들은 신비한 흔적을 남겼다.'));
 assert.ok(celestialTraits().includes('<h4>광륜과 날개</h4>'));
 actions['race-division'](JSON.stringify(['celestial','akasha']));
 assert.ok(investigatorCard().includes('천족(아카샤)'));
 assert.ok(celestialTraits().includes('<h4>광륜과 권익</h4>'));
 assert.ok(!celestialTraits().includes('<h4>광륜과 날개</h4>'));
 actions['race-division'](JSON.stringify(['celestial','nymph']));
 assert.ok(investigatorCard().includes('천족(님프)'));
 assert.ok(celestialTraits().includes('<h4>요정의 날개</h4>'));
 assert.ok(!celestialTraits().includes('<h4>광륜과 권익</h4>'));
 const dust=celestialTraits().split('</article>').find(card=>card.includes('<h4>님프 더스트</h4>'));
 assert.ok(dust.includes('<small>추가 특성</small>'));
 assert.ok(dust.includes('race-trait-altered'));
 assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.race,'천족(님프)');
 actions['race-division'](JSON.stringify(['celestial','nymph']));
 assert.equal(save.build.race.divisions.celestial,undefined);
 assert.equal(save.build.profile.race,'천족');
 assert.ok(celestialTraits().includes('<h4>광륜과 날개</h4>'));
 assert.ok(!celestialTraits().includes('<h4>요정의 날개</h4>'));
 assert.ok(!celestialTraits().includes('<h4>님프 더스트</h4>'));
 assert.ok(celestialTraits().split('<button').some(markup=>markup.includes('data-action="race-division"')&&markup.includes('nymph')&&markup.includes('aria-pressed="false"')));
 assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.race,'천족');
 actions['race-primary']('demon');
 const demonDivisions=[['vampire','뱀파이어',['흡혈 충동','혈감각']],['gargoyle','가고일',['피부 경화']],['nachzehrer','나흐체러',['체향']],['shade','셰이드',['분진화']],['imp','임프',['유형 성숙','트릭스터']],['oni','오니',['광화']],['succubus','서큐버스',['매료']],['dokkaebi','도깨비',['신비술 각인']]];
 const demonExtraCards=()=>$('#modalBody').innerHTML.split('</article>').filter(card=>card.includes('race-trait-altered')&&card.includes('<small>추가 특성</small>'));
 for(const [id,name,traits] of demonDivisions){
  actions['race-division'](JSON.stringify(['demon',id]));
  assert.equal(save.build.race.divisions.demon,id);
  assert.ok(investigatorCard().includes('마족('+name+')'));
  assert.equal(demonExtraCards().length,traits.length);
  const raceHtml=$('#modalBody').innerHTML;
  if(id==='imp'){
   assert.ok(raceHtml.includes('<h4>뿔과 긴 꼬리</h4>'));
   assert.ok(!raceHtml.includes('<h4>뿔과 꼬리</h4>'));
  }else{
   assert.ok(raceHtml.includes('<h4>뿔과 꼬리</h4>'));
   assert.ok(!raceHtml.includes('<h4>뿔과 긴 꼬리</h4>'));
  }
  assert.ok(traits.every(trait=>demonExtraCards().some(card=>card.includes('<h4>'+trait+'</h4>'))));
  assert.equal($('#modalBody').innerHTML.split('<button').filter(card=>card.includes('data-action="race-division"')&&card.includes('aria-pressed="true"')).length,1);
 }
 assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.race,'마족(도깨비)');
 actions['race-division'](JSON.stringify(['demon','dokkaebi']));
 assert.equal(save.build.profile.race,'마족');
 assert.equal(demonExtraCards().length,0);
 actions['race-primary']('spirit');
 const spiritHtml=()=>$('#modalBody').innerHTML;
 assert.ok(spiritHtml().includes('race-division-echo'));
 assert.ok(spiritHtml().includes('어떤 정령들은 사물에 애착을 가지기 시작했다.'));
 assert.ok(!spiritHtml().includes('<h4>귀속</h4>'));
 actions['race-division'](JSON.stringify(['spirit','modern']));
 assert.ok(investigatorCard().includes('정령(모던)'));
 assert.ok(spiritHtml().split('</article>').some(card=>card.includes('race-trait-altered')&&card.includes('<h4>귀속</h4>')&&card.includes('물건또한 신비를 가지게 된다.')));
 assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.race,'정령(모던)');
 actions['race-division'](JSON.stringify(['spirit','modern']));
 assert.equal(save.build.profile.race,'정령');
 assert.ok(!spiritHtml().includes('<h4>귀속</h4>'));
 project.raceDetails={human:{traits:[{name:'검증 특성 1',description:'1'},{name:'검증 특성 2',description:'2'},{name:'검증 특성 3',description:'3'}],divisions:[{id:'test-lineage',name:'검증 분화',description:'분화 검증'}]}};actions['race-primary']('human');assert.ok($('#modalBody').innerHTML.includes('검증 특성 3'));actions['race-division'](JSON.stringify(['human','test-lineage']));assert.equal(save.build.race.divisions.human,'test-lineage');actions['race-division'](JSON.stringify(['human','not-owned']));assert.equal(save.build.race.divisions.human,'test-lineage');
 assert.ok(!raceEditorUI().includes('>ON<'));assert.ok(!raceEditorUI().includes('>OFF<'));assert.ok(!raceEditorUI().includes('immortal-details'));actions['race-option']('immortal');assert.equal(save.build.thoughtLimit,251);
 const raceHtml=$('#modalBody').innerHTML;
 assert.ok(raceHtml.includes('사고 요구량: 251'));
 assert.ok(raceHtml.includes('immortal-details immortal-appearing'));
 assert.ok(raceHtml.includes('immortal-symbol'));
 assert.ok(raceHtml.indexOf('race-modifiers')<raceHtml.indexOf('immortal-details'));
 assert.ok(raceHtml.indexOf('immortal-details')<raceHtml.indexOf('race-reveal'));assert.ok(!$('#app').innerHTML.includes('thought-collapse'));assert.ok(!$('#modalBody').innerHTML.includes('thought-collapse'));
 assert.equal((thoughtHelperLayer.innerHTML.match(/class="thought-collapse"/g)||[]).length,1);
 assert.equal(thoughtHelperLayer.parentNode,$('#modal'));
 assert.equal(thoughtHelperLayer.popoverOpen,true);actions['race-option']('immortal');assert.equal(save.build.thoughtLimit,0);assert.ok(!$('#modalBody').innerHTML.includes('immortal-details'));assert.ok(!thoughtHelperLayer.innerHTML.includes('thought-collapse'));actions['race-option']('immortal');assert.equal(save.build.thoughtLimit,251);actions['race-option']('mixed');assert.ok(!$('#modalBody').innerHTML.includes('두 번째 종족'));assert.equal(($('#modalBody').innerHTML.match(/data-action="race-primary"/g)||[]).length,8);actions['race-primary']('elf');assert.equal(save.build.race.primary,'human');assert.equal(save.build.race.secondary,'elf');assert.ok($('#modalBody').innerHTML.includes('분화: 엘프'));actions['race-primary']('spirit');assert.equal(save.build.race.secondary,'spirit');actions['race-primary']('human');assert.equal(save.build.race.primary,'spirit');assert.equal(save.build.race.secondary,'');actions['race-primary']('human');assert.equal(save.build.race.secondary,'human');actions['race-option']('mixed');assert.equal(save.build.race.primary,'spirit');assert.equal(save.build.race.secondary,'');actions['race-primary']('human');actions['race-division'](JSON.stringify(['human','test-lineage']));actions['race-option']('mixed');actions['race-primary']('elf');assert.equal(save.build.profile.race,'휴먼 · 엘프 / 영생종');assert.ok(!investigatorCard().includes('혼혈'));

 assert.equal($('#app').htmlWrites,stageWrites);
 save.build.thoughtLimitBase=42;save=normalizePlayer(save);persist();render();assert.ok($('#app').innerHTML.includes('thought-limit-page'));assert.ok(buildingPointsUI().replace(/<[^>]*>/g,'').includes('293/250'));assert.ok(buildingPointsUI('popup').replace(/<[^>]*>/g,'').includes('293/250'));for(const location of ['page','popup']){assert.ok(buildingPointsUI(location).includes('aria-label="사고 용량"'));assert.ok(buildingPointsUI(location).includes('>사고 용량:'));}const backed=decodePlayer(project,encodePlayer(project,save));assert.equal(backed.build.thoughtLimit,293);assert.equal(backed.build.race.secondary,'elf');assert.equal(backed.build.race.divisions.human,'test-lineage');close();delete project.raceDetails;
 }
 function testIdentityTraits(){
 const previous=save;
 save=normalizePlayer({...save,build:{...save.build,race:{primary:'human'},traitChoices:{},thoughtLimitBase:0}});
 actions['custom-section']('identity');
 const panel=()=>$('#modalBody').innerHTML;
 const select=level=>actions['identity-trait']('example:'+level);
 const stageWrites=$('#app').htmlWrites;
 assert.ok(panel().includes('data-tone="neutral"'));
 assert.ok(panel().includes('<div class="identity-trait-art"></div>'));
 identityTraits[0].image='assets/example.webp';
 identityTraits[0].imageAlt='특성 그림';
 assert.ok(identityEditorUI().includes('src="assets/example.webp" alt="특성 그림"'));
 delete identityTraits[0].image;
 delete identityTraits[0].imageAlt;
 assert.ok(!panel().includes('choice-thought-cost'));
 assert.ok(panel().includes('<div class="identity-trait-cost-slot"></div>'));
 for(const [level,label,symbol] of [['negative','네거티브','-'],['neutral','뉴트럴','○'],['positive','포지티브','+']]){
  const button=panel().split('</button>').find(markup=>markup.includes('data-id="example:'+level+'"'));
  assert.ok(button.includes('aria-label="'+label+'"'));
  assert.ok(button.endsWith('>'+symbol));
 }
 assert.equal(select('negative'),'negative');
 assert.ok(panel().includes('data-tone="negative"'));
 assert.ok(panel().includes('<div class="identity-trait-cost-slot"><small class="choice-thought-cost">사고 복원량: 20</small></div>'));
 assert.equal(save.build.thoughtLimit,0);
 assert.equal(select('positive'),'positive');
 assert.ok(panel().includes('이 특성을 포지티브로 선택합니다.'));
 assert.ok(panel().includes('<div class="identity-trait-cost-slot"><small class="choice-thought-cost">사고 요구량: 20</small></div>'));
 assert.equal(save.build.thoughtLimit,20);
 for(const meter of ['.thought-limit-page','.thought-limit-popup'])assert.ok($(meter).innerHTML.includes('<strong>20/'));
 const restored=decodePlayer(project,encodePlayer(project,save));
 assert.equal(restored.build.traitChoices.example,'positive');
 assert.equal(restored.build.thoughtLimit,20);
 assert.equal(select('positive'),undefined);
 assert.equal(select('invalid'),undefined);
 save=normalizePlayer({...save,build:{...save.build,thoughtLimitBase:45}});
 assert.equal(save.build.thoughtLimit,65);
 assert.equal(select('negative'),'negative');
 assert.equal(save.build.thoughtLimit,25);
 assert.equal(select('neutral'),'neutral');
 assert.equal(save.build.traitChoices.example,undefined);
 assert.equal(save.build.thoughtLimit,45);
 assert.equal($('#app').htmlWrites,stageWrites);
 save=previous;persist();close();render();
 }
 function testIdentityStats(){
 const previous=save;
 const legacyBuild={...save.build,race:{primary:'human'},traitChoices:{},thoughtLimitBase:0,thoughtLimit:0};
 delete legacyBuild.identityStats;
 save=normalizePlayer({...save,build:legacyBuild});
 actions['custom-section']('identity');
 const stageWrites=$('#app').htmlWrites;
 const panel=()=>$('#modalBody').innerHTML;
 const slide=(id,level)=>{
  const input=$('#identity-stat-'+id);
  input.dataset.identityStat=id;
  input.value=String(level);
  dispatch('input',{target:input});
  return input;
 };
 assert.ok(panel().includes('단계당 사고 요구량: 20'));
 assert.equal(panel().split('data-identity-stat="').length-1,6);
 assert.equal(panel().split('min="1" max="6" step="1" value="1"').length-1,6);
 for(const name of ['근력','지구력','내구력','순발력','재생력','지력'])assert.ok(panel().includes('>'+name+'</label>'));
 assert.equal(Object.values(save.build.identityStats).join(','),'1,1,1,1,1,1');
 assert.equal(save.build.thoughtLimit,0);

 const popupWrites=$('#modalBody').htmlWrites;
 const strength=slide('strength',2);
 assert.equal(save.build.thoughtLimit,20);
 assert.equal(strength.style['--identity-stat-fill'],'20%');
 assert.equal(slide('strength',6),strength);
 assert.equal(save.build.thoughtLimit,100);
 slide('stamina',3);
 assert.equal(save.build.thoughtLimit,140);
 assert.equal($('#modalBody').htmlWrites,popupWrites);
 assert.equal(actions['identity-trait']('example:negative'),'negative');
 assert.equal(save.build.thoughtLimit,120);
 const nextPopupWrites=$('#modalBody').htmlWrites;
 slide('strength',3);
 assert.equal(save.build.thoughtLimit,60);
 assert.equal($('#identity-stat-level-strength').textContent,'3단계');
 assert.ok(buildSummary().includes('<span>근력</span><b>3단계</b>'));
 assert.ok($('.thought-limit-popup').innerHTML.includes('<strong>60/'));
 for(const [id,level] of [['strength',7],['strength',0],['unknown',2],['strength',3]])slide(id,level);
 assert.equal(save.build.thoughtLimit,60);
 imageTest.failStorage=true;
 assert.equal(slide('stamina',4).value,'3');
 imageTest.failStorage=false;
 assert.equal(save.build.identityStats.stamina,3);
 assert.equal($('#modalBody').htmlWrites,nextPopupWrites);
 assert.equal($('#app').htmlWrites,stageWrites);

 const restored=decodePlayer(project,encodePlayer(project,save)).build;
 assert.equal(restored.identityStats.strength,3);
 assert.equal(restored.identityStats.stamina,3);
 assert.equal(restored.thoughtLimit,60);
 assert.throws(()=>normalizePlayer({...save,build:{...save.build,identityStats:{strength:7}}}));
 assert.equal(normalizePlayer({...save,build:{...save.build,traitChoices:{},identityStats:Object.fromEntries(identityStatDefinitions.map(({id})=>[id,6]))}}).build.thoughtLimit,600);
 save=previous;persist();close();render();
 }
 function testAutomatonReplica(){
 const original=save,definitions=project.raceDetails;
 save=normalizePlayer({...save,build:{...save.build,race:{primary:'automaton'}}});
 actions['custom-section']('race');
 actions['race-option']('mixed');
 const replicaPanel=()=>$('#modalBody').innerHTML;
 assert.ok(!replicaPanel().includes('<h4>레플리카</h4>'));
 actions['race-primary']('elf');
 assert.ok(investigatorCard().includes('<dt>종족</dt><dd>오토마타-엘프</dd>'));
 assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.race,'오토마타-엘프');
 actions['race-division'](JSON.stringify(['elf','modern']));
 assert.ok(investigatorCard().includes('<dt>종족</dt><dd>오토마타-엘프(모던)</dd>'));
 const replicaCard=replicaPanel().split('</article>').find(card=>card.includes('race-replica-trait'));
 assert.ok(replicaCard.includes('<small>추가 특성</small>'));
 assert.ok(replicaCard.includes('<h4>레플리카</h4>'));
 assert.ok(replicaCard.includes('오토마타에겐 혼혈이 존재하지 않는다.'));
 assert.ok(replicaCard.includes('신체를 가지게 될 뿐이다.'));
 actions['race-primary']('elf');
 assert.ok(investigatorCard().includes('<dt>종족</dt><dd>오토마타</dd>'));
 assert.ok(!replicaPanel().includes('<h4>레플리카</h4>'));
 project.raceDetails={automaton:{traits:[{name:'기계 특성 1'},{name:'기계 특성 2'},{name:'기계 특성 3'},{name:'숨겨진 기계 특성',description:'4번 특성 설명'}]},human:{traits:[{name:'공개되면 안 되는 휴먼 특성'}],divisions:[{id:'test-human',name:'휴먼 분화'}]},elf:{traits:[{name:'공개되면 안 되는 엘프 특성'}]}};
 save=normalizePlayer({...save,build:{...save.build,race:{primary:'human',mixed:true,secondary:'elf'}}});actions['custom-section']('race');assert.ok($('#modalBody').innerHTML.includes('공개되면 안 되는 휴먼 특성'));actions['race-primary']('automaton');assert.equal(save.build.race.primary,'automaton');assert.equal(save.build.race.secondary,'human');assert.ok($('#modalBody').innerHTML.includes('<strong>레플리카</strong>'));assert.ok(!$('#modalBody').innerHTML.includes('<strong>혼혈</strong>'));assert.ok($('#modalBody').innerHTML.includes('숨겨진 기계 특성'));assert.ok($('#modalBody').innerHTML.includes('4번 특성 설명'));assert.ok(!$('#modalBody').innerHTML.includes('공개되면 안 되는 휴먼 특성'));assert.ok($('#modalBody').innerHTML.includes('분화: 휴먼'));assert.equal(($('#modalBody').innerHTML.match(/class="race-trait-card"/g)||[]).length,3);assert.equal(($('#modalBody').innerHTML.match(/race-replica-trait/g)||[]).length,1);
 actions['race-primary']('elf');assert.equal(save.build.race.primary,'automaton');assert.equal(save.build.race.secondary,'elf');assert.ok(!$('#modalBody').innerHTML.includes('공개되면 안 되는 엘프 특성'));actions['race-option']('mixed');assert.equal(save.build.race.secondary,'');assert.ok(!$('#modalBody').innerHTML.includes('숨겨진 기계 특성'));assert.ok($('#modalBody').innerHTML.includes('<strong>레플리카</strong>'));actions['race-option']('mixed');assert.ok(!$('#modalBody').innerHTML.includes('숨겨진 기계 특성'));actions['race-primary']('human');assert.ok($('#modalBody').innerHTML.includes('숨겨진 기계 특성'));actions['race-primary']('automaton');assert.equal(save.build.race.primary,'human');assert.ok($('#modalBody').innerHTML.includes('<strong>혼혈</strong>'));assert.ok(!$('#modalBody').innerHTML.includes('숨겨진 기계 특성'));
 save=original;project.raceDetails=definitions;close();render();
 }
 function testThoughtAssistance(){
 const original=save;for(const gender of ['male','female']){save=normalizePlayer({...original,build:{...original.build,gender,race:{primary:'human'},thoughtLimitBase:251,thoughtLimit:251,thoughtGiftReceived:false}});render();actions['custom-section']('race');assert.ok(thoughtHelperLayer.innerHTML.includes('thought-helper-peek'));assert.ok(!buildingPointsUI().includes('thought-helper-peek'));assert.ok(!$('#modalBody').innerHTML.includes('thought-helper-peek'));assert.equal(thoughtHelperLayer.parentNode,$('#modal'));assert.equal(thoughtHelperLayer.popoverOpen,true);const failed=save;imageTest.failStorage=true;actions['thought-assist']();assert.equal(save,failed);assert.equal(save.build.thoughtGiftReceived,false);imageTest.failStorage=false;const opens=$('#modal').openCount,stageWrites=$('#app').htmlWrites;actions['thought-assist']();assert.equal($('#app').htmlWrites,stageWrites);assert.equal(save.build.thoughtLimit,251);assert.equal(thoughtLimitMaximum(save.build),300);assert.equal(save.build.thoughtGiftReceived,true);assert.equal($('#modal').openCount,opens);assert.ok($('#modal').classList.contains('customization-dialog'));assert.ok(!$('#modal').classList.contains('thought-gift-dialog'));assert.ok($('#modalBody').innerHTML.includes('race-primary'));assert.ok(thoughtHelperLayer.innerHTML.includes(gender==='male'?'정말이지... 오빠는 욕심쟁이구나?':'정말이지... 언니는 욕심쟁이구나?'));assert.ok(thoughtHelperLayer.innerHTML.includes('thought-helper-bubble'));assert.ok(thoughtHelperLayer.innerHTML.includes('thought-helper-leaving'));assert.ok(thoughtHelperLayer.innerHTML.includes('thought-spark-burst'));assert.ok(!thoughtHelperLayer.innerHTML.includes('thought-assist-standing-'));assert.ok($('.thought-limit-page').innerHTML.includes('thought-maximum-prism'));assert.ok($('.thought-limit-popup').innerHTML.includes('thought-maximum-prism'));assert.ok(!$('#app').innerHTML.includes('thought-collapse'));assert.ok(!buildingPointsUI().includes('thought-helper-peek'));const granted=save;actions['thought-assist']();assert.equal(save,granted);const activeGift=thoughtGiftPresentation;close();assert.equal($('#modal').open,false);assert.equal(thoughtGiftPresentation,activeGift);assert.equal(thoughtHelperLayer.parentNode,document.body);assert.ok(thoughtHelperLayer.innerHTML.includes('thought-helper-bubble'));giftTimers.at(-1)();assert.equal(thoughtGiftPresentation,null);loadSave();assert.equal(thoughtLimitMaximum(save.build),300);assert.equal(save.build.thoughtGiftReceived,true)}
 save=normalizePlayer({...original,build:{...original.build,race:{primary:'human'},thoughtLimitBase:251,thoughtLimit:251,thoughtGiftReceived:false}});render();const opens=$('#modal').openCount,stageWrites=$('#app').htmlWrites;actions['thought-assist']();assert.equal($('#app').htmlWrites,stageWrites);assert.equal($('#modal').open,false);assert.equal($('#modal').openCount,opens);assert.ok(thoughtHelperLayer.innerHTML.includes('thought-helper-bubble'));assert.equal(thoughtHelperLayer.parentNode,document.body);const scene=thoughtGiftPresentation;giftTimers[0]();assert.equal(thoughtGiftPresentation,scene);giftTimers.at(-1)();assert.equal(thoughtGiftPresentation,null);assert.ok(!buildingPointsUI().includes('thought-gift-inline'));assert.equal(save.build.thoughtGiftReceived,true);
 for(const amount of [300,301]){save=normalizePlayer({...save,build:{...save.build,thoughtLimitBase:amount,thoughtLimit:amount}});syncThoughtHelperLayer();assert.equal(thoughtHelperLayer.innerHTML.includes('thought-collapse'),amount>300);assert.ok(!buildingPointsUI().includes('thought-helper-peek'))}save=original;persist();render();
 }
 function testThoughtHelperLayer(){
 const original=save;save=normalizePlayer({...original,build:{...original.build,race:{primary:'human'},thoughtLimitBase:251,thoughtLimit:251,thoughtGiftReceived:false}});screen='game';playerTab='building';close();render();const layer=thoughtHelperLayer;assert.ok(layer);assert.equal(layer.parentNode,document.body);assert.equal(layer.popoverOpen,true);assert.equal((layer.innerHTML.match(/class="thought-collapse"/g)||[]).length,1);assert.equal((layer.innerHTML.match(/class="thought-helper-peek"/g)||[]).length,1);const shows=layer.popoverShows;render();assert.equal(layer.popoverShows,shows);actions['custom-section']('race');assert.equal(thoughtHelperLayer,layer);assert.equal(layer.parentNode,$('#modal'));assert.equal(layer.popoverOpen,true);assert.ok(!$('#app').innerHTML.includes('thought-helper-peek'));assert.ok(!$('#modalBody').innerHTML.includes('thought-helper-peek'));actions['custom-section']('profile');assert.equal(thoughtHelperLayer,layer);assert.equal(layer.parentNode,$('#modal'));actions.settings();assert.equal(thoughtHelperLayer,layer);assert.equal(layer.popoverOpen,true);close();assert.equal(layer.parentNode,document.body);assert.equal(layer.popoverOpen,true);
 const show=layer.showPopover,hide=layer.hidePopover;layer.showPopover=undefined;layer.hidePopover=undefined;actions['custom-section']('race');assert.equal(layer.parentNode,$('#modal'));assert.ok($('#modal').classList.contains('helper-layer-fallback'));save.build.thoughtLimitBase=250;save=normalizePlayer(save);render();assert.equal(layer.hidden,true);assert.ok(!$('#modal').classList.contains('helper-layer-fallback'));layer.showPopover=show;layer.hidePopover=hide;close();save=original;persist();render();
 }
 function testCollapseThreshold(){const original=save;for(const amount of [249,250,251]){save=normalizePlayer({...original,build:{...original.build,completed:false,race:{primary:'human'},thoughtLimitBase:amount,thoughtLimit:amount}});syncThoughtHelperLayer();assert.equal(!!thoughtHelperLayer?.innerHTML.includes('thought-collapse'),amount>250);assert.equal(buildingPointsUI().includes('thought-label-corrupted'),amount>250);assert.equal(buildingPointsUI().includes('thought-label-ghost'),amount>250);assert.ok(!buildingPointsUI('popup').includes('thought-collapse'))}save.build.completed=true;syncThoughtHelperLayer();assert.ok(!thoughtHelperLayer.innerHTML.includes('thought-collapse'));save=original}
 function testProfileEditor(){
 actions['custom-section']('profile');assert.ok(!$('#modalBody').innerHTML.includes('앞서 선택한 성별'));assert.ok($('#modalBody').innerHTML.includes('investigator-card'));assert.ok(!$('#modalBody').innerHTML.includes('data-profile-field="race"'));assert.ok(!$('#modalBody').innerHTML.includes('hairColor'));assert.ok(!$('#modalBody').innerHTML.includes('eyeColor'));assert.ok(!$('#modalBody').innerHTML.includes('data-profile-field="gender"'));
 for(const [key,value] of [['intro','<script>나를 소개합니다</script>'],['height','181'],['weight','72.5'],['themeColor','#cc8844']])dispatch('input',{target:{value,dataset:{profileField:key}}});assert.equal(save.build.profile.weight,72.5);assert.equal(save.build.profile.height,181);assert.equal($('#profileColorHex').textContent,'#CC8844');assert.ok($('#profileCardPreview').innerHTML.includes('&lt;script&gt;'));assert.ok(!$('#profileCardPreview').innerHTML.includes('<script>'));
 dispatch('input',{target:{value:'male',dataset:{profileField:'gender'}}});assert.equal(save.build.gender,'female');actions['card-themes']();assert.equal(cardThemePickerOpen,true);actions['card-theme']('archive');assert.equal(save.build.profile.cardTheme,'archive');assert.ok($('#modalBody').innerHTML.includes('investigator-card card-archive'));actions['card-theme']('invalid');assert.equal(save.build.profile.cardTheme,'archive');
 const backup=encodePlayer(project,save);assert.equal(decodePlayer(project,backup).build.profile.intro,'<script>나를 소개합니다</script>');loadSave();assert.equal(save.build.profile.intro,'<script>나를 소개합니다</script>');assert.equal(save.build.profile.themeColor,'#cc8844');close();
 }
 project.stats=[{id:'stat-will',name:'의지',min:0,max:10,initial:2}];
 save=normalizePlayer({build:{name:'캐릭터',stats:{'stat-will':7},completed:false}});
 render();assert.ok($('#app').innerHTML.includes('start-screen'));assert.ok($('#app').innerHTML.includes('여우비와'));assert.ok(!$('#app').innerHTML.includes('CYOA STUDIO'));actions.enter();assert.equal(screen,'game');assert.equal(playerTab,'building');assert.ok($('#app').innerHTML.includes('build-next'));assert.ok($('#app').innerHTML.includes('build-cutscene'));assert.ok(!$('#app').innerHTML.includes('class="player-tabs"'));actions.menu();assert.ok($('#modalBody').innerHTML.includes('익스트렉션/인스크립트'));assert.ok($('#modalBody').innerHTML.includes('Suitcase of Investigator'));assert.ok(!$('#modalBody').innerHTML.includes('nav-group'));assert.equal(($('#modalBody').innerHTML.match(/class="nav-icon-slot"/g)||[]).length,5);
 assert.ok($('#app').innerHTML.includes('data-action="settings"'));actions.menu();assert.equal(($('#modalBody').innerHTML.match(/disabled aria-disabled="true"/g)||[]).length,3);
 for(const tab of ['story','bonds','info']){actions['player-tab'](tab);assert.equal(playerTab,'building')}
 actions['player-tab']('transfer');assert.equal(playerTab,'transfer');render();assert.equal(playerTab,'transfer');assert.ok($('#app').innerHTML.includes('id="perkInput"'));actions['player-tab']('building');
 actions['open-transfer']();assert.equal(playerTab,'building');assert.ok($('#modalBody').innerHTML.includes('id="playerInput"'));close();
 actions.settings();assert.ok($('#modalBody').innerHTML.includes('크레딧'));assert.ok($('#modalBody').innerHTML.includes('아크릴새우(AcrylicShrimp)'));assert.ok($('#modalBody').innerHTML.includes('배경음악 중단'));assert.equal(audio.volume,.6);
 assert.equal(themeChoices.length,2);assert.ok($('#modalBody').innerHTML.includes('아크릴 하늘'));assert.ok($('#modalBody').innerHTML.includes('이걸 가지고 있단 건 네가 쵸작자.'));actions['set-theme']('acrylic-sky');assert.equal(preferences.theme,'rain');save.perks.push('acrylic-sky');actions['set-theme']('acrylic-sky');assert.equal(preferences.theme,'acrylic-sky');assert.ok($('#app').innerHTML.includes('acrylic-sky-world'));save.perks=save.perks.filter(id=>id!=='acrylic-sky');render();assert.equal(preferences.theme,'rain');assert.ok($('#modalBody').innerHTML.includes('수사관 사무실의 유리창'));assert.ok(!$('#modalBody').innerHTML.includes('한밤의 창'));assert.ok(!$('#modalBody').innerHTML.includes('자수정의 잔광'));assert.equal(normalizePreferences({theme:'amethyst'}).theme,'rain');assert.equal(normalizePreferences({theme:'midnight'}).theme,'rain');actions['set-theme']('amethyst');assert.equal(preferences.theme,'rain');
 // Verify both release channels and persisted fallback after a perk is removed.
 const archive=cardThemes.find(theme=>theme.id==='archive');
 archive.unlock=player=>player.perks.includes('test-card-perk');
 rootAttributes.set('data-release-channel','test');
 assert.ok(themeChoices.every(themeUnlocked));assert.ok(cardThemes.every(themeUnlocked));
 actions['set-theme']('acrylic-sky');assert.equal(preferences.theme,'acrylic-sky');
 save.build.profile.cardTheme='archive';render();assert.equal(save.build.profile.cardTheme,'archive');
 rootAttributes.set('data-release-channel','live');
 render();assert.equal(preferences.theme,'rain');assert.equal(readPreferences().theme,'rain');
 assert.equal(save.build.profile.cardTheme,'glass');
 assert.equal(JSON.parse(storage.get(playerSaveKey())).build.profile.cardTheme,'glass');
 save.perks.push('acrylic-sky','test-card-perk');render();assert.equal(preferences.theme,'rain');assert.equal(save.build.profile.cardTheme,'glass');
 save.perks=save.perks.filter(id=>!['acrylic-sky','test-card-perk'].includes(id));delete archive.unlock;
 const testTheme={id:'test-theme',name:'test',note:'test',unlock:player=>player.perks.includes('test-theme-code'),presentation:{symbolTone:'black',background:()=>'<div>test background</div>',touch:()=>{window.themeTouchTest=true},transition:commit=>{window.themeTransitionTest=true;commit();return Promise.resolve()}}};themeChoices.push(testTheme);actions['set-theme']('test-theme');assert.equal(preferences.theme,'rain');save.perks.push('test-theme-code');actions['set-theme']('test-theme');assert.equal(rootAttributes.get('data-theme'),'test-theme');assert.equal(rootAttributes.get('data-symbol-tone'),'black');assert.ok($('#app').innerHTML.includes('test background'));themeTouchImpact({});assert.equal(window.themeTouchTest,true);let themeCommitted=false;themeTransition(()=>{themeCommitted=true});assert.equal(themeCommitted,true);assert.equal(window.themeTransitionTest,true);assert.equal(readPreferences().theme,'test-theme');save.perks=[];render();assert.equal(preferences.theme,'rain');assert.equal(rootAttributes.get('data-theme'),'rain');
 assert.ok(startUI().includes('<h1 class="start-title"><img src="assets/sunshower-umbrella-vine.webp" alt="여우비와 커튼월"'));
 assert.equal(rootAttributes.get('data-symbol-tone'),'white');assert.ok($('#app').innerHTML.includes('rain-layer'));themeChoices.pop();actions['set-theme']('invalid');assert.equal(preferences.theme,'rain');
 dispatch('input',{target:{id:'bgmVolume',value:'27'}});assert.equal(audio.volume,.27);assert.equal(readPreferences().volume,27);actions['toggle-bgm']();assert.equal(audio.muted,true);assert.equal(readPreferences().muted,true);setBgmVolume('999');assert.equal(audio.volume,1);setBgmVolume('NaN');assert.equal(preferences.volume,100);
 actions['toggle-bgm-playback']();assert.equal(audio.paused,true);assert.equal(readPreferences().bgmPaused,true);assert.equal($('#bgmPlayback').dataset.playing,'false');
 syncBgmPlayback();assert.equal(audio.paused,true);
 actions['toggle-bgm-playback']();assert.equal(audio.paused,false);assert.equal(readPreferences().bgmPaused,false);assert.equal($('#bgmPlayback').dataset.playing,'true');
 const fallbackLoads=audio.loadCount;
 audio.duration=164;audio.currentTime=25;
 save.perks.push('acrylic-sky');actions['set-theme']('acrylic-sky');
 assert.equal(themeBgm().title,'Sunshower');
 assert.equal(audio.loadCount,fallbackLoads);assert.equal(audio.currentTime,25);
 assert.ok($('#modalBody').innerHTML.includes('>Sunshower</strong>'));
 assert.ok(bgmSettingsUI().includes('data-bgm-theme="rain"'));
 assert.ok(bgmSettingsUI().includes('>수사관 사무실의 유리창</span>'));
 assert.ok(!bgmSettingsUI().includes('<img'));
 dispatch('input',{target:{id:'bgmSeek',value:'62.5'}});
 assert.equal(audio.currentTime,62.5);assert.equal($('#bgmElapsed').textContent,'1:02');assert.equal($('#bgmDuration').textContent,'2:44');assert.ok(parseFloat($('#bgmSeek').style['--bgm-fill'])>38);
 const acrylic=themeChoices.find(theme=>theme.id==='acrylic-sky');
 acrylic.presentation.bgm={title:'Test track',src:'assets/test-track.m4a'};
 actions['toggle-bgm-playback']();
 actions['set-theme']('acrylic-sky');
 assert.equal(audio.src,'assets/test-track.m4a');assert.equal(audio.loadCount,fallbackLoads+1);
 assert.equal(audio.currentTime,0);assert.equal(audio.paused,true);
 assert.ok($('#modalBody').innerHTML.includes('>Test track</strong>'));
 assert.ok(bgmSettingsUI().includes('data-bgm-theme="acrylic-sky"'));
 assert.ok(bgmSettingsUI().includes('>아크릴 하늘</span>'));
 delete acrylic.presentation.bgm;
 actions['set-theme']('rain');
 assert.equal(audio.src,defaultBgm.src);assert.equal(audio.loadCount,fallbackLoads+2);
 assert.equal(audio.paused,true);
 actions['toggle-bgm-playback']();assert.equal(audio.paused,false);
 save.perks=save.perks.filter(id=>id!=='acrylic-sky');
 assert.equal(normalizePreferences({theme:'x',volume:-5}).volume,0);assert.equal(normalizePreferences({volume:'20'}).volume,60);assert.equal(normalizePreferences({muted:'true'}).muted,false);actions['set-theme']('rain');close();
 actions['build-next']();assert.ok($('#app').innerHTML.includes('의문의 여자아이'));assert.ok($('#app').innerHTML.includes('꼬마에게 이름을 묻는다'));assert.ok(!$('#app').innerHTML.includes('id="buildName"'));actions['build-next']();assert.ok($('#app').innerHTML.includes('id="buildName"'));assert.ok($('#app').innerHTML.includes('내 이름은 알려줄 수 없어.'));assert.ok($('#app').innerHTML.includes('data-action="speak-name"'));assert.ok($('#app').innerHTML.includes('이름을 말한다'));assert.ok(!$('#app').innerHTML.includes('data-action="build-next"'));
 $('#buildName').value='   ';actions['speak-name']();assert.equal(save.build.cutscene.scene,'profile-name');
 $('#buildName').value='캐릭터';dispatch('compositionstart',{target:{id:'buildName'}});actions['speak-name']();dispatch('submit',{target:{id:'buildNameForm'},preventDefault(){}});dispatch('keydown',{key:'Enter',keyCode:229,isComposing:true,target:{id:'buildName'},preventDefault(){}});assert.equal(save.build.cutscene.scene,'profile-name');dispatch('compositionend',{target:{id:'buildName'}});
 dispatch('keydown',{key:'Enter',keyCode:13,isComposing:false,target:{id:'buildName'},preventDefault(){}});assert.equal(save.build.cutscene.scene,'profile-name');dispatch('submit',{target:{id:'buildNameForm'},preventDefault(){}});assert.equal(save.build.cutscene.scene,'profile-name');actions['speak-name']();assert.equal(save.build.cutscene.scene,'profile-gender');assert.ok($('#app').innerHTML.includes('나는 캐릭터'));assert.ok($('#app').innerHTML.includes('좋네. 이제부턴 캐릭터...'));assert.ok(!$('#app').innerHTML.includes('[플레이어 이름]'));assert.equal(($('#app').innerHTML.match(/data-action="choose-gender"/g)||[]).length,2);assert.ok($('#app').innerHTML.includes('소년은 나뭇가지에서 날아오르는 새를 보았다.'));assert.ok($('#app').innerHTML.includes('소녀는 나뭇가지에 달린 열매를 보았다.'));assert.equal(($('#app').innerHTML.match(/class="gender-choice-art"/g)||[]).length,2);assert.ok($('#app').innerHTML.includes('assets/choice-male-'));assert.ok($('#app').innerHTML.includes('assets/choice-female-'));assert.ok(!$('#app').innerHTML.includes('data-action="build-next"'));actions['speak-name']();assert.equal(save.build.cutscene.scene,'profile-gender');
 save.build.name='<b>$&</b>';render();assert.ok($('#app').innerHTML.includes('나는 &lt;b&gt;$&amp;&lt;/b&gt;'));assert.ok(!$('#app').innerHTML.includes('나는 <b>'));save.build.name='캐릭터';render();actions['choose-gender']('other');assert.equal(save.build.cutscene.scene,'profile-gender');actions['choose-gender']('male');assert.equal(save.build.gender,'male');assert.equal(save.build.cutscene.scene,'existence-reclaim');assert.ok($('#app').innerHTML.includes('캐릭터 오빠라고'));actions['choose-gender']('female');assert.equal(save.build.gender,'male');
 actions['build-back']();assert.equal(save.build.cutscene.scene,'profile-gender');actions['choose-gender']('female');assert.equal(save.build.gender,'female');assert.ok($('#app').innerHTML.includes('캐릭터 언니라고'));actions['build-back']();actions['build-back']();assert.equal(save.build.cutscene.scene,'profile-name');$('#buildName').value='캐릭터';dispatch('submit',{target:{id:'buildNameForm'},preventDefault(){}});assert.equal(save.build.cutscene.scene,'profile-name');actions['speak-name']();assert.equal(save.build.cutscene.scene,'profile-gender');actions['choose-gender']('female');assert.equal(save.build.cutscene.scene,'existence-reclaim');
 assert.ok($('#app').innerHTML.includes('존재 탈환'));assert.equal(($('#app').innerHTML.match(/data-action="choose-building-scene"/g)||[]).length,2);assert.ok(!$('#app').innerHTML.includes('data-action="build-next"'));assert.equal($('#app').innerHTML.split('<strong class="narrative-emphasis">미래</strong>').length-1,1);
 save.build.name="일단은 '미래' <b>$&</b>";render();assert.ok(!$('#app').innerHTML.includes('<b>'));assert.equal($('#app').innerHTML.split('<strong class="narrative-emphasis">미래</strong>').length-1,1);save.build.name='캐릭터';render();
 actions['choose-building-scene']('ordinary');assert.equal(save.build.cutscene.scene,'scene-6-1');assert.ok($('#app').innerHTML.includes('구체화 개시'));assert.ok($('#app').innerHTML.includes('이제 캐릭터 언니를 더 알아보자!'));assert.ok($('#app').innerHTML.includes('나는...'));assert.ok($('#app').innerHTML.includes('assets/cutscene-name-8b0527f716.jpg'));actions['build-next']();assert.equal(save.build.cutscene.scene,'customization');assert.equal(($('#app').innerHTML.match(/data-action="custom-section"/g)||[]).length,5);for(const name of ['프로필','종족','특성','권한','특수'])assert.ok($('#app').innerHTML.includes(name));testProfileEditor();testRaceEditor();testIdentityTraits();testIdentityStats();testAutomatonReplica();testCollapseThreshold();testThoughtHelperLayer();testThoughtAssistance();actions['custom-section']('profile');actions['custom-section']('identity');assert.ok($('#modal').open);assert.ok($('#modal').classList.contains('customization-dialog'));assert.ok($('#modalBody').innerHTML.includes('<h2>특성</h2>'));assert.ok($('#modalBody').innerHTML.includes('identity-trait-switch'));assert.ok(!$('#app').innerHTML.includes('customization-detail'));for(const category of customCategories){actions['custom-section'](category.id);assert.ok($('#modalBody').innerHTML.includes('<h2>'+category.name+'</h2>'));close();assert.equal($('#modal').open,false)}actions['custom-section']('identity');assert.equal(save.build.cutscene.scene,'customization');actions['custom-section']('invalid');assert.equal(customSection,'identity');close();assert.equal($('#modal').open,false);actions['build-next']();assert.equal(save.build.cutscene.scene,'stat:stat-will');actions['build-back']();assert.equal(save.build.cutscene.scene,'customization');actions['build-back']();assert.equal(save.build.cutscene.scene,'scene-6-1');actions['choose-building-scene']('question-name');assert.equal(save.build.cutscene.scene,'scene-6-1');actions['build-back']();assert.equal(save.build.cutscene.scene,'existence-reclaim');actions['choose-building-scene']('question-name');assert.equal(save.build.cutscene.scene,'scene-6-2');assert.ok($('#app').innerHTML.includes('이쁜 이름이거든!'));assert.ok($('#app').innerHTML.includes('나쁜 언니는 모자 압수에 꿀밤형이야!'));assert.ok($('#app').innerHTML.includes('scene-white-impact'));render();assert.ok(!$('#app').innerHTML.includes('scene-white-impact'));assert.ok($('#app').innerHTML.includes('나는...'));actions['build-next']();assert.equal(save.build.cutscene.scene,'customization');assert.equal(($('#app').innerHTML.match(/data-action="custom-section"/g)||[]).length,5);for(const name of ['프로필','종족','특성','권한','특수'])assert.ok($('#app').innerHTML.includes(name));actions['custom-section']('profile');actions['custom-section']('identity');assert.ok($('#modal').open);assert.ok($('#modal').classList.contains('customization-dialog'));assert.ok($('#modalBody').innerHTML.includes('<h2>특성</h2>'));assert.ok($('#modalBody').innerHTML.includes('identity-trait-switch'));assert.ok(!$('#app').innerHTML.includes('customization-detail'));for(const category of customCategories){actions['custom-section'](category.id);assert.ok($('#modalBody').innerHTML.includes('<h2>'+category.name+'</h2>'));close();assert.equal($('#modal').open,false)}actions['custom-section']('identity');assert.equal(save.build.cutscene.scene,'customization');actions['custom-section']('invalid');assert.equal(customSection,'identity');close();assert.equal($('#modal').open,false);actions['build-next']();assert.equal(save.build.cutscene.scene,'stat:stat-will');$('#cutsceneStat').value='7';actions['build-next']();assert.ok($('#app').innerHTML.includes('build-complete'));actions['build-complete']();assert.equal(save.build.completed,true);assert.ok(!$('#app').innerHTML.includes('data-action="build-complete"'));assert.ok(!$('#app').innerHTML.includes('thought-limit-page'));assert.ok(!$('#app').innerHTML.includes('thought-collapse'));assert.ok($('#app').innerHTML.includes('thought-limit-archived">사고 용량: '+save.build.thoughtLimit+'/'));
 assert.ok(profileSummary().includes('전시할 수집품 고르기'));actions['profile-collection']();assert.ok($('#modalBody').innerHTML.includes('아직 획득한 수집품이 없습니다.'));project.collectibles=[{id:'test-award',name:'수사 기념품',description:'검증용 수집품'}];actions['display-collectible']('test-award');assert.equal(save.build.profile.collectible,'');save.collectibles.push('test-award');actions['profile-collection']();assert.ok($('#modalBody').innerHTML.includes('수사 기념품'));actions['display-collectible']('test-award');assert.equal(save.build.profile.collectible,'test-award');assert.ok(investigatorCard().includes('수사 기념품'));assert.equal(decodePlayer(project,encodePlayer(project,save)).build.profile.collectible,'test-award');actions['display-collectible']('');assert.equal(save.build.profile.collectible,'');save.collectibles=[];project.collectibles=[];close();
 actions.menu();assert.ok(!$('#modalBody').innerHTML.includes('disabled aria-disabled="true"'));close();for(const tab of ['story','bonds','info','transfer']){actions['player-tab'](tab);assert.equal(playerTab,tab);assert.ok($('#app').innerHTML.includes('player-panel'));assert.ok(!$('#app').innerHTML.includes('thought-limit-archived'));assert.ok(!$('#app').innerHTML.includes('thought-limit-page'))}
 const backup=encodePlayer(project,save);save=normalizePlayer();$('#playerInput').value=backup;actions['player-restore']();assert.equal(save.build.name,'캐릭터');assert.equal(save.build.stats['stat-will'],7);assert.equal(save.build.completed,true);assert.equal(save.build.gender,'female');assert.equal(save.build.profile.race,'휴먼 · 엘프 / 영생종');assert.equal(save.build.profile.weight,72.5);assert.equal(save.build.profile.cardTheme,'archive');
 loadSave();assert.equal(save.build.name,'캐릭터');assert.equal(save.build.gender,'female');assert.equal(save.build.cutscene.choices['existence-reclaim'],'question-name');
 actions['title-screen']();assert.equal(screen,'start');actions.enter();assert.equal(playerTab,'story');assert.equal(save.build.name,'캐릭터');assert.ok($('#app').innerHTML.includes('rain-layer'));assert.equal(project.title,'여우비와 커튼월');
 const unfinishedBackup=encodePlayer(project,normalizePlayer({build:{name:'미완성',gender:'male',completed:false,stats:{},cutscene:{scene:'existence-reclaim'}}}));actions['open-transfer']();$('#playerInput').value=unfinishedBackup;actions['player-restore']();assert.equal(playerTab,'building');assert.equal(save.build.completed,false);assert.equal(save.build.cutscene.scene,'existence-reclaim');assert.equal(readPreferences().theme,'rain');actions['player-tab']('transfer');assert.equal(playerTab,'transfer');
 actions['player-tab']('building');actions['build-reopen']();assert.equal(save.build.completed,false);actions['player-tab']('story');assert.equal(playerTab,'building');
 (async()=>{await testPortraitUpload();save=normalizePlayer();const first=replay(project,save).scene.choices[0];const pending=choose(first.id);assert.equal(busy,true);await choose(first.id);await pending;assert.equal(save.history.length,1);assert.equal(busy,false);testSiteDataReset();console.log('PASS: profile locks/unlocks/reopen/import, persistent themes, BGM volume/mute, cutscene routes and save restoration');})().catch(e=>{console.error(e);process.exitCode=1});
`,ctx);

