export const fresh=()=>({v:1,history:[]});
export function validate(p){
 if(!p||p.schema!==1||typeof p.id!=='string'||typeof p.title!=='string'||!Array.isArray(p.scenes)||!p.scenes.length||p.scenes.length>500)throw Error('올바른 작품 파일이 아니에요.');
 const ids=new Set(), choices=new Set();for(const s of p.scenes){if(!s.id||ids.has(s.id)||typeof s.title!=='string'||typeof s.body!=='string'||!Array.isArray(s.choices))throw Error('장면 형식을 확인해 주세요.');ids.add(s.id);for(const c of s.choices){if(!c.id||choices.has(c.id)||typeof c.label!=='string'||!Number.isFinite(c.delta)||!Number.isFinite(c.min))throw Error('선택지 형식을 확인해 주세요.');choices.add(c.id)}}
 if(!ids.has(p.start)||p.scenes.some(s=>s.choices.some(c=>!ids.has(c.target))))throw Error('연결되지 않은 장면이 있어요.');return p;
}
export function replay(p,save){let scene=p.scenes.find(s=>s.id===p.start),score=0,history=[],warning='';const input=save?.history;if(!Array.isArray(input)||input.length>10000)throw Error('세이브 형식을 확인해 주세요.');for(const h of input){const c=scene.choices.find(c=>c.id===h.choice);if(!c||score<c.min){warning='업데이트로 달라진 지점 직전까지 복원했어요.';break}history.push({scene:scene.id,choice:c.id,title:scene.title,label:c.label});score+=c.delta;scene=p.scenes.find(s=>s.id===c.target);if(!scene)throw Error('연결 장면이 없어요.')}return {scene,score,history,warning};}
export function encode(p,s){return 'GAL1.'+btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify({v:1,project:p.id,history:s.history.map(h=>({choice:h.choice}))}))));}
export function decode(p,code){if(!code.startsWith('GAL1.')||code.length>2000000)throw Error('올바른 세이브 코드가 아니에요.');let s;try{s=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(code.slice(5)),c=>c.charCodeAt(0))))}catch{throw Error('세이브 코드를 읽을 수 없어요.')}if(s.project!==p.id)throw Error('다른 작품의 세이브 코드예요.');if(s.v!==1)throw Error('지원하지 않는 세이브 버전이에요.');replay(p,s);return s;}

