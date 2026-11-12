const Engine=require('./dist/engine');
// Historical subsystem fixtures retain the percentage production curve; Celsius is covered by celsius.test.cjs.
const legacy=s=>{s.temperatureScale='percent';s.heat=0;s.wick=1.2;s.stock=10.8;return s;};
module.exports={...Engine,fresh(){return legacy(Engine.fresh());},startRound(s){const ok=Engine.startRound(s);if(ok){s.temperatureScale='percent';s.heat=0;s.round.temperatureScale='percent';Engine.normalizeWick(s);}return ok;}};
