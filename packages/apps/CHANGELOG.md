# @galacticcouncil/apps

## 10.0.3

### Patch Changes

- Fix native wallet support validation

## 10.0.2

### Patch Changes

- Revert 10.0.1

## 10.0.1

### Patch Changes

- Fix identicon

## 10.0.0

### Major Changes

- Solana support
- Update wallet list

### Patch Changes

- d10c86d: Do not reset input when you remove last non 0 number

## 9.2.1

### Patch Changes

- Export external assetdata builders

## 9.2.0

### Minor Changes

- Bump cfg to 6.0.0 (xcm locations)

## 9.1.0

### Minor Changes

- Updated wallet list
- Step down DCA frequency unit when interval multiplier is lowered

Fixes:

- Fix lifecycle issues in DCA Yield
- Fix bonds chart

## 9.0.2

### Patch Changes

- Include transfer tags in gc:xcm:new event

## 9.0.1

### Patch Changes

- Fix swap chain fee info (bridgehub)

## 9.0.0

### Major Changes

- Support sdk 5.x, xcm tags

## 8.3.0

### Minor Changes

- Downgrade to pjs 14.0.x, fix clients

## 8.2.2

### Patch Changes

- Fix indexer url

## 8.2.1

### Patch Changes

- Fix empty acc sync

## 8.2.0

### Minor Changes

- Upgrade to pjs 14.x

## 8.1.1

### Patch Changes

- Fix PoolApp account subs

## 8.1.0

### Minor Changes

- Support currencies api

## 8.0.4

### Patch Changes

- fix xcm dest amount calc

## 8.0.3

### Patch Changes

- Fix hydradx references

## 8.0.2

### Patch Changes

- fix dest chain balance sync

## 8.0.1

### Patch Changes

- Fix sync chains dest chain

## 8.0.0

### Major Changes

- Bump to NEXT xcm

### Patch Changes

- 8f91157: Updated XCM form layout

## 7.0.2

### Patch Changes

- Fix balance load if dest addr missing/invalid

## 7.0.1

### Patch Changes

- Reset xchain search on click

## 7.0.0

### Major Changes

- Support xcm fee swaps, bump to next xcm-sdk

## 6.6.0

### Minor Changes

- f15ccfd: Added range slider component for DCA

## 6.5.1

### Patch Changes

- Fix outliers

## 6.5.0

### Minor Changes

- 57cee8d: Added external asset check to XCM

## 6.4.2

### Patch Changes

- fix max button perf, dca & twap min trade no default to 3

## 6.4.1

### Patch Changes

- Fix usd/native price calc, price api

## 6.4.0

### Minor Changes

- 4f7ebce: Show asset names in XCM selector

## 6.3.1

### Patch Changes

- Fix buffer, external exports

## 6.3.0

### Minor Changes

- Support chain icons & badges in XCM App

## 6.2.0

### Minor Changes

- Support Virtual XAsset selector

## 6.1.2

### Patch Changes

- Fix fee payment asset in xcm

## 6.1.1

### Patch Changes

- Fix virtualizer deps

## 6.1.0

### Minor Changes

- Virtual scroll, sdk perf fixes

## 6.0.0

### Major Changes

- Support metadata v2

### Patch Changes

- Updated dependencies
  - @galacticcouncil/ui@5.0.0

## 5.1.11

### Patch Changes

- Fix fee payment asset XCM calc

## 5.1.10

### Patch Changes

- Bump deps, sync transfer on address change

## 5.1.9

### Patch Changes

- Fix chart height

## 5.1.8

### Patch Changes

- Remove ledger warning

## 5.1.7

### Patch Changes

- Remove ledger warning, bump deps

## 5.1.6

### Patch Changes

- Fix DCA min no of execution to 3

## 5.1.5

### Patch Changes

- Fix Yield DCA messaging, block period est rounding

## 5.1.4

### Patch Changes

- Fix wallet support check

## 5.1.3

### Patch Changes

- Fix xcm native comp check

## 5.1.2

### Patch Changes

- Mythos bump, fix evm resolution (temp)

## 5.1.1

### Patch Changes

- Fix blacklist xcm issue

## 5.1.0

### Minor Changes

- Asset info windget

## 5.0.0

### Major Changes

- Upgrade to pjs 12.x

## 4.4.0

### Minor Changes

- Export external utils, when directive for tabs

## 4.3.1

### Patch Changes

- Fix externals undefined for bsx platform

## 4.3.0

### Minor Changes

- Upgrade to pjs 11.2.1

## 4.2.0

### Minor Changes

- Dynamic xcm config support

## 4.1.1

### Patch Changes

- Fix: skip external sync if chain not initialized

## 4.1.0

### Minor Changes

- Context provider & broadcast apps support

## 4.0.0

### Major Changes

- Use lightning css processor, css module, externalize assets

### Patch Changes

- Updated dependencies
  - @galacticcouncil/ui@4.0.0

## 3.9.1

### Patch Changes