// Profiles replace the old appearance editor; legacy portrait and height migrate below.
export const cardThemeIds=['glass','archive','noir'];
export function normalizeProfile(raw={}){if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('프로필 데이터 형식을 확인해 주세요.');const p={portrait:raw.portrait??'',race:raw.race??'',intro:raw.intro??'',height:raw.height??170,weight:raw.weight??60,themeColor:raw.themeColor??'#8fc8b9',cardTheme:raw.cardTheme??'glass',collectible:raw.collectible??''};if(typeof p.portrait!=='string'||p.portrait.length>400000||(p.portrait!==''&&!/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/]+={0,2}$/i.test(p.portrait)))throw Error('프로필 이미지 형식을 확인해 주세요.');if(typeof p.race!=='string'||p.race.length>60||typeof p.intro!=='string'||p.intro.length>400||typeof p.collectible!=='string'||p.collectible.length>300)throw Error('프로필 문구 형식을 확인해 주세요.');if(!Number.isInteger(p.height)||p.height<120||p.height>220||typeof p.weight!=='number'||!Number.isFinite(p.weight)||p.weight<20||p.weight>250)throw Error('키와 몸무게의 설정 범위를 확인해 주세요.');if(typeof p.themeColor!=='string'||!/^#[0-9a-f]{6}$/i.test(p.themeColor)||!cardThemeIds.includes(p.cardTheme))throw Error('명함 테마 형식을 확인해 주세요.');p.themeColor=p.themeColor.toLowerCase();return p}

export const THOUGHT_LIMIT_DEFAULT_MAX=250;
export const THOUGHT_LIMIT_GIFT_BONUS=50;
export function thoughtLimitMaximum(build){return THOUGHT_LIMIT_DEFAULT_MAX+(build?.thoughtGiftReceived===true?THOUGHT_LIMIT_GIFT_BONUS:0)}
export const IMMORTAL_THOUGHT_COST=251;
export const IDENTITY_STAT_MIN=1;
export const IDENTITY_STAT_MAX=6;
export const IDENTITY_STAT_STEP_COST=20;
export const identityStatDefinitions=[
 {id:'strength',name:'근력',englishName:'Strength'},
 {id:'stamina',name:'지구력',englishName:'Stamina'},
 {id:'durability',name:'내구력',englishName:'Durability'},
 {id:'reflexes',name:'순발력',englishName:'Reflexes'},
 {id:'regeneration',name:'재생력',englishName:'Regeneration'},
 {id:'intellect',name:'지력',englishName:'Intellect'}
];
export const identityTraitLevels=['negative','neutral','positive'];
export const identityTraits=[
 {
  id:'example',
  name:'특성 예시',
  levels:{
   negative:{description:'이 특성을 네거티브로 선택합니다.',cost:-20},
   neutral:{description:'이 특성은 뉴트럴 상태입니다.',cost:0},
   positive:{description:'이 특성을 포지티브로 선택합니다.',cost:20}
  }
 }
];
export const raceTypes=[{id:'human',name:'휴먼'},{id:'elf',name:'엘프'},{id:'dwarf',name:'드워프'},{id:'beastkin',name:'수인'},{id:'celestial',name:'천족'},{id:'demon',name:'마족'},{id:'spirit',name:'정령'},{id:'automaton',name:'오토마타'}];
const elfDivisions=[
 {
  id:'modern',
  name:'모던',
  englishName:'Modern',
  description:'어떤 엘프들은 돌벽에, 아스팔트에 적응했다.',
  traitOverrides:{
   1:{tone:'altered',name:'제육감',description:"모던 엘프들은 특유의 생명 감지는 약화되었지만 미약하게나마 시선 밖의 모든 것을 감지할 수 있다. 어디까지나 '미약한'이기에 감지 그 이상은 힘들다."},
   2:{tone:'faded',description:'인간은 적응하기 마련이기에 엘프들 중에도, 그런 환경에서 끝없이 살아가며 그 후손들은 점차 자유로워져갔다.'}
  }
 },
 {
  id:'snowfield',
  name:'설원',
  englishName:'Frost',
  description:'어떤 엘프들은 생명 없는 곳에서 살아갔다.',
  traitOverrides:{
   1:{tone:'faded',description:'생명 없는 곳으로 이민간 엘프들의 후손은 점차 식생을 감지하는 힘이 약해져갔다. 사냥을 하는데 필요한 정도까지 약해진 이 감각은 움직이지 않는 것의 위치는 도저히 알 수 없다.'},
   2:{tone:'altered',name:'저온 적응',description:'생명이라면 기피할 땅에서 살아온 이 엘프들은 냉동고에서 하루를 머물러도 멀쩡하다. 오히려 저온을 선호하여 여름이 되면 설원 엘프들의 냉방비 지출이 폭발적으로 늘어난다.'}
  }
 }
];
export const raceDivisionDetails={
 elf:elfDivisions,
 beastkin:[
  {
   id:'mythic-beast',
   name:'환수인',
   englishName:'Cryptid',
   description:'어떤 수인들은 조금 이질적이다.',
   profileName:'환수인',
   traitOverrides:{
    0:{tone:'altered',name:'환수',
     description:"자연에서 근간의 반쪽을 찾지 못한 이들을 '환수인'이라고 부른다. 아예 그들을 기반으로 상상의 생물 '환수'들을 만들거나 '미스틱'이라는 괴물들의 형태에서 환수인의 형질을 발견하기도 한다."}
   }
  },
  {
   id:'chimera',
   name:'키메라',
   englishName:'Chimera',
   description:'어떤 수인들은 여러 본질을 보유했다.',
   extraTraits:[{
    name:'혼합된 형질',
    description:"서로 다른 수인들의 자손으로 태어나면 확률적으로 그 형질이 불완전하게 섞인 '키메라'가 된다. 환수인 이상으로 이질적이고 신비한 이 존재들은 장애 비율이 높아 불길하고 역겨운 취급을 당했었다."
   }]
  }
 ],
 celestial:[
  {
   id:'akasha',
   name:'아카샤',
   englishName:'akasha',
   description:'어떤 이들은 날개 없이 고요하다.',
   traitOverrides:{
    0:{tone:'altered',name:'광륜과 권익',description:"아카샤라는 존재는 몇몇 지역의 이형 천족으로 날개가 아닌 '권익'이라는 또 다른 광륜을 등쪽에 가진 이들이다."}
   }
  },
  {
   id:'nymph',
   name:'님프',
   englishName:'Nymphe',
   description:'어떤 천족들은 신비한 흔적을 남겼다.',
   traitOverrides:{
    0:{tone:'altered',name:'요정의 날개',description:'광륜은 없고 곤충계 수인의 날개를 닮은 것을 지닌 이 천족들의 날개에는 위조가 불가능한 수준으로 복잡한 미세 문양을 가지고 있다. 미적으로도 기하학적으로도 흥미롭다.'}
   },
   extraTraits:[{
    name:'님프 더스트',
    description:'님프들은 피부에서 가루를 내뿜는다. 향은 없지만 특유의 감촉과 빛깔이 있고 신비술사들이라면 더스트에 신비력이 깃들기도 한다. 아름답긴 하다만 실생활에선 정밀 기기를 죄다 망가뜨려서 골머리를 앓는다.'
   }]
  }
 ],
 demon:[
  {
   id:'vampire',
   name:'뱀파이어',
   englishName:'Vampire',
   description:'어떤 마족들은 피에 이끌린다.',
   extraTraits:[
    {name:'흡혈 충동',description:'정확하게 말하자면 철분 갈망이다. 다만 어지간한 철분 수급처는 인간의 이로는 씹어먹을 수 없어 피를 찾게 된 것이다. 현재는 전용 철분 섭취제만 있으면 갈망에 시달리지 않는다.'},
    {name:'혈감각',description:'뱀파이어들은 피... 정확히는 섭취 가능한 형태의 철분을 찾기 위해 피를 후각으로 감지할 수 있다. 다만 최근 도시화로 인한 철제 구조물 증가로 이 감각이 둔해졌다는 연구가 있다.'}
   ]
  },
  {
   id:'gargoyle',
   name:'가고일',
   englishName:'Gargoyle',
   description:'어떤 마족들의 피부는 견고하다.',
   extraTraits:[{name:'피부 경화',description:'유하지만 반결정 구조의 피부는 상상 이상으로 튼튼하여 차와 부딪혀도 생존률이 비교적 높다는 연구가 있다. 최근 가고일의 신체를 이용한 폭행을 특수 폭행으로 취급하겠다는 법 개정이 추진되고 있다.'}]
  },
  {
   id:'nachzehrer',
   name:'나흐체러',
   englishName:'nachzehrer',
   description:'어떤 마족은 자신을 숨길 수 없다.',
   extraTraits:[{name:'체향',description:'나흐체러들에게는 고유한 체향이 크게 난다. 태어날 때부터 정해지는 이 향은 향기이든 악취이든 코를 찌르는 건 매한가지라 탈취제를 필요로 하게 된다.'}]
  },
  {
   id:'shade',
   name:'셰이드',
   englishName:'Shade',
   description:'어떤 마족은 그림자에 녹아든다.',
   extraTraits:[{name:'분진화',description:'마치 가루로 흩어지는 이 기술은 영혼이라는 것의 존재를 말하는 것 같다. 몸은 형체를 잃어도 그것을 기억해줄 존재가 있다는 듯. 그럼에도 쌓아올리는 데에는 시간이 필요하다.'}]
  },
  {
   id:'imp',
   name:'임프',
   englishName:'Imp',
   description:'어떤 마족들은 세상이 지루하다.',
   traitOverrides:{
    0:{tone:'altered',name:'뿔과 긴 꼬리',description:'임프들의 꼬리는 더 길고 자유롭게 움직인다. 과거에는 이 특징을 이용해 암살 병력으로 활용하려 했으나 후술할 단점에 계획은 폐기되었다.'}
   },
   extraTraits:[
    {name:'유형 성숙',description:'드워프들의 그것과 비슷하나 정확히는 성장을 평생에 걸쳐 하는 것이 아닌 최종 성장 자체가 어리게 되어 있다. 이런 임프들의 특징을 사랑하는 이상한 이들도 있다. 꽤 많이.'},
    {name:'트릭스터',description:'임프들의 신경 수용체 구조는 일반인과 다르게 도파민 수용체가 변질되어 더더욱 스릴과 예외성을 갈망한다. 그렇기에 임프들은 본능적으로 장난을 사랑한다. 그것마저도 외견에 걸맞다.'}
   ]
  },
  {
   id:'oni',
   name:'오니',
   englishName:'Oni',
   description:'어떤 마족은 가면을 쓴다.',
   extraTraits:[{name:'광화',description:'오니들은 분노와 스트레스가 일정 이상의 지점까지 쌓였다면 이성을 잃고 몸에서 엄청난 발열을 내며 날뛰는 상태가 된다. 그런 특징 탓에 오니 가정에서는 의외로 엄격하게 교육하지 않는다. 대신 화를 방출하고 해소하는 법을 철저히 가르친다.'}]
  },
  {
   id:'succubus',
   name:'서큐버스',
   englishName:'Succubus',
   description:'어떤 마족들은 육체에 관심을 가졌다.',
   extraTraits:[{name:'매료',description:'서큐버스들은 본능적으로 사람의 마음에 접속하고 그 통제를 얻는 힘을 가졌다. 이러한 특징과 과거 자신의 성도 수단으로 여기던 문화 탓에 사교계에서 굉장히 무서운 존재로 여겨졌다.'}]
  },
  {
   id:'dokkaebi',
   name:'도깨비',
   englishName:'Dokkabi',
   description:'어떤 마족들은 만드는 것을 좋아했다.',
   extraTraits:[{name:'신비술 각인',description:'어째서인지 신비술사인 도깨비들에겐 이 힘이 있었다. 물건에 자신의 신비술을 새길 수 있었던 이 힘은 과거 여러 유물들과 연관이 있다는 역사학자들의 추론을 이끌었다.'}]
  }
 ],
 spirit:[{
  id:'modern',
  name:'모던',
  englishName:'Modern',
  description:'어떤 정령들은 사물에 애착을 가지기 시작했다.',
  extraTraits:[{
   name:'귀속',
   description:'현대의 몇몇 정령들은 신비술사가 되는 순간, 자신이 애착을 가지고 함께 있던 사물과 연결되는 감각을 느낀다. 트라우마가 될 사건의 곁에 있었기에 물건과 사람은 떨어지지 않는다. 물건또한 신비를 가지게 된다.'
  }]
 }],
 dwarf:[{
  id:'sky',
  name:'천공',
  englishName:'Stella',
  description:'어떤 드워프들은 대지보다 하늘을 멍하니 쳐다봤다.',
  extraTraits:[{
   name:'천체 공명',
   description:'별도 중앙이 금속일 것이라는 말처럼 천공 드워프들은 별들을 느낄 수 있다. 하늘에 구름이 끼어도 길잡이별의 위치를 알 수 있었던 그들은 길잡이로 여겨졌다.'
  }]
 }]
};
export const allowsMultipleRaceDivisions=id=>id==='beastkin';
export function selectedRaceDivisionIds(race,id){
 const saved=race.divisions[id];
 return Array.isArray(saved)?saved:saved?[saved]:[];
}
export function normalizeRace(raw={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('종족 데이터 형식을 확인해 주세요.');
 const r={primary:raw.primary??'',secondary:raw.secondary??'',immortal:raw.immortal??false,mixed:raw.mixed??false,divisions:{...raw.divisions}};
 const valid=id=>id===''||raceTypes.some(race=>race.id===id);
 if(!valid(r.primary)||!valid(r.secondary)||typeof r.immortal!=='boolean'||typeof r.mixed!=='boolean'||(raw.divisions!=null&&(typeof raw.divisions!=='object'||Array.isArray(raw.divisions))))throw Error('종족 선택 형식을 확인해 주세요.');
 if(r.secondary==='automaton'&&r.primary!=='automaton'){[r.primary,r.secondary]=[r.secondary,r.primary]}
 if(!r.primary||!r.mixed||r.primary===r.secondary)r.secondary='';
 for(const [id,saved] of Object.entries(r.divisions)){
  const multiple=allowsMultipleRaceDivisions(id);
  const ids=multiple&&Array.isArray(saved)?saved:[saved];
  if(!id||!valid(id)||ids.length>100||ids.some(value=>typeof value!=='string'||value.length>100))throw Error('종족 분화 형식을 확인해 주세요.');
  if(![r.primary,r.secondary].includes(id)){
   delete r.divisions[id];
  }else if(multiple){
   const unique=[...new Set(ids.filter(Boolean))];
   if(unique.length)r.divisions[id]=unique;
   else delete r.divisions[id];
  }
 }
 return r;
}
// Selection order is retained except that automaton always takes the primary slot.
export function selectRace(raw,id){if(!raceTypes.some(race=>race.id===id))throw Error('종족을 확인해 주세요.');const r=normalizeRace(raw);if(!r.mixed)return normalizeRace({...r,primary:id,secondary:''});if(r.primary===id)return normalizeRace({...r,primary:r.secondary,secondary:''});if(r.secondary===id)return normalizeRace({...r,secondary:''});return normalizeRace(r.primary?{...r,secondary:id}:{...r,primary:id})}
export function raceDisplay(raw){
 const r=normalizeRace(raw);
 const names=[r.primary,r.secondary].filter(Boolean).map(id=>{
  const name=raceTypes.find(race=>race.id===id).name;
  const selected=selectedRaceDivisionIds(r,id);
  const divisions=raceDivisionDetails[id]?.filter(item=>selected.includes(item.id))||[];
  if(allowsMultipleRaceDivisions(id))return divisions.find(item=>item.profileName)?.profileName||name;
  return divisions.length?name+'('+divisions[0].name+')':name;
 });
 const separator=r.primary==='automaton'?'-':' · ';
 return names.length?names.join(separator)+(r.immortal?' / 영생종':''):'';
}

function normalizeIdentityTraits(raw={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length>300||
  Object.values(raw).some(level=>!identityTraitLevels.includes(level)))throw Error('특성 선택 기록을 확인해 주세요.');
 return Object.fromEntries(identityTraits.filter(({id})=>Object.hasOwn(raw,id)&&raw[id]!=='neutral').map(({id})=>[id,raw[id]]));
}
function normalizeIdentityStats(raw={}){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('스테이터스 선택 기록을 확인해 주세요.');
 return Object.fromEntries(identityStatDefinitions.map(({id})=>{
  const level=Object.hasOwn(raw,id)?raw[id]:IDENTITY_STAT_MIN;
  if(!Number.isInteger(level)||level<IDENTITY_STAT_MIN||level>IDENTITY_STAT_MAX)throw Error('스테이터스는 1단계에서 6단계 사이로 설정해 주세요.');
  return [id,level];
 }));
}

// Player data is independent of the five-tab interface and scene text.
export function normalizePlayer(raw={}) {
 if(!raw||typeof raw!=='object')throw Error('플레이 데이터 형식을 확인해 주세요.');
 const history=raw.history??[];
 if(!Array.isArray(history)||history.length>10000||history.some(h=>!h||typeof h.choice!=='string'))throw Error('선택 기록 형식이 올바르지 않아요.');
 const b=raw.build??{name:'',stats:{},completed:false};
 if(!b||typeof b.name!=='string'||b.name.length>100||typeof b.completed!=='boolean'||!b.stats||Array.isArray(b.stats)||typeof b.stats!=='object'||Object.entries(b.stats).some(([k,v])=>k.length>100||!Number.isFinite(v)||Math.abs(v)>1000000))throw Error('빌딩 데이터 형식을 확인해 주세요.');
 const gender=b.gender??'';
 if(!['','male','female'].includes(gender))throw Error('성별 데이터 형식을 확인해 주세요.');
 const cut=b.cutscene??{scene:'opening'};
 if(!cut||typeof cut!=='object'||typeof cut.scene!=='string'||cut.scene.length>300)throw Error('빌딩 컷씬 기록 형식을 확인해 주세요.');
 const cutChoices=cut.choices??{};
 if(!cutChoices||typeof cutChoices!=='object'||Array.isArray(cutChoices)||Object.keys(cutChoices).length>300||Object.entries(cutChoices).some(([key,value])=>key.length>300||typeof value!=='string'||value.length>300))throw Error('컷씬 선택 기록 형식을 확인해 주세요.');
 const list=key=>{const a=raw[key]??[];if(!Array.isArray(a)||a.length>10000||a.some(x=>typeof x!=='string'||x.length>300))throw Error('해금 데이터 형식을 확인해 주세요.');return [...new Set(a)]};
 const collectibles=list('collectibles'),profile=normalizeProfile(b.profile??{portrait:b.appearance?.portrait??'',height:b.appearance?.height??170});if(profile.collectible&&!collectibles.includes(profile.collectible))profile.collectible='';
 const race=normalizeRace(b.race??{primary:raceTypes.find(r=>r.name===profile.race)?.id||''});
 const traitChoices=normalizeIdentityTraits(b.traitChoices);
 const traitCost=identityTraits.reduce((total,{id,levels})=>total+levels[traitChoices[id]??'neutral'].cost,0);
 const identityStats=normalizeIdentityStats(b.identityStats);
 const statCost=Object.values(identityStats).reduce((total,level)=>total+(level-IDENTITY_STAT_MIN)*IDENTITY_STAT_STEP_COST,0);
 const customizationCost=traitCost+statCost;
 const storedThought=b.thoughtLimit??0,thoughtLimitBase=b.thoughtLimitBase??storedThought;
 const maxStoredThought=1000000+IMMORTAL_THOUGHT_COST+Math.max(0,customizationCost);
 if(!Number.isInteger(storedThought)||storedThought<0||storedThought>maxStoredThought||!Number.isInteger(thoughtLimitBase)||thoughtLimitBase<0||thoughtLimitBase>1000000)throw Error('사고 한계 수치를 확인해 주세요.');
 const thoughtGiftReceived=b.thoughtGiftReceived??false;
 if(typeof thoughtGiftReceived!=='boolean')throw Error('사고 한계 확장 기록을 확인해 주세요.');
 const thoughtLimit=Math.max(0,thoughtLimitBase+(race.immortal?IMMORTAL_THOUGHT_COST:0)+customizationCost);
 if(race.primary)profile.race=raceDisplay(race);
 return {v:2,history:history.map(h=>({choice:h.choice})),build:{name:b.name,gender,profile,race,traitChoices,identityStats,thoughtLimitBase,thoughtLimit,thoughtGiftReceived,stats:{...b.stats},completed:b.completed,cutscene:{scene:cut.scene,choices:{...cutChoices}}},bonds:list('bonds'),lore:list('lore'),events:list('events'),perks:list('perks'),collectibles};
}
export function grantThoughtGift(raw){const next=normalizePlayer(raw);if(next.build.completed||next.build.thoughtGiftReceived||next.build.thoughtLimit<=thoughtLimitMaximum(next.build))throw Error('지금은 사고 한계를 확장할 수 없어요.');next.build.thoughtGiftReceived=true;return next}
export function encodePlayer(p,raw){const s=normalizePlayer(raw),bytes=new TextEncoder().encode(JSON.stringify({...s,project:p.id}));let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return 'GAL2.'+btoa(binary)}
export function decodePlayer(p,code){if(code.startsWith('GAL1.'))return normalizePlayer(decode(p,code));if(!code.startsWith('GAL2.')||code.length>2000000)throw Error('올바른 플레이 데이터 코드가 아니에요.');let raw;try{raw=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(code.slice(5)),c=>c.charCodeAt(0))))}catch{throw Error('코드를 읽을 수 없어요.')}if(raw.v!==2||raw.project!==p.id)throw Error('버전 또는 작품 ID가 일치하지 않아요.');const s=normalizePlayer(raw);replay(p,s);return s}

