import test from 'node:test';
import assert from 'node:assert/strict';
import {PRESETS,presetYear} from '../public/presets.js';
import {simulate,validateGame} from '../public/engine.js';
test('presets use all nine levers and the unchanged engine under all conditions',()=>{
 for(const [id,p] of Object.entries(PRESETS)) for(const shock of ['calm','energy','rates']) for(const sensitivity of ['central','cautious']) {
  assert.equal(p.years.length,5);
  for(const row of p.years) assert.equal(row.length,9);
  validateGame({decisions:p.years,shock,sensitivity});
  const r=simulate({decisions:p.years,shock,sensitivity});
  assert.equal(r.fundingPass,true);
  assert.equal(r.passed,id==='revenue'||(id==='investment'&&shock!=='energy'));
 }
 const gbtt=simulate({decisions:PRESETS.gbtt.years,shock:'calm',sensitivity:'central'});
 assert.equal(gbtt.annualImprovement,22);
 assert.equal(gbtt.termImprovement,150);
 assert.equal(gbtt.legacyPass,false);
 const draft=presetYear('gbtt',0);draft[0]='health:1';
 assert.equal(presetYear('gbtt',0)[0],'health:0');
});
