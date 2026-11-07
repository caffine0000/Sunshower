const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve('dist'),target=path.resolve(process.argv[2]||'dist');
if(target!==root)fs.cpSync(root,target,{recursive:true});
function asset(name,contents){const ext=path.extname(name),stem=name.slice(0,-ext.length),hash=crypto.createHash('sha256').update(contents).digest('hex').slice(0,12),file=stem+'.'+hash+ext;fs.writeFileSync(path.join(target,file),contents);return file}
const engine=asset('engine.mjs',fs.readFileSync(path.join(root,'engine.mjs')));
const app=asset('app.js',fs.readFileSync(path.join(root,'app.js'),'utf8').replace("from './engine.mjs'","from './"+engine+"'"));
const css=asset('style.css',fs.readFileSync(path.join(root,'style.css')));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/href="style(?:\.[a-f0-9]+)?\.css"/,'href="'+css+'"').replace(/src="app(?:\.[a-f0-9]+)?\.js"/,'src="'+app+'"');
fs.writeFileSync(path.join(target,'index.html'),html);
console.log('Release assets:',JSON.stringify({app,css,engine}));