// Stable stage IDs keep unfinished character building resumable across updates.
export function buildingStages(project){const reclaimBody="나의 형체가 다시 명확해진다.\n내 목소리도 나의 기억으로 돌아온다.\n\n\"그럼 이제부터는 [플레이어 이름] [오빠/언니]라고 부를게!\"\n\n\"어라? 머리가 좀 상쾌해진 표정이네!\"\n\"내 이름은... 일단은 '미래'!\"\n\"놀이터에서 놀다 지하철타고 집으로 가고 있어!\"\n\n자신을 일단...? '미래'라고 소개하는 이 존재는\n어린아이스럽지 않은 미소를 짓습니다.";return [
 {id:'opening',type:'opening',image:'assets/cutscene-subway-7ec23ce9f4.jpg',imageAlt:'지하철 창문 너머로 비와 빛의 소용돌이가 펼쳐지는 풍경',title:'나는 누구인가?',body:'눈을 뜬 순간, 나는 알 수 없는 지하철에 올라탔다.\n행선지도 목적도... 그리고 나도 기억나질 않는다.'},
 // Keep the old second-stage ID so unfinished saves see this encounter after updating.
 {id:'identity',type:'narrative',image:'assets/cutscene-girl-ec30245801.jpg',imageAlt:'비 내리는 지하철 안에서 빛을 머금은 눈으로 바라보는 여자아이',title:'의문의 여자아이',body:"\"들려? 좀 괜찮지?\"\n\"지나가던 중이였는데... 머리를 잡고 있길래 불러봤어.\"\n\n외양도 복장도 어린아이처럼 생겼지만\n빛을 쪼개는 그 눈을 빛내며 나를 응시한다.",nextLabel:'꼬마에게 이름을 묻는다'},
 {id:'profile-name',type:'identity',image:'assets/cutscene-name-8b0527f716.jpg',imageAlt:'비 내리는 지하철 안에서 눈을 감고 미소 짓는 여자아이',title:"\"내 이름은 알려줄 수 없어.\"",body:"\"우선 스스로의 이름부터 떠올려 볼래?\""},
 {id:'profile-gender',type:'gender',image:'assets/cutscene-gender-3b355062a9.jpg',imageAlt:'비 내리는 지하철 안에서 고개를 기울이며 바라보는 여자아이',title:'나는 [플레이어 이름]',body:"\"좋네. 이제부턴 [플레이어 이름]...\"\n\"혹시... '오빠'야...? '언니'야...?\"",choices:[{value:'male',label:'남성',image:'assets/choice-male-1ad21d19f5.webp',description:'소년은 나뭇가지에서 날아오르는 새를 보았다.'},{value:'female',label:'여성',image:'assets/choice-female-6a67aec181.webp',description:'소녀는 나뭇가지에 달린 열매를 보았다.'}]},
 {id:'existence-reclaim',type:'branch',image:'assets/cutscene-name-8b0527f716.jpg',imageAlt:'지하철 안에서 눈을 감고 미소 짓는 여자아이',title:'존재 탈환',body:reclaimBody,emphasis:{start:reclaimBody.indexOf("일단은 '미래'")+"일단은 '".length,length:2},choices:[{id:'ordinary',label:'평범하게 반응한다',target:'scene-6-1'},{id:'question-name',label:"어떻게 이름이 '미래'",target:'scene-6-2'}]},
 {id:'scene-6-1',type:'narrative',branchOf:'existence-reclaim',image:'assets/cutscene-name-8b0527f716.jpg',imageAlt:'비 내리는 지하철 안에서 눈을 감고 미소 짓는 여자아이',title:'구체화 개시',body:"\"이제 [플레이어 이름] [오빠/언니]를 더 알아보자!\"\n\n말이 끝나기 무섭게 소녀가 옆에\n앉아 나의 모자를 벗기고 있다는 걸 알았다.\n\n당황하며 뿌리쳤지만 모자에 감춰진 내가 유리창 너머로 비춰진다.",nextLabel:'나는...'},
 {id:'scene-6-2',type:'narrative',branchOf:'existence-reclaim',image:'assets/cutscene-pout-430b9f2d69.jpg',imageAlt:'지하철 안에서 볼을 부풀리며 바라보는 여자아이',title:'이쁜 이름이거든!',body:"소녀는 삐졌다는 듯이 볼을 부풀리며 노려본다.\n\n순간, 옆에서 모자를 뺏어가는 손을 보았다.\n반응도 하지 못한 채, 머리가 드러났다.\n\n꽁!\n\n\"나쁜 [오빠/언니]는 모자 압수에 꿀밤형이야!\"\n\n생각보다 매운 손에 머리를 부여잡다 유리창에\n비춘 나를 바라봤다.",nextLabel:'나는...',entryEffect:'white-impact'},
 {id:'customization',type:'customization',title:'커스터마이징',body:''},
 ...(project.stats||[]).map(stat=>({id:'stat:'+stat.id,type:'stat',title:stat.name,body:stat.prompt||'수사관의 '+stat.name+' 정보를 설정합니다.',stat})),
 {id:'review',type:'review',title:'이 기록이 당신입니까?',body:'작성한 인적 정보를 확인해 주세요.\n확정하면 프로필 요약 화면으로 전환됩니다.'}
]}
export function buildingPosition(project,build){const all=buildingStages(project),branches=all.filter(stage=>stage.type==='branch'),routes=new Map(branches.map(stage=>[stage.id,stage.choices.find(choice=>choice.id===build.cutscene?.choices?.[stage.id])?.target])),stages=all.filter(stage=>!stage.branchOf||routes.get(stage.branchOf)===stage.id),stored=build.cutscene?.scene||'opening';let index=stages.findIndex(stage=>stage.id===stored);if(index<0){const parent=all.find(stage=>stage.id===stored)?.branchOf;index=parent?stages.findIndex(stage=>stage.id===parent):0;if(index<0)index=0}if(!build.completed){const genderIndex=stages.findIndex(stage=>stage.type==='gender');if(!build.gender&&genderIndex>=0&&index>genderIndex)index=genderIndex;for(const branch of branches){const branchIndex=stages.findIndex(stage=>stage.id===branch.id);if(branchIndex>=0&&index>branchIndex&&!routes.get(branch.id))index=branchIndex}}return {stages,index,stage:stages[index]}}
function validateBuildingStats(project,build){for(const stat of project.stats||[]){const value=build.stats[stat.id]??stat.initial;if(!Number.isFinite(value)||value<stat.min||value>stat.max)throw Error(stat.name+'의 설정 범위를 확인해 주세요.');build.stats[stat.id]=value}}
export function moveBuilding(project,build,direction){const next=normalizePlayer({build}).build;if(next.completed)throw Error('이미 확정한 인적 정보입니다.');const {stages,index,stage}=buildingPosition(project,next);if(direction!==1&&direction!==-1)throw Error('올바르지 않은 장면 이동입니다.');if(direction===1){if(stage.type==='branch')throw Error('진행할 선택지를 골라 주세요.');if(stage.type==='gender'&&!next.gender)throw Error('성별을 선택해 주세요.');if(stage.type==='identity'){next.name=next.name.trim();if(!next.name)throw Error('기록할 이름을 입력해 주세요.')}if(stage.type==='stat'){const stat=stage.stat,value=next.stats[stat.id]??stat.initial;if(!Number.isFinite(value)||value<stat.min||value>stat.max)throw Error(stat.name+'의 설정 범위를 확인해 주세요.');next.stats[stat.id]=value}}next.cutscene.scene=stages[Math.max(0,Math.min(stages.length-1,index+direction))].id;return next}
export function completeBuilding(project,build){const next=normalizePlayer({build}).build;if(next.completed)return next;if(buildingPosition(project,next).stage.type!=='review')throw Error('마지막 확인 장면에서 인적 정보를 확정해 주세요.');next.name=next.name.trim();if(!next.name)throw Error('기록할 이름을 입력해 주세요.');if(!next.gender)throw Error('성별을 선택해 주세요.');if(!next.race.primary)throw Error('종족을 선택해 주세요.');if(next.race.mixed&&!next.race.secondary)throw Error((next.race.primary==='automaton'?'레플리카':'혼혈')+'의 두 번째 종족을 선택해 주세요.');validateBuildingStats(project,next);next.completed=true;return next}

