const Engine=require('./test-legacy-thermal.cjs');
module.exports={...Engine,fresh(){const s=Engine.fresh();s.owned.fusion={levels:{},wattage:10};return s;}};
