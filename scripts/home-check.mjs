import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.BASE_URL||'http://localhost:8787';
const browser=await chromium.launch({headless:true});await fs.mkdir('artifacts/home',{recursive:true});
try {
 for(const width of [1280,390]) {
  const p=await browser.newPage({viewport:{width,height:900}});const errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await p.goto(base);await p.waitForSelector('.box-canvas[data-asset="treasury-desk"]');
  await p.screenshot({path:`artifacts/home/home-${width}.png`,fullPage:true});
  await p.locator('.home-setup-link').click();
  await p.locator('[data-preset="gbtt"]').click();
  await p.locator('[data-shock="energy"]').click();
  assert.match(await p.locator('.home-launch').innerText(),/GBTT plan · Energy squeeze/);
  for(const id of ['calm','energy','rates']) {
   const title=await p.locator(`[data-shock="${id}"] strong`).boundingBox();
   const detail=await p.locator(`[data-shock="${id}"] small`).boundingBox();
   assert.ok(detail.y >= title.y+title.height-1,'Scenario title and subtitle must not overlap');
  }
  await p.locator('.home-extra>summary').click();
  await p.selectOption('#migration','lower');
  assert.ok(await p.locator('.home-extra').evaluate(el=>el.open));
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.locator('.home-launch [data-action="start"]').click();
  assert.match(await p.locator('h1').innerText(),/Who gets the money/);
  await p.screenshot({path:`artifacts/home/game-${width}.png`,fullPage:true});
  assert.deepEqual(errors,[]);await p.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base);
 await reduced.waitForFunction(()=>document.querySelector('.desk-fallback')?.naturalWidth>0);
 assert.equal(await reduced.locator('.box-canvas').count(),0);
 await reduced.screenshot({path:'artifacts/home/reduced-motion.png',fullPage:true});await reduced.close();
 console.log('Homepage: 3D desk, fallback, setup choices, mobile text layout, optional controls and start flow passed.');
}finally{await browser.close()}
