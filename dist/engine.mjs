export const fresh=()=>({v:1,history:[]});
export function validate(p){
 if(!p||p.schema!==1||typeof p.id!=='string'||typeof p.title!=='string'||!Array.isArray(p.scenes)||!p.scenes.length||p.scenes.length>500)throw Error('올바른 작품 파일이 아니에요.');
 const ids=new Set(), choices=new Set();for(const s of p.scenes){if(!s.id||ids.has(s.id)||typeof s.title!=='string'||typeof s.body!=='string'||!Array.isArray(s.choices))throw Error('장면 형식을 확인해 주세요.');ids.add(s.id);for(const c of s.choices){if(!c.id||choices.has(c.id)||typeof c.label!=='string'||!Number.isFinite(c.delta)||!Number.isFinite(c.min))throw Error('선택지 형식을 확인해 주세요.');choices.add(c.id)}}
 if(!ids.has(p.start)||p.scenes.some(s=>s.choices.some(c=>!ids.has(c.target))))throw Error('연결되지 않은 장면이 있어요.');return p;
}
export function replay(p,save){let scene=p.scenes.find(s=>s.id===p.start),score=0,history=[],warning='';const input=save?.history;if(!Array.isArray(input)||input.length>10000)throw Error('세이브 형식을 확인해 주세요.');for(const h of input){const c=scene.choices.find(c=>c.id===h.choice);if(!c||score<c.min){warning='업데이트로 달라진 지점 직전까지 복원했어요.';break}history.push({scene:scene.id,choice:c.id,title:scene.title,label:c.label});score+=c.delta;scene=p.scenes.find(s=>s.id===c.target);if(!scene)throw Error('연결 장면이 없어요.')}return {scene,score,history,warning};}
export function encode(p,s){return 'GAL1.'+btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify({v:1,project:p.id,history:s.history.map(h=>({choice:h.choice}))}))));}
export function decode(p,code){if(!code.startsWith('GAL1.')||code.length>2000000)throw Error('올바른 세이브 코드가 아니에요.');let s;try{s=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(code.slice(5)),c=>c.charCodeAt(0))))}catch{throw Error('세이브 코드를 읽을 수 없어요.')}if(s.project!==p.id)throw Error('다른 작품의 세이브 코드예요.');if(s.v!==1)throw Error('지원하지 않는 세이브 버전이에요.');replay(p,s);return s;}

// Player data is independent of the five-tab interface and scene text.
export function normalizePlayer(raw={}) {
 if(!raw||typeof raw!=='object')throw Error('플레이 데이터 형식을 확인해 주세요.');
 const history=raw.history??[];
 if(!Array.isArray(history)||history.length>10000||history.some(h=>!h||typeof h.choice!=='string'))throw Error('선택 기록 형식이 올바르지 않아요.');
 const b=raw.build??{name:'',stats:{},completed:false};
 if(!b||typeof b.name!=='string'||b.name.length>100||typeof b.completed!=='boolean'||!b.stats||Array.isArray(b.stats)||typeof b.stats!=='object'||Object.entries(b.stats).some(([k,v])=>k.length>100||!Number.isFinite(v)||Math.abs(v)>1000000))throw Error('빌딩 데이터 형식을 확인해 주세요.');
 const cut=b.cutscene??{scene:'opening'};
 if(!cut||typeof cut!=='object'||typeof cut.scene!=='string'||cut.scene.length>300)throw Error('빌딩 컷씬 기록 형식을 확인해 주세요.');
 const list=key=>{const a=raw[key]??[];if(!Array.isArray(a)||a.length>10000||a.some(x=>typeof x!=='string'||x.length>300))throw Error('해금 데이터 형식을 확인해 주세요.');return [...new Set(a)]};
 return {v:2,history:history.map(h=>({choice:h.choice})),build:{name:b.name,stats:{...b.stats},completed:b.completed,cutscene:{scene:cut.scene}},bonds:list('bonds'),lore:list('lore'),events:list('events'),perks:list('perks')};
}
export function encodePlayer(p,raw){const s=normalizePlayer(raw),bytes=new TextEncoder().encode(JSON.stringify({...s,project:p.id}));let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return 'GAL2.'+btoa(binary)}
export function decodePlayer(p,code){if(code.startsWith('GAL1.'))return normalizePlayer(decode(p,code));if(!code.startsWith('GAL2.')||code.length>2000000)throw Error('올바른 플레이 데이터 코드가 아니에요.');let raw;try{raw=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(code.slice(5)),c=>c.charCodeAt(0))))}catch{throw Error('코드를 읽을 수 없어요.')}if(raw.v!==2||raw.project!==p.id)throw Error('버전 또는 작품 ID가 일치하지 않아요.');const s=normalizePlayer(raw);replay(p,s);return s}

// Stable stage IDs keep unfinished character building resumable across updates.
export function buildingStages(project){return [
 {id:'opening',type:'opening',title:'인적 정보 기록',body:'장면을 따라 수사관의 프로필을 작성합니다.\n남긴 정보는 마지막 장면에서 확인하고 확정할 수 있습니다.'},
 {id:'identity',type:'identity',title:'어떤 이름으로 기록할까요?',body:'수사관의 이름을 남겨 주세요.'},
 ...(project.stats||[]).map(stat=>({id:'stat:'+stat.id,type:'stat',title:stat.name,body:stat.prompt||'수사관의 '+stat.name+' 정보를 설정합니다.',stat})),
 {id:'review',type:'review',title:'이 기록이 당신입니까?',body:'작성한 인적 정보를 확인해 주세요.\n확정하면 프로필 요약 화면으로 전환됩니다.'}
]}
export function buildingPosition(project,build){const stages=buildingStages(project),stored=build.cutscene?.scene||'opening';let index=stages.findIndex(s=>s.id===stored);if(index<0)index=0;return {stages,index,stage:stages[index]}}
function validateBuildingStats(project,build){for(const stat of project.stats||[]){const value=build.stats[stat.id]??stat.initial;if(!Number.isFinite(value)||value<stat.min||value>stat.max)throw Error(stat.name+'의 설정 범위를 확인해 주세요.');build.stats[stat.id]=value}}
export function moveBuilding(project,build,direction){const next=normalizePlayer({build}).build;if(next.completed)throw Error('이미 확정한 인적 정보입니다.');const {stages,index,stage}=buildingPosition(project,next);if(direction!==1&&direction!==-1)throw Error('올바르지 않은 장면 이동입니다.');if(direction===1){if(stage.type==='identity'){next.name=next.name.trim();if(!next.name)throw Error('기록할 이름을 입력해 주세요.')}if(stage.type==='stat'){const stat=stage.stat,value=next.stats[stat.id]??stat.initial;if(!Number.isFinite(value)||value<stat.min||value>stat.max)throw Error(stat.name+'의 설정 범위를 확인해 주세요.');next.stats[stat.id]=value}}next.cutscene.scene=stages[Math.max(0,Math.min(stages.length-1,index+direction))].id;return next}
export function completeBuilding(project,build){const next=normalizePlayer({build}).build;if(next.completed)return next;if(buildingPosition(project,next).stage.type!=='review')throw Error('마지막 확인 장면에서 인적 정보를 확정해 주세요.');next.name=next.name.trim();if(!next.name)throw Error('기록할 이름을 입력해 주세요.');validateBuildingStats(project,next);next.completed=true;return next}