- Fix chart fonts

## 3.9.0

### Minor Changes

- Hydration revamp

## 3.8.2

### Patch Changes

- BaseApp testnet flag support, testnet external assets support

## 3.8.1

### Patch Changes

- Fix eth gas estimation

## 3.8.0

### Minor Changes

- Upgrade sdk to v3, EVM Fee fix

## 3.7.4

### Patch Changes

- Relayer min fix

## 3.7.3

### Patch Changes

- Approval flow nonce support

## 3.7.2

### Patch Changes

- Store preimage

## 3.7.1

### Patch Changes

- XCM: sync only tx for same context

## 3.7.0

### Minor Changes

- Mrl flow enabled

## 3.6.0

### Minor Changes

- Upgrade to MRL

## 3.5.4

### Patch Changes

- WUD asset support

## 3.5.3

### Patch Changes

- STINK whitelist, custom empty token search notif

## 3.5.2

### Patch Changes

- Asset icon badge support

## 3.5.1

### Patch Changes

- Fix chart glitches
- Asset selector external button
- Asset selector search reset

## 3.5.0

### Minor Changes

- Support external sync, DatabaseProvider wrapper cmp

## 3.4.11

### Patch Changes

- chart extending token metadata with custom assets

## 3.4.10

### Patch Changes

- Assethub dest fee ED validator
- Fix FF glitches

## 3.4.9

### Patch Changes

- Sync external tokens on change
- Disable DCA terminate until next execution block loaded

## 3.4.8

### Patch Changes

- Revert "Improve fee payment calculations"

## 3.4.7

### Patch Changes

- Fix spot price calc / volumes

## 3.4.6

### Patch Changes

- filtering out low volume buckets from chart

## 3.4.5

### Patch Changes

- Fix trade spotPrice display

## 3.4.4

### Patch Changes

- weighted average chart aggr

## 3.4.3

### Patch Changes

- trade order fixed

## 3.4.2

### Patch Changes

- eliminating outliers from chart

## 3.4.1

### Patch Changes

- Use last instead of max for chart data

## 3.4.0

### Minor Changes

- AH asset status validation
- Oracles fee support
- Stablecoin rate support

## 3.3.14

### Patch Changes

- Hide insufficient assets for DCA

## 3.3.13

### Patch Changes

- Add chart tz support

## 3.3.12

### Patch Changes

- Skip xcm fee validations if missing adapter

## 3.3.11

### Patch Changes

- Evm insufficient asset ED validation

## 3.3.10

### Patch Changes

- Update xcm validations

## 3.3.9

### Patch Changes

- XCM transfer validations (wip)

## 3.3.8

### Patch Changes

- Support external assets on load

## 3.3.7

### Patch Changes

- Fix wrong route display (buy)

## 3.3.6

### Patch Changes

- Remove chain init from callback (breaking main repo)

## 3.3.5

### Patch Changes

- Revert i18n peer deps (breaking main repo)

## 3.3.4

### Patch Changes

- Minify build html literals (setup), clenaup peer deps
- EVM: Use multiTransactionPayment pallet for fee asset instead of WETH
- EVM: Fix ccm source fee display

## 3.3.3

### Patch Changes

- Fix: use app font for chart state / tooltip

## 3.3.2

### Patch Changes

- Fix chart states (use theme)

## 3.3.1

### Patch Changes

- Basilisk chart theme support

## 3.3.0

### Minor Changes

- Basilisk xcm support

## 3.2.4

### Patch Changes

- Fix swap buy

## 3.2.3

### Patch Changes

- Fix DCA / Yield DCA extrinsic period calc

## 3.2.2

### Patch Changes

- Default xcm address in substrate format (42)

## 3.2.1

### Patch Changes

- Fix transaction fee recalc

## 3.2.0

### Minor Changes

- Move order logic to api section & fix related issues

### Patch Changes

- Updated dependencies
  - @galacticcouncil/ui@3.0.3

## 3.1.7

### Patch Changes

- Fix substrate transaction fee calc

## 3.1.6

### Patch Changes

- Fix twap tx fee display calc
- DCA asset switcher

## 3.1.5

### Patch Changes

- fixed chart query for 2pool

## 3.1.4

### Patch Changes

- Reworked DCA summary message
- Updated dependencies
  - @galacticcouncil/ui@3.0.2

## 3.1.3

### Patch Changes

- DCA math fixes
- Updated dependencies
  - @galacticcouncil/ui@3.0.1

## 3.1.2

### Patch Changes

- Cleanup summary & notification messages

## 3.1.1

### Patch Changes

- Fix trade chart sync (empty state)

## 3.1.0

### Minor Changes

- Chart re-moduling & perf upgrade
- Rework locales
- Elements cleanup
- Fix signers
- Fix bonds settings

## 3.0.2

### Patch Changes

- Added view deps

## 3.0.1

### Patch Changes

- Fix tsc build

## 3.0.0

### Major Changes

- Apps v3 remoduling (init)
