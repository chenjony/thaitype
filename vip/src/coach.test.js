import assert from 'node:assert/strict'
import { diagnose, summarizeAttempts, mergeSkillModel, weakestCharacters, adaptiveText } from './coach.js'

assert.equal(diagnose('ฤ','ฟ'),'shift')
assert.equal(diagnose('่','้'),'tone')
const session=summarizeAttempts([{expected:'ก',actual:'ด',correct:false,latency:700},{expected:'ก',actual:'ก',correct:true,latency:300}])
const model=mergeSkillModel({},session)
assert.equal(model['ก'].errors,1)
assert.equal(weakestCharacters(model,1)[0].char,'ก')
assert.equal(adaptiveText(['ก'],5).split(' ').length,5)
console.log('coach checks passed')
