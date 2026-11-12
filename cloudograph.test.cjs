const assert=require('node:assert/strict'),G=require('./test-fixture.cjs'),C=G.C;
const near=(a,b)=>assert(Math.abs(a-b)<1e-7);
const trace=[[0,0,0,50,4,0,0],[.1,.4,0,50,4,0,0],[.5,2,0,50,4,0,0],[1,4,0,50,4,0,0]];near(C.peak(trace,1),4);
const s=G.fresh();s.heat=45;G.beginDraw(s);G.tick(s,1);G.endDraw(s,'released',false);const p=s.lastPuff;assert(p.trace.length<=C.MAX_SAMPLES);near(p.trace.at(-1)[0],p.duration);near(p.trace.at(-1)[1],p.vapor);assert(C.metrics(p));assert(G.pinReference(s,p));const loaded=G.load(JSON.stringify(s));near(loaded.reference.vapor,p.vapor);near(loaded.lastPuff.vapor,p.vapor);assert.equal(s.round.scoreModel,'credits');console.log('Cloudograph diagnostics passed: rolling peak, measured traces, save compatibility and pinned references.');
