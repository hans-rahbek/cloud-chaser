# Cloud Chaser

A desktop browser incremental game about fictional cloud chasing.

[Play Cloud Chaser](https://hans-rahbek.github.io/cloud-chaser/)

Hold the vape illustration or Space to puff. Hold Refill / R or Recharge / C to transfer finite session reserves. Time each draw around the optimal Celsius temperature window while managing wick saturation and lungs.

Use the Workbench between sessions to buy rigs, unlock component upgrades and set operating voltage. Every upgrade has + / − controls to buy or refund one level. Hardware belongs to its rig; shared upgrades travel across devices. Available Credits and total invested plus available Credits are shown separately.

Results includes Credits earned, puff statistics and historical graphs for production, consumption, energy and session performance. Saves remain local to the browser; Settings provides export/import and reduced motion. Existing saves migrate automatically. All equipment and statistics are fictional game mechanics.

## Run locally

```powershell
python -m http.server 4180 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4180/ . No installation or build step is required.

## Verify

```powershell
node test.cjs
```

The regression suite covers progression, migration, refunds, electrical and liquid accounting, Celsius heat, wick saturation, earnings, history and puff diagnostics.
