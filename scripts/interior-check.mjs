import {chromium} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const base=process.env.BASE_URL||'http://localhost:8787';const browser=await chromium.launch({headless:true});await fs.mkdir('artifacts/interiors',{recursive:true});
try{for(const width of [1280,390]){
 const p=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await p.goto(base+'/?preset=revenue');await p.click('[data-shock="energy"]');await p.click('#start-btn');
 const shot=async(name)=>{await p.waitForFunction(()=>Array.from(document.querySelectorAll('main img')).every(i=>i.complete&&i.naturalWidth>0));assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`artifacts/interiors/${name}-${width}.png`,fullPage:true})};
 await shot('spending');
 for(let y=0;y<5;y++){
  if(y===2){assert.ok(await p.locator('.economic-shock img').isVisible());await shot('shock')}
  await p.click('[data-action="funding"]');assert.equal(await p.locator('.envelope-icon').count(),4);
  if(y===0){await shot('funding');assert.match(await p.locator('.ledger-seal').innerText(),/WITHIN CEILING/)}
  await p.click('[data-action="review"]');await p.click('[data-action="commit"]');
  assert.ok(await p.locator('.bulletin-prop').isVisible());if(y===0)await shot('bulletin');
  await p.click('[data-action="continue"]');
 }
 assert.ok(await p.locator('.legacy-prop').isVisible());await shot('results');assert.match(await p.locator('.legacy-verdict').innerText(),/ALL GAME CHECKS MET/);assert.deepEqual(errors,[]);await p.close();
}console.log('Interior art loaded on spending, funding, shock, bulletin and results; all five Budgets and mobile layout passed.');}finally{await browser.close()}
