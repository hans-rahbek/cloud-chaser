# Cloud Chaser

[Play Cloud Chaser](https://hans-rahbek.github.io/cloud-chaser/)

# Cloud Chaser — Manual Edition

A buildless browser game. Open `dist/index.html`, or run `python -m http.server 4173 --directory dist` and visit http://localhost:4173. No dependencies. Google Fonts has system-font fallbacks.

## Controls and rounds

Results has one prominent Continue to Workbench action; the next-round button exists only in Workbench. The menu separates Play (device and live controls), Results (latest completed round, records and puff breakdown), and Workbench (upgrades and liquid supplies). Browsing Results or Workbench pauses the current round, including cooling, lung recovery and cloud dispersal. Purchases remain locked until the battery is depleted. Battery depletion opens Results automatically; starting the next round returns to Play.

One press is one puff. Hold Puff or Space to draw continuously; release to finish. Quick taps produce a small 0.08-second draw. Lung capacity cuts a draw off automatically, without starting another while the input remains held. Lungs recover at rest and while refilling. Mouse, touch, Space and Enter on the buttons are supported.

Hold Refill or R to open the tank (0.65 seconds), then transfer reserve stock gradually into the tank. Release for a partial refill. Puffing and refilling are mutually exclusive. Refill costs no battery, and heat falls while lungs recover. With enough stock, the tank fills in three seconds after opening, from empty to full. Filling stops automatically at a full tank or empty reserve.

## Liquid running costs

A standard 30-unit bottle costs 12 spendable vapor and can only be purchased between rounds. Tank capacity is storage, not liquid. Stock purchases are separate from formulation upgrades. Fresh games begin with 40 units in the tank and 30 in reserve. Existing pre-version-five saves keep their tank contents and receive 30 reserve units once.

Liquid in the tank and reserve carries over. New rounds recharge battery and recover lungs/heat, but only top up the existing tank by transferring reserve stock. Tank upgrades add empty space, never liquid. Consumption removes tank liquid; purchases, opening fills and mid-round refills do not duplicate or discard it. Net round payout is not charged for purchases a second time.

The shop displays tank contents, reserve, total available, a full-battery consumption estimate at the fixed upgraded draw strength, and supply warnings including the 10% tank dry-hit buffer. The estimate is liquid-rate / energy-rate × battery capacity, not a guaranteed outcome after setup changes or supply shortages.

Emergency supplies are available only in the workbench when cash is below the 12-vapor bottle price and total liquid is below the rig's recovery allowance. Claiming adds only the amount missing from that allowance, counting existing tank contents. The allowance is max(40 units, full-power battery consumption + 10% of tank capacity): 48 units for starter equipment at full draw intensity. This allows a viable recovery even with an oversized tank. Repeat claims cannot increase stock beyond the allowance. Claims are counted and saved; eligibility is reassessed after future rounds, so an unsuccessful round never permanently locks progress. A tested careful starter recovery round earns enough to buy a normal bottle.

## Heat control

The semicircular gauge shows amber warming (0–40%), green optimal (40–75%), amber pushing it (75–90%), and red burning (above 90%). Cold output starts at 25% density, smoothly improves to green, peaks at 115% around the middle of green, and falls smoothly to 35% near red. Above 90%, output is smoke. The gauge includes boundaries, a needle, a numeric reading, zone text and an accessible meter value. Reduced-motion preferences disable needle interpolation.

Draw Strength is a shared Technique upgrade beside Lung Capacity and Recovery. It starts at level 1 and increases draw strength by 5% per level. The active game has no intensity slider, drag gesture or arrow adjustment: hold Puff or Space, then release. Stronger technique increases vapor extraction and active cooling but fills lungs faster. Battery drain and heating strength remain determined by locked wattage. Wicking can limit high-intensity output and is identified in the controls when it does.

Lungs are measured in capacity units. Effective draw strength is `1 + 0.05 × (draw level − 1)`. The simulation derives its fixed flow factor as `0.75 × draw strength`; lung usage is `0.4 + 1.2 × flow factor` units/second, and vapor extraction is `0.55 + 0.55 × flow factor`. Starter lungs last approximately 2.31 seconds. Lung Capacity adds 0.45 capacity units per level; Recovery restores capacity between puffs. More lung capacity can overshoot the coil's green window unless the rest of the rig keeps up.

Wattage sets heating strength. Heating accelerates by 38% per draw second, capped after five seconds. Releasing resets acceleration but retains temperature. Hardware airflow and Draw Strength improve active cooling; Cooling upgrades affect rest/refill only. Thermal Stability reduces heating. The optimal zone remains 40–75%, with smoke above 90% or below 10% tank liquid.

The Workbench's One-Puff Fit benchmark simulates one full-lung draw from 40% heat, with a full battery and full tank at the selected wattage. It reports draw duration, seconds and percentage in green, and ending temperature. It uses the same boundary-aware simulation as real play and never mutates the actual state. Battery limits and dry hits still apply to the benchmark. A real puff starting colder, hotter or with fewer resources can differ. Tune wattage, airflow, draw strength and lungs together, then time release during play.

One battery is one round. Heat, liquid and energy change continuously during a draw. Above 90% heat or below 10% liquid, only the remaining portion makes smoke. Combined hot and dry conditions do not double the smoke penalty. The engine solves heating and boundary crossing times analytically, then integrates the smooth output curve with eight-point Gaussian quadrature inside each zone. No fixed simulation step is tied to display frame rate.

Battery depletion finishes the current puff and opens Results. The next round restores battery and lungs, sets heat to zero, and transfers available reserve liquid into the tank. Upgrades and liquid purchases are only available between rounds. No rebirth controls or rival systems are exposed.

## Competition Score and upgrade payouts

- **Competition Score:** cloud still hanging × largest completed clean puff × cleanliness. Cleanliness is total clean vapor / (total clean vapor + smoke), or zero when no output exists. All inputs use full precision; rounding happens only in the interface. This is a performance score, never spendable currency.
- **Net round vapor / upgrade payout:** max(0, round clean vapor − round smoke), credited exactly once at round end. Existing upgrade prices and prestige progression remain tied to net vapor.
- **Largest clean puff:** highest clean-vapor output from one completed draw, before deductions. This is the factor used in Competition Score.
- **Largest net puff:** highest max(0, puff clean vapor − puff smoke). This older category remains visible in secondary judging details.

For example, 100 clean vapor produced, 80 still hanging, 10 largest clean puff and 10 smoke yield approximately 727.3 competition points and a separate 90 mL payout. Zero-output and smoke-only rounds yield zero points; smoke-free output has 100% cleanliness.

The hanging cloud loses 2% of its current size per second through continuous exponential decay (half-life about 34.66 seconds). It gains clean vapor as it is produced, with each portion dispersing from its production time. Resting and refilling also disperse the cloud. The source and decay are integrated together using the existing eight-point quadrature and exact exponential decay, independently of frame rate. The visual cloud reflects the remaining hanging amount. The round's cloud freezes exactly when the battery empties, including depletion partway through a frame. Dispersal never changes total produced vapor, smoke, stored currency or net payout. It pauses with hidden gameplay; no offline decay exists.

Current draw output contributes to round totals and the hanging cloud immediately; largest clean puff updates only after a draw ends. The projected Competition Score is explicitly provisional. Every completed puff stores duration, clean vapor, smoke and net output. The interface shows the latest five during the round. Judging shows the formula, all factors, a separate payout strip, and new-record flags. Four current personal bests—dispersal-era competition, clean puff, net round vapor, net puff—persist. The pre-dispersal competition best is separately archived and labeled; it is never compared against the new competition record. Historical completed rounds retain their old formula and are labeled legacy.

## Upgrade levels

Fresh hardware starts at level 1. Device purchases provide their own starting hardware levels and ceilings. Each owned chassis retains its hardware upgrades and chosen wattage. Formulation and technique levels are shared, and their ceiling remains 25. Hardware costs follow their original exponential curve with an additional quadratic multiplier in the last three levels before the device ceiling. Existing above-ceiling hardware is grandfathered without a downgrade.

The device ladder is Pocket One (free, hardware 1–6), Nimbus (180 vapor, starts at 3, ceiling 10 with airflow/cooling to 12), Stratus (2,200, starts at 6, ceiling 15 with coil/wicking/tank to 17), Fusion Kettle (30,000, starts at 10, ceiling 20 with power/cooling to 22), and World Eater (450,000, starts at 14, ceiling 25). Successive chassis add different heating-area, active-cooling and wicking bonuses. The next device is revealed while its predecessor is owned. Purchases spend currency without resetting any global progress; owned devices can be equipped between rounds.

Device switching conserves liquid: a smaller tank sends overflow into reserve; a larger tank gains empty space only. Buying a device includes no liquid. Neither switching nor purchasing recharges an active battery; both actions are restricted to the Workbench between rounds.

Technique upgrades increase lung capacity (+0.45 capacity units per purchased level) or recovery speed. Capacity does not alter short-puff output. E-liquid density, flow, efficiency and thermal stability retain distinct effects. Lung capacity helps single-puff records; battery capacity improves whole-round potential. All equipment statistics are fictional game mechanics.

The seven hardware paths are Wattage range, Airflow, Coil, Wicking, Cooling, Battery capacity and Tank capacity. Wattage range upgrades raise capability without automatically changing the chosen operating setting. Set operating wattage in Workbench, between the chassis minimum and upgraded ceiling. Starting the next round locks it; Play shows a fixed readout beside the heat controls. Battery drain is `5 × (operating watts/10)` per firing second, independent of draw intensity. Workbench forecasts initial heat pressure, firing seconds per battery and liquid per battery at the fixed upgraded draw strength. Rest, refills and acceleration make actual elapsed round time differ.

## Saves and migration

Local saves keep the historical storage key, with a version-seven schema adding Draw Strength and optimal-time puff tracking to the owned-device collection, active chassis, per-device hardware and wattage, plus a locked round wattage to the existing stock, emergency claims, hanging cloud, scoring model and separate legacy records alongside one-based upgrades. Version-one and version-two saves migrate once by adding one to each retained level; later saves import without another shift. Pre-version-five saves receive the 30-unit reserve once, archive old competition records, and begin their new competition record as Unrecorded. An existing unfinished round's produced clean vapor initializes its hanging cloud at migration; dispersal starts then, without applying past offline decay. Reimporting version-five or version-six saves never grants reserve again. Version-six saves retain their full device collection and builds; their obsolete slider setting is discarded and Draw Strength starts at level 1 without a charge. Pre-version-six saves assign all existing hardware to Pocket One, preserving any above-ceiling levels, currency, supplies, technique, formulation and records. The active round adopts its existing wattage capability as locked power; interrupted output is finalized without resimulation.

An interrupted draw is finalized once from already-produced output, with no extra minimum-tap output. Saved first-draw output is included when validating complete puff history. Reloads resume resting. Page visibility loss, window blur, pointer cancellation and capture loss release active input. Gameplay pauses while hidden; neither production nor dispersal progresses offline. A fresh press is required on return.

Version-one saves preserve currency, equipment and round aggregates. Removed automatic puffer and feeder purchases receive their existing migration refund. Pre-version-four saves also refund purchased Power delivery and Power efficiency increments, summing ceil(16 × 1.65^i) and ceil(100 × 1.7^i) respectively over the purchased counts. The free level-1 baseline receives no refund. Refunds increase spendable vapor only, not lifetime production, prestige progress, pending round output or records. Exporting and reimporting version-four saves never adds the refund again.

Older saves with complete saved puff history derive the largest clean puff and Competition Score from that history. Where individual-puff history is absent or incomplete, new categories remain Unrecorded; existing net records and pending output are preserved. A full new round establishes the new category records. Settings provides save export/import and reduced motion.

## Files and verification

`dist/catalog.js` defines upgrade content. `dist/engine.js` owns state and simulation. `dist/app.js` handles input, saves and rendering. `dist/style.css` and `dist/index.html` define the interface.

Run `node test.cjs` for device ownership and purchases, separate builds, device switching conservation, cap behavior, wattage locking and forecasts, legacy hardware migration, liquid conservation and purchases, emergency recovery and eligibility, forecasts, continuous dispersal, frozen scores, stock/record migration, interrupted saves, input-independent simulation, hardware, lung usage and frame-rate consistency.
