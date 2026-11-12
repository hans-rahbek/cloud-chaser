const assert=require('node:assert/strict'),Engine=require('../../dist/engine.js');
// Historical Cloudograph regression suite; Credits are tested in earnings.test.cjs.
const G={...Engine,fresh(){const s=Engine.fresh();s.round.scoreModel='cloudograph';return s;},startRound(s){const ok=Engine.startRound(s);if(ok)s.round.scoreModel='cloudograph';return ok;}},C=G.C;
const near=(a,b,eps=1e-6)=>assert(Math.abs(a-b)<eps,`${a} != ${b}`);
function puff(s,time,fps=0,reason='released'){assert(G.beginDraw(s));if(fps){let remaining=time;while(remaining>1e-10){const step=Math.min(remaining,1/fps);G.tick(s,step);remaining-=step;}}else G.tick(s,time);G.endDraw(s,reason,false);return s.lastPuff;}
function ready(challenge='perfect',watts=5){const s=G.fresh();s.phase='workshop';assert(G.setChallenge(s,challenge));assert(G.setWattage(s,watts));assert(G.startRound(s));return s;}
// Challenge selection locks with the battery; setup and ordinary production remain unchanged.
let s=ready('precision');assert.equal(s.round.challenge,'precision');assert(!G.setChallenge(s,'marathon'));s.phase='workshop';assert(!G.setChallenge(s,'unknown'));assert(G.setChallenge(s,'marathon'));
// Fixed sampling and exact green integrals agree at 1, 30 and 144 FPS, including smoke crossings.
for(const [heat,liquid,time]of [[0,40,2.2],[55,40,2],[86,5,2],[95,0,1]]){
 const runs=[];for(const fps of [0,1,30,144]){const x=ready('perfect',10);x.heat=heat;x.liquid=liquid;const p=puff(x,time,fps);assert(p.trace.length<=C.MAX_SAMPLES);near(p.trace.at(-1)[0],p.duration);near(p.trace.at(-1)[1],p.vapor);near(p.trace.at(-1)[2],p.smoke);assert(p.greenVapor<=p.vapor+1e-8);runs.push(x);}
 for(const x of runs.slice(1)){const p=x.lastPuff,a=runs[0].lastPuff;near(p.vapor,a.vapor);near(p.smoke,a.smoke);near(p.greenVapor,a.greenVapor);near(p.greenSquare,a.greenSquare);near(C.metrics(p).peak,C.metrics(a).peak);near(G.judging(x.round).competition,G.judging(runs[0].round).competition,1e-5);assert.equal(p.trace.length,a.trace.length);p.trace.forEach((row,i)=>row.forEach((v,j)=>near(v,a.trace[i][j])));}
}
// Peak is a half-second volume average, never an instantaneous spike; short taps have none.
const constant=[[0,0,0,50,4,0,0],[.1,.4,0,50,4,0,0],[.5,2,0,50,4,0,0],[1,4,0,50,4,0,0]];near(C.peak(constant,1),4);
near(C.peak([[0,0,0,50,10,0,0],[.1,1,0,50,0,0,0],[.5,1,0,50,0,0,0],[1,1,0,50,0,0,0]],1),2);
s=ready();s.heat=45;const tap=puff(s,.08);assert.equal(C.metrics(tap).peak,null);assert(!C.metrics(tap).precision);assert(!C.metrics(tap).cleanFinish);assert.equal(C.metrics(tap).stability,null);
const weak={...tap,duration:1,optimal:1,greenVapor:.1,greenSquare:.01,vapor:.1};assert.equal(C.metrics(weak).stability,null);assert(!C.metrics(weak).precision);
// Deliberate release alone can earn a clean finish. Every qualifying precision puff is substantial.
s=ready();s.heat=45;const good=puff(s,1.5);const m=C.metrics(good);assert(m.precision);assert(m.cleanFinish);assert(m.stability>90);for(const reason of ['lungs full','battery empty','interrupted'])assert(!C.metrics({...good,reason}).cleanFinish);
assert(!C.metrics({...good,optimal:good.duration-.01}).precision);assert(!C.metrics({...good,smoke:.01}).precision);assert(!C.metrics({...good,duration:.5}).precision);
// Three controllable warm-start draws complete Precision. Bonus is booked once, separately.
s=ready('precision');s.energy=11.25;s.heat=45;for(let i=0;i<3;i++){if(i){G.tick(s,Math.max(0,(s.heat-45)/G.stats(s).cooling));}puff(s,1.5);}
assert.equal(s.phase,'workshop');assert.equal(s.lastRound.precision,3);assert(s.lastRound.success);near(s.lastRound.challengeReward,s.lastRound.score*.1);near(s.vapor,s.lastRound.score+s.lastRound.challengeReward);near(s.total,s.lastRound.score);near(s.run,s.lastRound.score);assert(s.lastRound.newCloudRecord);assert.equal(s.records.competition,null);assert(s.cloudRecords.precision>0);
const bank=s.vapor,restored=G.load(JSON.stringify(s));near(restored.vapor,bank);near(restored.lastRound.challengeReward,s.lastRound.challengeReward);G.tick(restored,100);near(restored.vapor,bank);assert.equal(restored.lastRound.results.length,3);
// Failed challenges cannot reduce ordinary net payout or existing money.
const failed=ready('perfect');failed.vapor=15;failed.energy=2;puff(failed,1);assert(!failed.lastRound.success);assert.equal(failed.lastRound.challengeReward,0);near(failed.vapor,15+failed.lastRound.score);
const smoky=ready('precision');smoky.vapor=12;smoky.liquid=0;smoky.energy=1;puff(smoky,1);assert.equal(smoky.lastRound.score,0);assert.equal(smoky.lastRound.challengeReward,0);near(smoky.vapor,12);
// Weights are explicit and additive, rewards capped, cloud dispersal excluded from modern judging.
for(const challenge of Object.keys(C.challenges)){const r={scoreModel:'cloudograph',challenge,vapor:10000,smoke:0,largestClean:100,analysis:{...C.aggregate(),green:500,precision:3,substantial:500,finishVolume:100}};const j=C.judge(r);near(j.competition,j.contributions.reduce((n,v)=>n+v,0));near(j.weights.reduce((n,v)=>n+v,0),1);assert.equal(j.reward,12);near(C.judge({...r,hanging:0}).competition,C.judge({...r,hanging:1000}).competition);}
// Smoke attribution records both causes where they overlap; smoke is only charged once.
s=ready('perfect',10);s.heat=95;s.liquid=0;const both=puff(s,.5);assert(both.trace.slice(1).every(row=>row[6]===3));near(both.smoke,G.stats(s).potentialRate*.5);assert(both.hot>0&&both.dry>0);assert(C.feedback(both).includes('dry-hit'));assert(C.feedback(both).includes('active airflow'));
// Interrupted reload preserves recorded output/trace, adds no tap and resumes resting.
s=ready();s.heat=45;G.beginDraw(s);G.tick(s,.233);const partial=G.load(JSON.stringify(s));near(partial.lastPuff.duration,.233);near(partial.lastPuff.vapor,s.round.vapor);assert.equal(partial.lastPuff.reason,'interrupted');assert(!C.metrics(partial.lastPuff).cleanFinish);assert.equal(partial.lastPuff.trace[0][0],0);near(partial.lastPuff.trace.at(-1)[0],.233);assert.equal(G.load(JSON.stringify(partial)).round.puffs,1);
// Migration preserves historical models and records without inventing a trace or awarding bonuses.
const old=G.load({version:7,phase:'workshop',vapor:73,total:123,stock:42,liquid:17,levels:{lungs:6,density:4},records:{competition:999,legacyCompetition:1234,total:70,largest:12,cleanPuff:14},lastRound:{number:3,vapor:5,smoke:1,hanging:4,puffs:1,score:4,results:[{duration:2,vapor:5,smoke:1,optimal:1}]}});assert.equal(old.version,10);near(old.vapor,73);near(old.stock,42);near(old.records.competition,999);assert.equal(old.lastRound.scoreModel,'dispersal');assert.equal(C.metrics(old.lastRound.results[0]),null);assert.equal(old.lastRound.results[0].trace,undefined);assert.equal(old.levels.lungs,6);assert(G.startRound(old));assert.equal(old.round.scoreModel,'cloudograph');old.energy=1;puff(old,1);near(old.records.competition,999);
// Detail retention is bounded, summaries remain selectable, reference survives pruning and reload.
s=ready();s.levels.battery=25;s.energy=G.stats(s).capacity;s.heat=45;const pinned=puff(s,1);assert(G.pinReference(s,pinned));for(let i=0;i<600;i++){G.tick(s,1);puff(s,.08);}
assert.equal(s.round.puffs,601);assert.equal(s.round.results.length,C.MAX_RESULTS);assert.equal(s.round.results.filter(p=>p.trace).length,C.MAX_DETAILS);assert.equal(s.round.archived,601-C.MAX_RESULTS);assert.equal(s.round.analysis.measured,601);assert(s.reference.trace.length>0);assert(JSON.stringify(s).length<1500000);const loaded=G.load(JSON.stringify(s));assert(loaded.reference.trace.length>0);assert.equal(loaded.round.analysis.measured,601);near(G.judging(loaded.round).competition,G.judging(s.round).competition);assert(loaded.round.cleanHistoryComplete);
// Benchmark and reference operations never mutate production or currency.
const snapshot=JSON.stringify(loaded);G.puffPlan(loaded);assert.equal(JSON.stringify(loaded),snapshot);assert(!G.pinReference(loaded,{duration:1,vapor:2}));
const batteryBenchmark=G.fresh();batteryBenchmark.levels.wattage=25;batteryBenchmark.roundWattage=G.powerRange(batteryBenchmark).max;const batterySnapshot=JSON.stringify(batteryBenchmark);G.puffPlan(batteryBenchmark);assert.equal(JSON.stringify(batteryBenchmark),batterySnapshot);
console.log('Cloudograph tests passed: frame-independent traces/judging, rolling peak, meaningful stability, precision qualification, rewards, smoke causes, migration, interrupts, bounded saves and pinned references.');