export function chooseBuildingGender(project,build,value){const current=buildingPosition(project,build);if(build.completed||current.stage.type!=='gender')throw Error('성별을 선택하는 장면이 아닙니다.');if(!['male','female'].includes(value))throw Error('올바른 선택이 아닙니다.');const next=normalizePlayer({build}).build;next.gender=value;next.cutscene.scene=current.stage.id;return moveBuilding(project,next,1)}
export function formatPlayerText(value,build){const replacements={'[플레이어 이름]':build?.name||'이름 미설정','[오빠/언니]':build?.gender==='male'?'오빠':build?.gender==='female'?'언니':'오빠/언니'};return String(value??'').replace(/\[플레이어 이름\]|\[오빠\/언니\]/g,token=>replacements[token])}

export function chooseBuildingBranch(project,build,id){const current=buildingPosition(project,build);if(build.completed||current.stage.type!=='branch')throw Error('선택지를 고르는 장면이 아닙니다.');const choice=current.stage.choices.find(option=>option.id===id);if(!choice||!buildingStages(project).some(stage=>stage.id===choice.target))throw Error('올바른 선택이 아닙니다.');const next=normalizePlayer({build}).build;next.cutscene.choices[current.stage.id]=choice.id;next.cutscene.scene=choice.target;return next}

