import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {PRESETS} from '../public/presets.js';
const base=process.env.BASE_URL||'http://localhost:8787';
const browser=await chromium.launch({headless:true});
try {
 for(const width of [1280,390]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const id of Object.keys(PRESETS)) {
   await page.goto(base+'/?preset='+id);
   assert.equal(await page.locator(`[data-preset="${id}"]`).getAttribute('aria-pressed'),'true');
   await page.click('[data-shock="energy"]');
   await page.click('#start-btn');
   for(let y=0;y<5;y++) {
    for(const setting of PRESETS[id].years[y].slice(0,5)) {
     const [control,level]=setting.split(':');
     assert.equal(await page.locator(`[data-control="${control}"][data-level="${level}"]`).getAttribute('aria-pressed'),'true');
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.click('[data-action="funding"]');
    for(const setting of PRESETS[id].years[y].slice(5)) {
     const [control,level]=setting.split(':');
     assert.equal(await page.locator(`[data-control="${control}"][data-level="${level}"]`).getAttribute('aria-pressed'),'true');
    }
    assert.equal(await page.locator('[data-action="review"]').isDisabled(),false);
    await page.click('[data-action="review"]');await page.click('[data-action="commit"]');await page.click('[data-action="continue"]');
   }
   assert.ok(await page.locator('.results').isVisible());
   assert.equal(JSON.parse(await page.evaluate(()=>window.render_game_to_text())).decisions.length,5);
  }
  await page.goto(base+'/programme.html');assert.ok(await page.locator('a[href="/?preset=gbtt"]').isVisible());
  await page.goto(base+'/explorer.html');assert.ok(await page.locator('#start-btn').isVisible());
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('Three presets passed five-year UI checks on desktop/mobile; both product routes and legacy route work.');
}finally{await browser.close()}
