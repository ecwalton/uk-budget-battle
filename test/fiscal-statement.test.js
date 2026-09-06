import test from 'node:test';
import assert from 'node:assert/strict';
import {fiscalStatement} from '../public/fiscal-statement.js';
test('all fiscal routes preserve the baseline and budget bridge',()=>{
 for (const spending of [0,1]) for(const tax of [0,1]) {
  const f=fiscalStatement([spending,tax,1,1]);
  assert.equal(f.borrowing,115.5-f.savings+f.taxRelief);
  assert.equal(f.interest,109.4);
  assert.ok(f.taxRelief<=f.savings);
 }
 assert.equal(fiscalStatement([1,1]).borrowing,115.5);
 assert.equal(fiscalStatement([0,0]).borrowing,95.5);
 assert.equal(fiscalStatement([0,1]).borrowing,65.5);
 assert.equal(fiscalStatement([1,0]).deferred,true);
 assert.equal(fiscalStatement([1,0]).taxRelief,0);
});
