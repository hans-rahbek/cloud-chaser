(function(root){'use strict';
  const upgrades={
    wattage:{name:'Power electronics',icon:'ϟ',base:8,growth:1.65,description:'Raises voltage, current and power limits. Set voltage before the session.',names:['Variable wattage','High-output board','Industrial power bus','Plasma driver','Fusion regulator','Stellar ignition','Reality overclock']},
    airflow:{name:'Airflow',icon:'≋',base:12,growth:1.64,description:'Manage heat while drawing. Does not change resting cooldown.',names:['Adjustable air vents','Wide-bore intake','Turbine intake','Jet compressor','Captive tornado','Atmospheric siphon','Weather singularity']},
    coil:{name:'Coil assembly',icon:'⊚',base:18,growth:1.67,description:'More heating area. More cloud potential.',names:['Wire coil','Mesh coil','Dual mesh array','Industrial heating grid','Plasma lattice','Fusion coil','Spacetime filament']},
    wicking:{name:'Wicking',icon:'♧',base:10,growth:1.64,description:'Improves absorption and wick liquid capacity. Supports sustained puffs without a direct output multiplier.',names:['Cotton wick','Braided wick','Capillary matrix','Pressure-fed manifold','Liquid teleportation','Quantum capillaries','Infinite absorption']},
    cooling:{name:'Active Cooling',icon:'❋',base:15,growth:1.64,description:'Additional heat removal only while liquid or energy actually transfers.',names:['Transfer heat exchanger','Finned heatsink','Liquid cooling','Cryogenic jacket','Arctic portal','Entropy extractor','Absolute-zero loophole']},
    retention:{name:'Heat Retention',icon:'◉',base:15,growth:1.64,description:'Retains heat longer between puffs. Less warm-up, but slower passive recovery.'},
    battery:{name:'Battery capacity',icon:'▱',base:10,growth:1.62,description:'Longer draws between recharges. External pack sets reserve energy.',names:['Pocket battery','Extended cell','Battery bank','Workshop generator','Micro reactor','Pocket star','Borrowed sun']},
    tank:{name:'Tank capacity',icon:'♢',base:8,growth:1.62,description:'Less refilling. More ceiling removal.',names:['Small tank','Extended tank','Workshop reservoir','Water-tower tank','Dimensional storage','Ocean in a bottle','Liquid universe']},
    pack:{name:'External battery pack',icon:'ϟ',category:'supply',base:16,growth:1.65,description:'More session energy. Recharge the internal battery during play.'},
    supply:{name:'Liquid supply',icon:'♢',category:'supply',base:12,growth:1.64,description:'More reserve liquid per session. Refilling transfers it into the tank.'},
    draw:{name:'Draw strength',icon:'≋',category:'technique',base:14,growth:1.65,description:'Extract more vapor and remove more drawing heat, but fill lungs faster. Balance with lung capacity.'},
    lungs:{name:'Lung capacity',icon:'◡',category:'technique',base:16,growth:1.65,description:'Longer puffs. Match capacity to draw strength and the coil’s green window.'},
    recovery:{name:'Lung recovery',icon:'↻',category:'technique',base:14,growth:1.65,description:'Restore capacity units faster while resting or refilling.'},
    density:{name:'Cloud density',icon:'☁',category:'liquid',base:20,growth:1.68,description:'Denser clouds, but more liquid used per puff.',names:['Everyday mist','Velvet cloud','Cloud concentrate','Bottled cumulus','Storm syrup','Nebula nectar','Condensed atmosphere']},
    viscosity:{name:'Flow formulation',icon:'≋',category:'liquid',base:16,growth:1.64,description:'Improves liquid flow, multiplying your hardware wicking speed.',names:['Standard flow','Smooth flow','Capillary blend','Pressure-ready blend','Phase-flow liquid','Quantum fluid','Frictionless nonsense']},
    economy:{name:'Liquid efficiency',icon:'♢',category:'liquid',base:18,growth:1.66,description:'Less liquid consumed for the same cloud output.',names:['Basic blend','Refined blend','Precision blend','Low-waste formula','Molecular thrift','Closed-loop mist','Conservation loophole']},
    thermal:{name:'Thermal stability',icon:'❋',category:'liquid',base:22,growth:1.67,description:'Widens the optimal Celsius window, capped at 155–225°C. Does not reduce heating strength.',names:['Standard stability','Stable blend','Heat-balanced formula','Cryo-compatible blend','Polar essence','Entropy cordial','Thermodynamic exception']}
  };
  const upgradeGroups={
    mod:{name:'Battery / Mod',description:'Supplies electrical power. Electronics set the power limits; batteries store energy and transfer cooling helps during maintenance.',keys:['wattage','battery','pack','cooling']},
    tank:{name:'Tank',description:'Stores e-liquid in mL. Tank capacity reduces refill interruptions; the shared liquid supply extends the session.',keys:['tank','supply']},
    coil:{name:'Coil',description:'Produces vapor through heating. Coil assembly shapes resistance, surface area and thermal mass; retention preserves heat between draws.',keys:['coil','retention']},
    wick:{name:'Wick',description:'Delivers liquid to the coil. Improve wicking to support sustained output.',keys:['wicking']},
    mouthpiece:{name:'Mouthpiece',description:'The draw path. Airflow upgrades manage heat while puffing; draw strength remains a Technique upgrade.',keys:['airflow']},
    liquid:{name:'E-liquid',description:'Shared formulations affect every device.',keys:['density','viscosity','economy','thermal']},
    technique:{name:'Technique',description:'Shared draw strength, lung capacity and recovery apply to every device.',keys:['draw','lungs','recovery']},
  };
  const tricks=[]; // Retired; historical saves keep their records.
const devices=[
 {id:'pocket',name:'Mist & Co. Pocket One',tag:'POCKET SCIENCE',price:0,floor:1,cap:6,limits:{},area:1,air:1,wick:1,description:'Start with E-liquid and Technique. Fixed hardware teaches the puff rhythm.'},
 {id:'nimbus',name:'Nimbus Works Mk. II',tag:'CUSTOM BUILD',price:180,floor:3,cap:10,limits:{airflow:12,cooling:12},area:1.12,air:1.2,wick:1,description:'Unlocks Tank and Coil upgrades: larger tanks, liquid reserves, coil assemblies and heat retention.'},
 {id:'stratus',name:'Stratus Industrial 9000',tag:'INDUSTRIAL HAZE',price:2200,floor:6,cap:15,limits:{coil:17,wicking:17,tank:17},area:1.3,air:1.35,wick:1.3,description:'Unlocks Battery / Mod and Wick: voltage adjustment, power electronics, batteries, active cooling and wicking.'},
 {id:'fusion',name:'Cirrus Corp. Fusion Kettle',tag:'IMPOSSIBLE ENGINEERING',price:30000,floor:10,cap:20,limits:{wattage:22,cooling:22},area:1.55,air:1.7,wick:1.5,description:'Unlocks Mouthpiece airflow tuning. Power and cooling paths reach level 22.'},
 {id:'star',name:'Event Horizon World Eater',tag:'PLANETARY WEATHER',price:450000,floor:14,cap:25,limits:{},area:2,air:2.2,wick:2,description:'A pocket star with dimensional plumbing. Every hardware path reaches level 25.'}
 ];
 const api={upgradeGroups,upgrades,tricks,devices};root.CloudCatalog=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
