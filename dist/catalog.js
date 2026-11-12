(function(root){'use strict';
  const upgrades={
    wattage:{name:'Wattage range',icon:'ϟ',base:8,growth:1.65,description:'Raises your wattage ceiling. Choose operating power before the round.',names:['Variable wattage','High-output board','Industrial power bus','Plasma driver','Fusion regulator','Stellar ignition','Reality overclock']},
    airflow:{name:'Airflow',icon:'≋',base:12,growth:1.64,description:'Manage heat while drawing. Does not change resting cooldown.',names:['Adjustable air vents','Wide-bore intake','Turbine intake','Jet compressor','Captive tornado','Atmospheric siphon','Weather singularity']},
    coil:{name:'Coil assembly',icon:'⊚',base:18,growth:1.67,description:'More heating area. More cloud potential.',names:['Wire coil','Mesh coil','Dual mesh array','Industrial heating grid','Plasma lattice','Fusion coil','Spacetime filament']},
    wicking:{name:'Wicking',icon:'♧',base:10,growth:1.64,description:'Support higher draw output with better liquid delivery.',names:['Cotton wick','Braided wick','Capillary matrix','Pressure-fed manifold','Liquid teleportation','Quantum capillaries','Infinite absorption']},
    cooling:{name:'Cooling',icon:'❋',base:15,growth:1.64,description:'Recover heat faster while resting or refilling. Airflow handles draws.',names:['Passive heatsink','Finned heatsink','Liquid cooling','Cryogenic jacket','Arctic portal','Entropy extractor','Absolute-zero loophole']},
    battery:{name:'Battery capacity',icon:'▱',base:10,growth:1.62,description:'A longer shift between charges.',names:['Pocket battery','Extended cell','Battery bank','Workshop generator','Micro reactor','Pocket star','Borrowed sun']},
    tank:{name:'Tank capacity',icon:'♢',base:8,growth:1.62,description:'Less refilling. More ceiling removal.',names:['Small tank','Extended tank','Workshop reservoir','Water-tower tank','Dimensional storage','Ocean in a bottle','Liquid universe']},
    lungs:{name:'Lung capacity',icon:'◡',category:'technique',base:16,growth:1.65,description:'More capacity units. Gentle draws stretch them further.'},
    recovery:{name:'Lung recovery',icon:'↻',category:'technique',base:14,growth:1.65,description:'Restore capacity units faster while resting or refilling.'},
    density:{name:'Cloud density',icon:'☁',category:'liquid',base:20,growth:1.68,description:'Denser clouds, but more liquid used per puff.',names:['Everyday mist','Velvet cloud','Cloud concentrate','Bottled cumulus','Storm syrup','Nebula nectar','Condensed atmosphere']},
    viscosity:{name:'Flow formulation',icon:'≋',category:'liquid',base:16,growth:1.64,description:'Improves liquid flow, multiplying your hardware wicking speed.',names:['Standard flow','Smooth flow','Capillary blend','Pressure-ready blend','Phase-flow liquid','Quantum fluid','Frictionless nonsense']},
    economy:{name:'Liquid efficiency',icon:'♢',category:'liquid',base:18,growth:1.66,description:'Less liquid consumed for the same cloud output.',names:['Basic blend','Refined blend','Precision blend','Low-waste formula','Molecular thrift','Closed-loop mist','Conservation loophole']},
    thermal:{name:'Thermal stability',icon:'❋',category:'liquid',base:22,growth:1.67,description:'Reduces heat generated while drawing. Cooling still matters.',names:['Standard stability','Stable blend','Heat-balanced formula','Cryo-compatible blend','Polar essence','Entropy cordial','Thermodynamic exception']}
  };
  const tricks=[{name:'First wisp',at:10,bonus:.1,icon:'∿',description:'A cloud with aspirations.'},{name:'Perfect O',at:150,bonus:.2,icon:'◎',description:'Round. Suspiciously round.'},{name:'Table tornado',at:2000,bonus:.35,icon:'≋',description:'The furniture has filed a complaint.'},{name:'Personal weather system',at:25000,bonus:.6,icon:'☁',description:'Forecast: extremely you.'}];
const devices=[
 {id:'pocket',name:'Mist & Co. Pocket One',tag:'POCKET SCIENCE',price:0,floor:1,cap:6,limits:{},area:1,air:1,wick:1,description:'Your first little weather problem. Seven hardware paths, each capped at level 6.'},
 {id:'nimbus',name:'Nimbus Works Mk. II',tag:'CUSTOM BUILD',price:180,floor:3,cap:10,limits:{airflow:12,cooling:12},area:1.12,air:1.2,wick:1,description:'A balanced workshop rig. Extended airflow and cooling paths reach level 12.'},
 {id:'stratus',name:'Stratus Industrial 9000',tag:'INDUSTRIAL HAZE',price:2200,floor:6,cap:15,limits:{coil:17,wicking:17,tank:17},area:1.3,air:1.35,wick:1.3,description:'Factory-sized heating surfaces. Coil, wicking and tank paths reach level 17.'},
 {id:'fusion',name:'Cirrus Corp. Fusion Kettle',tag:'IMPOSSIBLE ENGINEERING',price:30000,floor:10,cap:20,limits:{wattage:22,cooling:22},area:1.55,air:1.7,wick:1.5,description:'A fusion-powered domestic incident. Power and cooling paths reach level 22.'},
 {id:'star',name:'Event Horizon World Eater',tag:'PLANETARY WEATHER',price:450000,floor:14,cap:25,limits:{},area:2,air:2.2,wick:2,description:'A pocket star with dimensional plumbing. Every hardware path reaches level 25.'}
 ];
 const api={upgrades,tricks,devices};root.CloudCatalog=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
