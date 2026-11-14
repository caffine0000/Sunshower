const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const base=process.env.PAGE_URL;if(!base)throw Error('Missing Pages URL');
 const expected=fs.readFileSync('dist/index.html','utf8');
 const app=expected.match(/src="(app\.[a-f0-9]+\.js)"/)[1],css=expected.match(/href="(style\.[a-f0-9]+\.css)"/)[1];
 const appText=fs.readFileSync(path.join('dist',app),'utf8'),engine=appText.match(/from '\.\/(engine\.[a-f0-9]+\.mjs)'/)[1];
 for(let attempt=0;attempt<10;attempt++){
  try{
   const index=await fetch(new URL('?release='+process.env.GITHUB_SHA,base),{cache:'no-store'});assert.equal(index.status,200);const html=await index.text();assert.ok(html.includes(app)&&html.includes(css),'HTML references stale assets');
   for(const file of [app,css,engine]){const r=await fetch(new URL(file,base),{cache:'no-store'});assert.equal(r.status,200,file);assert.equal(await r.text(),fs.readFileSync(path.join('dist',file),'utf8'),file+' contents differ')}
   for(const match of appText.matchAll(/icon:'(assets\/menu-[^']+\.png)'/g)){const file=match[1],response=await fetch(new URL(file,base),{cache:'no-store'});assert.equal(response.status,200,file);assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join('dist',file)),file+' image differs')}
   for(const match of fs.readFileSync(path.join('dist',engine),'utf8').matchAll(/image:'(assets\/cutscene-[^']+\.jpg)'/g)){const file=match[1],response=await fetch(new URL(file,base),{cache:'no-store'});assert.equal(response.status,200,file);assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join('dist',file)),file+' image differs')}
   assert.ok(appText.includes('runeInscription()'));assert.ok(appText.includes('Failed and Find'));assert.ok(!appText.includes('class="hidden-inscription"'));
   console.log('PASS: live HTML and versioned CSS, JS, engine match this release; geometric rune ornament is served.');return;
  }catch(e){if(attempt===9)throw e;console.log('Waiting for Pages propagation:',e.message);await new Promise(r=>setTimeout(r,5000))}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
