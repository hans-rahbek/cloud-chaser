(function(root){
 'use strict';
 const STEP=.1,WINDOW=.5,MAX_SAMPLES=160,MAX_DETAILS=64,MAX_RESULTS=512;
 const challenges={
  perfect:{name:'One Perfect Cloud',weights:[.65,.25,.10],goal:'Complete a clean puff of at least 8 mL, with round cleanliness ≥ 80%.',description:'Build for one large, clean draw.'},
  marathon:{name:'Cloud Marathon',weights:[.65,.20,.15],goal:'Produce 30 mL clean vapor with round cleanliness ≥ 85%.',description:'Build for sustained production across the battery.'},
  precision:{name:'Precision Round',weights:[.10,.45,.45],goal:'Complete 3 smoke-free puffs entirely in green. Each needs ≥ 0.75s and ≥ 2 mL clean vapor.',description:'Fit substantial puffs inside the 40–75% window.'}
 };
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 function aggregate(){return {green:0,stabilitySum:0,stabilityWeight:0,substantial:0,finishVolume:0,precision:0,measured:0};}
 function cumulative(trace,time,column){if(!trace?.length)return 0;let before=trace[0];for(const row of trace.slice(1)){if(row[0]>=time){const f=clamp((time-before[0])/(row[0]-before[0]||1));return before[column]+f*(row[column]-before[column]);}before=row;}return before[column];}
 function peak(trace,duration){if(!trace?.length||duration<WINDOW-1e-8)return null;duration=Math.min(duration,trace.at(-1)[0],STEP*MAX_SAMPLES);let best=0;const times=[];for(let i=5;i*STEP<=duration+1e-8;i++)times.push(Math.min(duration,i*STEP));times.push(duration);for(const t of times)best=Math.max(best,(cumulative(trace,t,1)-cumulative(trace,t-WINDOW,1))/WINDOW);return best;}
 function metrics(p){if(!p||p.measurementVersion!==1)return null;const substantial=p.duration>=.75-1e-8&&p.vapor>=2-1e-8;
  const mean=p.optimal>0?p.greenVapor/p.optimal:0,variance=p.optimal>0?Math.max(0,p.greenSquare/p.optimal-mean*mean):0;
  const stability=p.optimal>=.5-1e-8&&p.greenVapor>=2-1e-8&&mean>0?100*clamp(1-Math.sqrt(variance)/mean):null;
  const tail=p.trace?.length?p.smoke-cumulative(p.trace,Math.max(0,p.duration-WINDOW),2):p.tailSmoke;
  const cleanFinish=substantial&&p.reason==='released'&&p.endHeat>=(p.optimalLow??40)-1e-8&&p.endHeat<=(p.optimalHigh??75)+1e-8&&tail<=1e-8;
  return {substantial,peak:p.peakFlow??peak(p.trace,p.duration),stability,cleanFinish,precision:substantial&&p.smoke<=1e-8&&p.optimal>=p.duration-1e-6,smokeBurden:p.vapor+p.smoke>0?p.smoke/(p.vapor+p.smoke):0,tailSmoke:tail||0};
 }
 function add(round,p){const m=metrics(p);if(!m)return;const a=round.analysis||(round.analysis=aggregate());a.green+=p.greenVapor;a.measured++;if(m.substantial)a.substantial+=p.vapor;if(m.cleanFinish)a.finishVolume+=p.vapor;if(m.precision)a.precision++;if(m.stability!==null){a.stabilitySum+=m.stability*p.greenVapor;a.stabilityWeight+=p.greenVapor;}}
 function judge(round){const c=challenges[round.challenge]||challenges.perfect,a=round.analysis||aggregate(),v=round.vapor||0,smoke=round.smoke||0,cleanliness=v+smoke>0?v/(v+smoke):0;
  const volume=100*Math.log2(1+(round.challenge==='marathon'?v/25:(round.largestClean||0)/5));
  const stability=a.stabilityWeight>0?a.stabilitySum/a.stabilityWeight:0;
  const delivery=80*Math.log2(1+a.green/10)+20*stability/100;
  const control=(70*cleanliness+30*(v>0?a.finishVolume/v:0))*Math.min(1,a.substantial/6);
  const values=[volume,delivery,control],contributions=values.map((x,i)=>x*c.weights[i]);
  const success=round.challenge==='precision'?a.precision>=3:round.challenge==='marathon'?v>=30&&cleanliness>=.85:(round.largestClean||0)>=8&&cleanliness>=.8;
  const reward=success?Math.min(12,Math.max(0,v-smoke)*.1):0;
  return {cleanliness,competition:contributions.reduce((n,x)=>n+x,0),values,weights:c.weights,contributions,success,reward,precision:a.precision,stability};
 }
 function prune(round){if(round.results.length>MAX_RESULTS){round.results.splice(0,round.results.length-MAX_RESULTS);round.archived=round.puffs-round.results.length;}for(const p of round.results.slice(0,-MAX_DETAILS)){delete p.trace;p.traceArchived=true;}}
 function feedback(p){const m=metrics(p);if(!m)return 'This historical puff has summary values only. No missing trace or measurements have been reconstructed.';const notes=[];
  if(p.dry>1e-7)notes.push(p.wickMeasured?'The wick fell below 10% saturation. Release, let it absorb, and refill if the tank is empty.':'Historical tank-based dry hit; wick saturation was not recorded.');
  if(p.hot>1e-7)notes.push(p.temperatureScale==='C'?'The coil exceeded 260°C. Release earlier, lower voltage or improve drawing airflow. Thermal Stability widens green but does not move the smoke threshold.':'Historical coil temperature exceeded 90%. These readings use the original percentage model.');
  if(p.wickMeasured?p.wickLimited>1e-7:p.wickFactor<.99)notes.push('Wicking limited this draw. Improve Wicking or Flow formulation before adding more power.');
  if(p.startHeat<(p.optimalLow??40)&&p.optimal<p.duration*.5)notes.push('Much of the draw was below the optimal temperature. Start the next puff warmer, wait less, or raise pre-round wattage carefully.');
  if(p.reason==='lungs full')notes.push(p.endHeat<=(p.optimalHigh??75)?'Lungs ended the draw before you released. More lung capacity can extend it; recheck the heat fit.':'Your lungs outlasted the productive window. Release earlier or rebalance wattage and active airflow.');
  if(p.reason==='battery empty')notes.push('The battery ended this puff. Recharge from the external pack if energy remains. Internal battery capacity reduces charging interruptions; qualifying duration still requires meaningful smoke-free production.');
  if(m.cleanFinish)notes.push('A substantial puff ended on your release inside green, without smoke in the final half-second.');
  if(!notes.length)notes.push(p.endHeat>(p.optimalHigh??75)?'The finish left green. Release earlier or improve active airflow.':'A clean draw. Compare its green plateau with a reference puff before changing your setup.');return notes.join(' ');
 }
 const api={STEP,WINDOW,MAX_SAMPLES,MAX_DETAILS,MAX_RESULTS,challenges,aggregate,cumulative,peak,metrics,add,judge,prune,feedback};root.Cloudograph=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
