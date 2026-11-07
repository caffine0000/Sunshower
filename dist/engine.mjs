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
 const list=key=>{const a=raw[key]??[];if(!Array.isArray(a)||a.length>10000||a.some(x=>typeof x!=='string'||x.length>300))throw Error('해금 데이터 형식을 확인해 주세요.');return [...new Set(a)]};
 return {v:2,history:history.map(h=>({choice:h.choice})),build:{name:b.name,stats:{...b.stats},completed:b.completed},bonds:list('bonds'),lore:list('lore'),events:list('events'),perks:list('perks')};
}
export function encodePlayer(p,raw){const s=normalizePlayer(raw),bytes=new TextEncoder().encode(JSON.stringify({...s,project:p.id}));let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return 'GAL2.'+btoa(binary)}
export function decodePlayer(p,code){if(code.startsWith('GAL1.'))return normalizePlayer(decode(p,code));if(!code.startsWith('GAL2.')||code.length>2000000)throw Error('올바른 플레이 데이터 코드가 아니에요.');let raw;try{raw=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(code.slice(5)),c=>c.charCodeAt(0))))}catch{throw Error('코드를 읽을 수 없어요.')}if(raw.v!==2||raw.project!==p.id)throw Error('버전 또는 작품 ID가 일치하지 않아요.');const s=normalizePlayer(raw);replay(p,s);return s}
