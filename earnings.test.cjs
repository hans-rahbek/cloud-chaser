const assert=require('node:assert/strict'),G=require('./test-fixture.cjs'),E=G.E;
const near=(a,b,eps=1e-6)=>assert(Math.abs(a-b)<eps,`${a} != ${b}`);
const fixture=(extra={})=>({vapor:40,smoke:0,largestEligible:8,longestClean:2,liquidUsed:25,largestKnown:true,durationKnown:true,liquidKnown:true,...extra});
function puff(s,time,fps=0,reason='released'){assert(G.beginDraw(s));if(fps){let left=time;while(left>1e-10){const step=Math.min(left,1/fps);G.tick(s,step);left-=step;}}else G.tick(s,time);G.endDraw(s,reason,false);return s.lastPuff;}
// Fixed litre references: 40 game mL means 0.040 L and exactly 40 base Credits.
let r=fixture(),e=E.calculate(r);near(e.cleanLitres,.04);near(e.base,40);near(e.sizeBonus,1+.25*.008/(.008+.010));near(e.durationBonus,1+.25*2/5);near(e.efficiencyBonus,1+.25*(.04/25)/(.04/25+.002));near(e.credits,40*e.sizeBonus*e.durationBonus*e.efficiencyBonus);near(E.calculate(fixture({vapor:.04*1000})).credits,e.credits);
// Zero clean output is safe; no smoke always means a 1× penalty.
for(const smoke of [0,.1,100,1e12])assert.equal(E.calculate(fixture({vapor:0,smoke})).credits,0);assert.equal(e.smokePenalty,1);assert.equal(e.smokeReduction,0);
let previous=Infinity;for(const smoke of [0,.000001,.001,.1,1,10,40,100,1000]){const value=E.calculate(fixture({smoke}));assert(Number.isFinite(value.credits)&&value.credits>=0);assert(value.credits<=previous);near(value.credits,value.beforeSmoke/(1+2*smoke/40));previous=value.credits;}const tinySmoke=E.calculate(fixture({smoke:.000001}));assert(e.credits-tinySmoke.credits<.001);
// All secondary bonuses are bounded and have diminishing returns. Wasting liquid never helps.
for(const reference of [.01,3,.002]){let previousIncrement=Infinity;for(let i=0;i<100;i++){const a=E.bonus(i*reference,reference),b=E.bonus((i+1)*reference,reference);assert(a>=1&&b<=1.25);assert(b-a<=previousIncrement+1e-12);previousIncrement=b-a;}}
for(const used of [1,10,25,100])assert(E.calculate(fixture({liquidUsed:used})).credits<=E.calculate(fixture({liquidUsed:used/2})).credits);assert.equal(E.calculate(fixture({liquidUsed:0})).efficiencyBonus,1);assert(e.beforeSmoke<=e.base*1.25**3);
// Only completed puffs can affect size/duration. Duration needs 0.75s, 0.002 L and no smoke.
const clean={duration:1,vapor:3,smoke:0,hot:0,dry:0,reason:'released'};assert(E.qualifying(clean));for(const reason of ['lungs full','battery empty'])assert(E.qualifying({...clean,reason}));for(const change of [{duration:.74},{vapor:1.99},{smoke:.001},{hot:.1},{dry:.1},{reason:'interrupted'}])assert(!E.qualifying({...clean,...change}));
let s=G.fresh();s.heat=45;assert(G.beginDraw(s));G.tick(s,.75);assert.equal(s.round.largestEligible,0);assert.equal(s.round.longestClean,0);G.endDraw(s,'released',false);near(s.round.largestEligible,s.lastPuff.vapor);near(s.round.longestClean,.75);const prior=s.round.longestClean;G.tick(s,2);puff(s,.08);near(s.round.longestClean,prior);
const interrupted=G.fresh();interrupted.heat=45;G.beginDraw(interrupted);G.tick(interrupted,1);const resumed=G.load(JSON.stringify(interrupted));assert.equal(resumed.round.largestEligible,0);assert.equal(resumed.round.longestClean,0);near(resumed.round.vapor,interrupted.round.vapor);

console.log('Credits regression tests passed: units, bounded bonuses, penalties, qualification and interrupted draws.');
