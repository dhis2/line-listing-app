## [102.1.9](https://github.com/dhis2/line-listing-app/compare/v102.1.8...v102.1.9) (2025-06-02)


### Bug Fixes

* fetch original visualization before renaming so as not to overwrite newer changes ([#681](https://github.com/dhis2/line-listing-app/issues/681)) [DHIS2-19506] ([cb77068](https://github.com/dhis2/line-listing-app/commit/cb770681148dd6006386ca73f9b977d40d16cf28))

## [102.1.8](https://github.com/dhis2/line-listing-app/compare/v102.1.7...v102.1.8) (2025-04-30)


### Bug Fixes

* fetch path of selected org-unit if not available ([#665](https://github.com/dhis2/line-listing-app/issues/665)) ([58b7faf](https://github.com/dhis2/line-listing-app/commit/58b7faf20629497470a69492efb0be6c16ec9547))

## [102.1.7](https://github.com/dhis2/line-listing-app/compare/v102.1.6...v102.1.7) (2025-04-25)


### Bug Fixes

* ensure sorting works in interpretation modal (DHIS2-19283) ([#670](https://github.com/dhis2/line-listing-app/issues/670)) ([ccc7453](https://github.com/dhis2/line-listing-app/commit/ccc7453438f04dddf9d4c3eb990c8f16baa2f965))

## [102.1.6](https://github.com/dhis2/line-listing-app/compare/v102.1.5...v102.1.6) (2025-04-24)


### Bug Fixes

* use correct icon in most viewed list (DHIS2-18470) ([#678](https://github.com/dhis2/line-listing-app/issues/678)) ([815cead](https://github.com/dhis2/line-listing-app/commit/815cead292b9e352575298cfdf41f578a8a39cd3))

## [102.1.5](https://github.com/dhis2/line-listing-app/compare/v102.1.4...v102.1.5) (2025-04-22)


### Bug Fixes

* not possible to delete the description of a line list in the Rename dialog [DHIS2-19433] ([#672](https://github.com/dhis2/line-listing-app/issues/672)) ([ec2c933](https://github.com/dhis2/line-listing-app/commit/ec2c933066edefa8770a513d793350c77f60fd91))

## [102.1.4](https://github.com/dhis2/line-listing-app/compare/v102.1.3...v102.1.4) (2025-04-14)


### Reverts

* Revert "fix: save the rename in the app instead of the analytics library" ([5debf39](https://github.com/dhis2/line-listing-app/commit/5debf39cabc2f68a8f647750ed36975050f47daa))

## [102.1.3](https://github.com/dhis2/line-listing-app/compare/v102.1.2...v102.1.3) (2025-04-10)


### Bug Fixes

* save the rename in the app instead of the analytics library ([811de13](https://github.com/dhis2/line-listing-app/commit/811de13ef0b2c2c39de1966878b8781f9159f2e6))

## [102.1.2](https://github.com/dhis2/line-listing-app/compare/v102.1.1...v102.1.2) (2025-04-04)


### Bug Fixes

* restore navigation between line lists using the browser address bar [DHIS2-19387] ([#669](https://github.com/dhis2/line-listing-app/issues/669)) ([1d298a7](https://github.com/dhis2/line-listing-app/commit/1d298a7cde39592c0b52de24d8114536b9d5a823))

## [102.1.1](https://github.com/dhis2/line-listing-app/compare/v102.1.0...v102.1.1) (2025-04-01)


### Bug Fixes

* ensure hyperlinks work when using the upcoming global shell [DHIS2-19274] ([#668](https://github.com/dhis2/line-listing-app/issues/668)) ([673c6ae](https://github.com/dhis2/line-listing-app/commit/673c6ae20cf1a1fd020be38e876e41cd727f2936))

# [102.1.0](https://github.com/dhis2/line-listing-app/compare/v102.0.2...v102.1.0) (2025-03-18)


### Features

* full OU functionality for DEs and TEAs of type OU ([#651](https://github.com/dhis2/line-listing-app/issues/651)) ([ef2ec72](https://github.com/dhis2/line-listing-app/commit/ef2ec7274215abb6f2c0dc59404e157fa07132ce))

## [102.0.2](https://github.com/dhis2/line-listing-app/compare/v102.0.1...v102.0.2) (2025-03-18)


### Bug Fixes

* add hash routing and plugin support for the upcoming global shell [DHIS2-19061] ([#660](https://github.com/dhis2/line-listing-app/issues/660)) ([1a37bcf](https://github.com/dhis2/line-listing-app/commit/1a37bcf7da1df1b67afeb5ee8571c28af954d4ef))

## [102.0.1](https://github.com/dhis2/line-listing-app/compare/v102.0.0...v102.0.1) (2025-02-28)


### Bug Fixes

* remove app icon background ([#652](https://github.com/dhis2/line-listing-app/issues/652)) ([4860b2f](https://github.com/dhis2/line-listing-app/commit/4860b2f03236943177963f736961b57a6530b8e6))

# [102.0.0](https://github.com/dhis2/line-listing-app/compare/v101.1.14...v102.0.0) (2025-02-14)


### Features

* support new dashboard plugin architecture ([#396](https://github.com/dhis2/line-listing-app/issues/396)) ([321b114](https://github.com/dhis2/line-listing-app/commit/321b11420e700144a2f5c805c38e960d19127fb3))


### BREAKING CHANGES

* this version is only compatible with Dashboard app >=101.0.0

Use generic components for plugins in app-platform and app-runtime.

## [101.1.14](https://github.com/dhis2/line-listing-app/compare/v101.1.13...v101.1.14) (2025-02-04)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#641](https://github.com/dhis2/line-listing-app/issues/641)) ([2c20c9a](https://github.com/dhis2/line-listing-app/commit/2c20c9a1099a668b4817f32baa7633aab367c2e1))

## [101.1.13](https://github.com/dhis2/line-listing-app/compare/v101.1.12...v101.1.13) (2025-01-06)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#634](https://github.com/dhis2/line-listing-app/issues/634)) ([6cd1bec](https://github.com/dhis2/line-listing-app/commit/6cd1becf230f4d182c5884e9bab72f41872a789c))

## [101.1.12](https://github.com/dhis2/line-listing-app/compare/v101.1.11...v101.1.12) (2024-12-10)


### Bug Fixes

* enable ou tree and levels/groups with user orgunits (DHIS2-18066) ([#626](https://github.com/dhis2/line-listing-app/issues/626)) ([57b8b45](https://github.com/dhis2/line-listing-app/commit/57b8b45dd7aedf9d360648c2c2786c605e5c790a)), closes [dhis2/analytics#1702](https://github.com/dhis2/analytics/issues/1702)

## [101.1.11](https://github.com/dhis2/line-listing-app/compare/v101.1.10...v101.1.11) (2024-12-08)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([240f280](https://github.com/dhis2/line-listing-app/commit/240f2808153e772e0360396b83ddc09a188d9b2c))

## [101.1.10](https://github.com/dhis2/line-listing-app/compare/v101.1.9...v101.1.10) (2024-12-04)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([0705c70](https://github.com/dhis2/line-listing-app/commit/0705c70d3f60d548c0136164633b92aa0335267b))

## [101.1.9](https://github.com/dhis2/line-listing-app/compare/v101.1.8...v101.1.9) (2024-10-27)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([883368a](https://github.com/dhis2/line-listing-app/commit/883368a0ead1903a12454c87c4e5bf605db524a1))

## [101.1.8](https://github.com/dhis2/line-listing-app/compare/v101.1.7...v101.1.8) (2024-08-26)


### Bug Fixes

* display correct app version in dhis2 and updated workflows ([#581](https://github.com/dhis2/line-listing-app/issues/581)) ([d31979f](https://github.com/dhis2/line-listing-app/commit/d31979fbd451349813b32c90ea2bdb147d28ce92))
* use saved visualization in interpretation modal ([#551](https://github.com/dhis2/line-listing-app/issues/551)) ([6e42b92](https://github.com/dhis2/line-listing-app/commit/6e42b9264e71b95a0a45b65cfde5846061883519))

## [101.1.7](https://github.com/dhis2/line-listing-app/compare/v101.1.6...v101.1.7) (2024-08-25)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([ee92d90](https://github.com/dhis2/line-listing-app/commit/ee92d90588cde799a4bf9350642dfbd2cf4b23d4))

## [101.1.6](https://github.com/dhis2/line-listing-app/compare/v101.1.5...v101.1.6) (2024-08-21)


### Bug Fixes

* reduce resizehandle interaction area on left side [DHIS2-17923] ([#579](https://github.com/dhis2/line-listing-app/issues/579)) ([2ccbb15](https://github.com/dhis2/line-listing-app/commit/2ccbb155fb80982a51261d6f57d02c002a261076))

## [101.1.5](https://github.com/dhis2/line-listing-app/compare/v101.1.4...v101.1.5) (2024-08-14)


### Bug Fixes

* sanitize sidebar width before reading and writing to local storage ([#576](https://github.com/dhis2/line-listing-app/issues/576)) ([6589245](https://github.com/dhis2/line-listing-app/commit/6589245384677dd276710b7ab7a32499b6ebc32c))

## [101.1.4](https://github.com/dhis2/line-listing-app/compare/v101.1.3...v101.1.4) (2024-08-14)


### Bug Fixes

* fix error when clearing year in fixed period selector (DHIS2-17707) ([#575](https://github.com/dhis2/line-listing-app/issues/575)) ([0abe629](https://github.com/dhis2/line-listing-app/commit/0abe62953ae3ade0159eff92e577ae382933bd0d))
* update options test after DHIS2 Core v39.6 release ([#577](https://github.com/dhis2/line-listing-app/issues/577)) ([3744684](https://github.com/dhis2/line-listing-app/commit/37446840882e077135fbe5eb580e7c82a9f1075f))

## [101.1.3](https://github.com/dhis2/line-listing-app/compare/v101.1.2...v101.1.3) (2024-08-11)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([f0449b7](https://github.com/dhis2/line-listing-app/commit/f0449b7d9f0ce2899d38dc26e792457164f3dff0))

## [101.1.2](https://github.com/dhis2/line-listing-app/compare/v101.1.1...v101.1.2) (2024-08-09)


### Bug Fixes

* display the right format for time dimensions (DHIS2-17855) ([#572](https://github.com/dhis2/line-listing-app/issues/572)) ([86e6530](https://github.com/dhis2/line-listing-app/commit/86e65302fb2ba468bff29b76223ed04e345b5a3e))

## [101.1.1](https://github.com/dhis2/line-listing-app/compare/v101.1.0...v101.1.1) (2024-06-27)


### Bug Fixes

* bump analytics with fix for DHIS2-16904 ([#556](https://github.com/dhis2/line-listing-app/issues/556)) ([31c7336](https://github.com/dhis2/line-listing-app/commit/31c73366f5e0a0a978bb4c28d965291b6f7ff8e4))

# [101.1.0](https://github.com/dhis2/line-listing-app/compare/v101.0.7...v101.1.0) (2024-06-26)


### Features

* add resizable sidebar (DHIS2-17170) ([#534](https://github.com/dhis2/line-listing-app/issues/534)) ([2904c66](https://github.com/dhis2/line-listing-app/commit/2904c66b077871cfef99ed889bdc234a0211e4cb))

## [101.0.7](https://github.com/dhis2/line-listing-app/compare/v101.0.6...v101.0.7) (2024-06-24)


### Bug Fixes

* remove CSS that prevents LL from showing ([#552](https://github.com/dhis2/line-listing-app/issues/552)) ([cc94f24](https://github.com/dhis2/line-listing-app/commit/cc94f24643e0e0459998dff4aff97422e4d56e87))

## [101.0.6](https://github.com/dhis2/line-listing-app/compare/v101.0.5...v101.0.6) (2024-06-16)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([27a6ea5](https://github.com/dhis2/line-listing-app/commit/27a6ea57a889941c6e5efbc7739326a5fdf920d0))

## [101.0.5](https://github.com/dhis2/line-listing-app/compare/v101.0.4...v101.0.5) (2024-06-07)


### Bug Fixes

* use improved rich text editor from analytics (DHIS2-15522) ([#539](https://github.com/dhis2/line-listing-app/issues/539)) ([6f5b034](https://github.com/dhis2/line-listing-app/commit/6f5b03447f4988199e45418efae3709b7c1e88cf))

## [101.0.4](https://github.com/dhis2/line-listing-app/compare/v101.0.3...v101.0.4) (2024-06-07)


### Bug Fixes

* hh:mm time format ambiguous (DHIS2-16717) ([#538](https://github.com/dhis2/line-listing-app/issues/538)) ([b5f3df2](https://github.com/dhis2/line-listing-app/commit/b5f3df21c5edd67fc3d97bbca55eb6897598494c))

## [101.0.3](https://github.com/dhis2/line-listing-app/compare/v101.0.2...v101.0.3) (2024-06-03)


### Bug Fixes

* favourite link is missing the app name (DHIS2-16018) ([#530](https://github.com/dhis2/line-listing-app/issues/530)) ([a1b5ec0](https://github.com/dhis2/line-listing-app/commit/a1b5ec0481ce63118af43addde7533808971d7f4))

## [101.0.2](https://github.com/dhis2/line-listing-app/compare/v101.0.1...v101.0.2) (2024-06-02)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([18d3865](https://github.com/dhis2/line-listing-app/commit/18d38650a44fd58a58431cd9fada8efbefb26239))

## [101.0.1](https://github.com/dhis2/line-listing-app/compare/v101.0.0...v101.0.1) (2024-05-31)


### Bug Fixes

* enrollment line list filter for program stage not working (DHIS2-17412) ([#524](https://github.com/dhis2/line-listing-app/issues/524)) ([1cfb6ee](https://github.com/dhis2/line-listing-app/commit/1cfb6ee8932dbb3c1951275d5de78862e7da1a0f))

# [101.0.0](https://github.com/dhis2/line-listing-app/compare/v100.17.1...v101.0.0) (2024-05-31)


### Features

* bump Line Listing to min version 2.39 (DHIS2-17209) ([#523](https://github.com/dhis2/line-listing-app/issues/523)) ([8738ef1](https://github.com/dhis2/line-listing-app/commit/8738ef199231da596e0bdde78bd0b75acc770f0f))


### BREAKING CHANGES

* requires core version 2.39 and above

## [100.17.1](https://github.com/dhis2/line-listing-app/compare/v100.17.0...v100.17.1) (2024-05-14)


### Bug Fixes

* system / user setting for display name not respected in Org Unit tree (DHIS2-15000) ([#509](https://github.com/dhis2/line-listing-app/issues/509)) ([a1e737d](https://github.com/dhis2/line-listing-app/commit/a1e737d2aec9bb633985215948fd87ce7432e464))
* **translations:** sync translations from transifex (master) ([385feee](https://github.com/dhis2/line-listing-app/commit/385feee671bc5e8779ffd31060366674457b5bc4))

# [100.17.0](https://github.com/dhis2/line-listing-app/compare/v100.16.2...v100.17.0) (2024-04-25)


### Bug Fixes

* show empty cell for missing boolean values as well ([#466](https://github.com/dhis2/line-listing-app/issues/466)) ([db706cc](https://github.com/dhis2/line-listing-app/commit/db706cc0a651c026419bea73c7f069449c060e47))


### Features

* persist sorting information in AO (DHIS2-14955) ([#382](https://github.com/dhis2/line-listing-app/issues/382)) ([718ed86](https://github.com/dhis2/line-listing-app/commit/718ed867c25434d0ccfff956f86ad04fc0088149))

## [100.16.2](https://github.com/dhis2/line-listing-app/compare/v100.16.1...v100.16.2) (2024-04-24)


### Bug Fixes

* main dimensions not translated in line lists (DHIS2-15878) ([#502](https://github.com/dhis2/line-listing-app/issues/502)) ([d3639b2](https://github.com/dhis2/line-listing-app/commit/d3639b2be28e849cd84a6b1396450acb23a4b392))

## [100.16.1](https://github.com/dhis2/line-listing-app/compare/v100.16.0...v100.16.1) (2024-04-24)


### Bug Fixes

* paragraph newlines are not rendered in LL description ([#504](https://github.com/dhis2/line-listing-app/issues/504)) ([01d5703](https://github.com/dhis2/line-listing-app/commit/01d57031c2faf5a57bdef27536f033b5321e9806))

# [100.16.0](https://github.com/dhis2/line-listing-app/compare/v100.15.1...v100.16.0) (2024-04-12)


### Features

* tracked entity input (DHIS2-16023) ([#451](https://github.com/dhis2/line-listing-app/issues/451)) ([a59f19e](https://github.com/dhis2/line-listing-app/commit/a59f19e423189d4e59c66dd6f006769fce716645))

## [100.15.1](https://github.com/dhis2/line-listing-app/compare/v100.15.0...v100.15.1) (2024-03-01)


### Bug Fixes

* **push-analytics:** add push analytics instructions ([#491](https://github.com/dhis2/line-listing-app/issues/491)) ([1db932c](https://github.com/dhis2/line-listing-app/commit/1db932c3fde54c7a385569891985f922877a67b0))

# [100.15.0](https://github.com/dhis2/line-listing-app/compare/v100.14.0...v100.15.0) (2024-01-30)


### Features

* add skip rounding option (DHIS2-15629) ([#424](https://github.com/dhis2/line-listing-app/issues/424)) ([4ddbed9](https://github.com/dhis2/line-listing-app/commit/4ddbed99dda19d15933c1329eec281d542a0a9d4))

# [100.14.0](https://github.com/dhis2/line-listing-app/compare/v100.13.1...v100.14.0) (2024-01-29)


### Features

* add class-names for push-analytics ([#485](https://github.com/dhis2/line-listing-app/issues/485)) ([b0836cc](https://github.com/dhis2/line-listing-app/commit/b0836ccdc88df1a625d2e36ffc18be3337e0dd3e))

## [100.13.1](https://github.com/dhis2/line-listing-app/compare/v100.13.0...v100.13.1) (2024-01-21)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([0e27c48](https://github.com/dhis2/line-listing-app/commit/0e27c48849fc7fa2348afc623863da14b1cad698))

# [100.13.0](https://github.com/dhis2/line-listing-app/compare/v100.12.1...v100.13.0) (2024-01-17)


### Features

* enable legend toggle button for LL dashboard items (DHIS2-15358) ([#443](https://github.com/dhis2/line-listing-app/issues/443)) ([c14551d](https://github.com/dhis2/line-listing-app/commit/c14551d6af91b04637ccf468b031d671e58f8c36))

## [100.12.1](https://github.com/dhis2/line-listing-app/compare/v100.12.0...v100.12.1) (2024-01-14)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([f232d4e](https://github.com/dhis2/line-listing-app/commit/f232d4ee006069ca4230028f3cb3816b6495a146))

# [100.12.0](https://github.com/dhis2/line-listing-app/compare/v100.11.4...v100.12.0) (2024-01-12)


### Features

* updated chip design (DHIS2-15897) ([#478](https://github.com/dhis2/line-listing-app/issues/478)) ([eeba81f](https://github.com/dhis2/line-listing-app/commit/eeba81f3846ac90caf159caf26813a81e4a05682)), closes [#464](https://github.com/dhis2/line-listing-app/issues/464) [#464](https://github.com/dhis2/line-listing-app/issues/464)

## [100.11.4](https://github.com/dhis2/line-listing-app/compare/v100.11.3...v100.11.4) (2023-12-10)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([b356aa5](https://github.com/dhis2/line-listing-app/commit/b356aa51952428b721c32f000ced94e58c5b2970))

## [100.11.3](https://github.com/dhis2/line-listing-app/compare/v100.11.2...v100.11.3) (2023-12-08)


### Bug Fixes

* add custom errors for analytics requests ([#445](https://github.com/dhis2/line-listing-app/issues/445)) ([cecd9a5](https://github.com/dhis2/line-listing-app/commit/cecd9a5864ce70909d3f9e6e60ba92d91cb3b44d))

## [100.11.2](https://github.com/dhis2/line-listing-app/compare/v100.11.1...v100.11.2) (2023-12-07)


### Bug Fixes

* orgunits are not restored in the orgunit tree (DHIS2-16249) ([#465](https://github.com/dhis2/line-listing-app/issues/465)) ([675add4](https://github.com/dhis2/line-listing-app/commit/675add4e4f332f6170a344370e71bf164e17f202))

## [100.11.1](https://github.com/dhis2/line-listing-app/compare/v100.11.0...v100.11.1) (2023-11-30)


### Bug Fixes

* visualization deleted when saving it after copy (DHIS2-15722) ([#433](https://github.com/dhis2/line-listing-app/issues/433)) ([f505c50](https://github.com/dhis2/line-listing-app/commit/f505c500d77577d4f7c747dad6599735c8f8578d))

# [100.11.0](https://github.com/dhis2/line-listing-app/compare/v100.10.6...v100.11.0) (2023-11-30)


### Features

* distinguish non-existent repetitions from empty values in line lists (DHIS2-15767) ([#427](https://github.com/dhis2/line-listing-app/issues/427)) ([675118d](https://github.com/dhis2/line-listing-app/commit/675118de9f14730f18cee1a0faa5313c7dba067d))

## [100.10.6](https://github.com/dhis2/line-listing-app/compare/v100.10.5...v100.10.6) (2023-11-27)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([e89fd9d](https://github.com/dhis2/line-listing-app/commit/e89fd9d4ced20b644b77f4ebe143fb875999ac1b))

## [100.10.5](https://github.com/dhis2/line-listing-app/compare/v100.10.4...v100.10.5) (2023-11-23)


### Bug Fixes

* handle options with non-unique codes across optionsets (DHIS2-15771) ([#426](https://github.com/dhis2/line-listing-app/issues/426)) ([37e3e69](https://github.com/dhis2/line-listing-app/commit/37e3e694acc114b524cd284428bacc307602b12c))

## [100.10.4](https://github.com/dhis2/line-listing-app/compare/v100.10.3...v100.10.4) (2023-11-05)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([db0115f](https://github.com/dhis2/line-listing-app/commit/db0115f72c88c3355562f847e1134cfc4873ac04))

## [100.10.3](https://github.com/dhis2/line-listing-app/compare/v100.10.2...v100.10.3) (2023-11-01)


### Bug Fixes

* your- and program-dimensions list lazy loading ([#453](https://github.com/dhis2/line-listing-app/issues/453)) ([a7341f8](https://github.com/dhis2/line-listing-app/commit/a7341f8de1d1cb25d07bdb19f05121c1ddacb9c2))

## [100.10.2](https://github.com/dhis2/line-listing-app/compare/v100.10.1...v100.10.2) (2023-10-31)


### Bug Fixes

* **deps:** platform fixes for login redirect [DHIS2-15320] ([#366](https://github.com/dhis2/line-listing-app/issues/366)) ([dde8a92](https://github.com/dhis2/line-listing-app/commit/dde8a923fc2635664cc82ed01449a8e1f5c71301))

## [100.10.1](https://github.com/dhis2/line-listing-app/compare/v100.10.0...v100.10.1) (2023-10-30)


### Bug Fixes

* allow opening interpretations for AOs without a time dimension (DHIS2-15781) ([7c8239d](https://github.com/dhis2/line-listing-app/commit/7c8239d01ba9c56ac0ff5ad01a7032773babb06d))
* correctly center the table spinner (DHIS2-13947, DHIS2-13946) ([0bea200](https://github.com/dhis2/line-listing-app/commit/0bea2007a3c6d1607e9592411f06c99b40892d61))
* take legend-key into account when computing pagination max-width (DHIS2-15465) ([9445d6a](https://github.com/dhis2/line-listing-app/commit/9445d6a5481971a2a18a929c35f59b09f29a7924))
* upgrade @dhis2/analytics to latest ([52027a0](https://github.com/dhis2/line-listing-app/commit/52027a0946feb57c1ecb045c24de20332ccae2a8))

# [100.10.0](https://github.com/dhis2/line-listing-app/compare/v100.9.5...v100.10.0) (2023-10-26)


### Features

* event/enrollment ui changes to prepare for TEI cross-program support (DHIS2-15454) ([#415](https://github.com/dhis2/line-listing-app/issues/415)) ([53fa071](https://github.com/dhis2/line-listing-app/commit/53fa071aeee37b537563d8ac2fb76d9959ab9931))

## [100.9.5](https://github.com/dhis2/line-listing-app/compare/v100.9.4...v100.9.5) (2023-10-22)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([9c1e50f](https://github.com/dhis2/line-listing-app/commit/9c1e50fafb4e5582d7fcd045fee720d8b119fd99))

## [100.9.4](https://github.com/dhis2/line-listing-app/compare/v100.9.3...v100.9.4) (2023-10-03)


### Bug Fixes

* make "greater than or equal to" render on a single line for conditions (DHIS2-14030) ([#430](https://github.com/dhis2/line-listing-app/issues/430)) ([4886533](https://github.com/dhis2/line-listing-app/commit/488653342a92828255fdb0b8604df89adc97b6b2))

## [100.9.3](https://github.com/dhis2/line-listing-app/compare/v100.9.2...v100.9.3) (2023-10-03)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([3aa158d](https://github.com/dhis2/line-listing-app/commit/3aa158de83d4786d17f1210a513cada97af32838))
* ensure pagination max-width is correct in interpretations modal ([#434](https://github.com/dhis2/line-listing-app/issues/434)) ([2b733f1](https://github.com/dhis2/line-listing-app/commit/2b733f16c426617469c4c43aeaec5d9c0f049923))
* lack of access show the generic "something went wrong" error (DHIS2-15737) ([#429](https://github.com/dhis2/line-listing-app/issues/429)) ([995ae74](https://github.com/dhis2/line-listing-app/commit/995ae7483d67a0b73a55dafa75f3fafae1a41727))

## [100.9.2](https://github.com/dhis2/line-listing-app/compare/v100.9.1...v100.9.2) (2023-09-15)


### Bug Fixes

* always have the full pagination in view ([#431](https://github.com/dhis2/line-listing-app/issues/431)) ([05d3d79](https://github.com/dhis2/line-listing-app/commit/05d3d7921577a3a8d357c3e28aaf4ca0f952525e))

## [100.9.1](https://github.com/dhis2/line-listing-app/compare/v100.9.0...v100.9.1) (2023-08-21)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#422](https://github.com/dhis2/line-listing-app/issues/422)) ([2556576](https://github.com/dhis2/line-listing-app/commit/255657693998969a3489132d42357d7edc1763a0))

# [100.9.0](https://github.com/dhis2/line-listing-app/compare/v100.8.2...v100.9.0) (2023-08-09)


### Features

* toolbar UI update (DHIS2-15167) ([#368](https://github.com/dhis2/line-listing-app/issues/368)) ([6c54186](https://github.com/dhis2/line-listing-app/commit/6c5418636f2b8687d2b2f42293074236a0ba2407))

## [100.8.2](https://github.com/dhis2/line-listing-app/compare/v100.8.1...v100.8.2) (2023-07-16)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([0b0c46e](https://github.com/dhis2/line-listing-app/commit/0b0c46e3ebb174511f17fec4e4d20636dcdf19eb))

## [100.8.1](https://github.com/dhis2/line-listing-app/compare/v100.8.0...v100.8.1) (2023-06-25)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([a34895f](https://github.com/dhis2/line-listing-app/commit/a34895faabcd2952eb591403ce1e4b2706ac6c15))

# [100.8.0](https://github.com/dhis2/line-listing-app/compare/v100.7.5...v100.8.0) (2023-06-23)


### Features

* remove period validation (DHIS2-15015) ([#381](https://github.com/dhis2/line-listing-app/issues/381)) ([efb9803](https://github.com/dhis2/line-listing-app/commit/efb98039c8d5467063cd94316015593d1da34e69))

## [100.7.5](https://github.com/dhis2/line-listing-app/compare/v100.7.4...v100.7.5) (2023-06-19)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([459d978](https://github.com/dhis2/line-listing-app/commit/459d9785743fc869a3e5effdd2b5f8f625fdae05))

## [100.7.4](https://github.com/dhis2/line-listing-app/compare/v100.7.3...v100.7.4) (2023-06-15)


### Bug Fixes

* avoid crash when missing metadata ([ec74230](https://github.com/dhis2/line-listing-app/commit/ec74230a7668c4369d4c8f30093b413f4c064b38))
* use nullish instead ([4be2930](https://github.com/dhis2/line-listing-app/commit/4be2930f9747cad6a7d222b69d69baf4de496492))

## [100.7.3](https://github.com/dhis2/line-listing-app/compare/v100.7.2...v100.7.3) (2023-06-14)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([a805715](https://github.com/dhis2/line-listing-app/commit/a8057155f4639678d86ac65820eb19ad3d0d0609))

## [100.7.2](https://github.com/dhis2/line-listing-app/compare/v100.7.1...v100.7.2) (2023-06-06)


### Bug Fixes

* dont need to check branch since workflow only runs on default ([#376](https://github.com/dhis2/line-listing-app/issues/376)) ([220f655](https://github.com/dhis2/line-listing-app/commit/220f65556053073026b22252b6595aa4d218dac2))

## [100.7.1](https://github.com/dhis2/line-listing-app/compare/v100.7.0...v100.7.1) (2023-06-05)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([c58a65e](https://github.com/dhis2/line-listing-app/commit/c58a65e03961567ec21751ba8fd75a5bb3d45aff))

# [100.7.0](https://github.com/dhis2/line-listing-app/compare/v100.6.2...v100.7.0) (2023-05-23)


### Features

* allow expanding visualization and hiding panels ([#344](https://github.com/dhis2/line-listing-app/issues/344)) ([4af769c](https://github.com/dhis2/line-listing-app/commit/4af769cdfccb3ae1b3c0e23977e6099248f59496))

## [100.6.2](https://github.com/dhis2/line-listing-app/compare/v100.6.1...v100.6.2) (2023-05-22)


### Bug Fixes

* bump cli-app-scripts to 10.3.8 for LIBS-499 fix ([#352](https://github.com/dhis2/line-listing-app/issues/352)) ([747a131](https://github.com/dhis2/line-listing-app/commit/747a131b1601a6827e12a17a3d02c344c3436445))

## [100.6.1](https://github.com/dhis2/line-listing-app/compare/v100.6.0...v100.6.1) (2023-05-04)


### Bug Fixes

* add 2.40.0 toggle to show hierarchy option ([#351](https://github.com/dhis2/line-listing-app/issues/351)) ([1362075](https://github.com/dhis2/line-listing-app/commit/13620751487d77589f85f27aa7d80aa34efb8520))

# [100.6.0](https://github.com/dhis2/line-listing-app/compare/v100.5.0...v100.6.0) (2023-05-03)


### Features

* v100.6.0 ([#347](https://github.com/dhis2/line-listing-app/issues/347)) ([319bb1b](https://github.com/dhis2/line-listing-app/commit/319bb1b2c34e0c658e34c3f2dcc268e4461507c0)), closes [#328](https://github.com/dhis2/line-listing-app/issues/328) [#331](https://github.com/dhis2/line-listing-app/issues/331) [#333](https://github.com/dhis2/line-listing-app/issues/333) [#332](https://github.com/dhis2/line-listing-app/issues/332) [#336](https://github.com/dhis2/line-listing-app/issues/336) [#337](https://github.com/dhis2/line-listing-app/issues/337) [#342](https://github.com/dhis2/line-listing-app/issues/342) [#340](https://github.com/dhis2/line-listing-app/issues/340) [#339](https://github.com/dhis2/line-listing-app/issues/339) [#329](https://github.com/dhis2/line-listing-app/issues/329)

# [100.5.0](https://github.com/dhis2/line-listing-app/compare/v100.4.0...v100.5.0) (2023-02-07)


### Features

* v100.5.0 ([#327](https://github.com/dhis2/line-listing-app/issues/327)) ([ba9a998](https://github.com/dhis2/line-listing-app/commit/ba9a99861ae9ce982964206e99e436a33e5783e3)), closes [#312](https://github.com/dhis2/line-listing-app/issues/312) [#317](https://github.com/dhis2/line-listing-app/issues/317) [#316](https://github.com/dhis2/line-listing-app/issues/316) [#319](https://github.com/dhis2/line-listing-app/issues/319) [#313](https://github.com/dhis2/line-listing-app/issues/313) [#322](https://github.com/dhis2/line-listing-app/issues/322) [#314](https://github.com/dhis2/line-listing-app/issues/314) [#324](https://github.com/dhis2/line-listing-app/issues/324)

# [100.4.0](https://github.com/dhis2/line-listing-app/compare/v100.3.1...v100.4.0) (2022-12-15)


### Features

* v100.4.0 ([#310](https://github.com/dhis2/line-listing-app/issues/310)) ([6e04c4a](https://github.com/dhis2/line-listing-app/commit/6e04c4a8ff56da8596ee329b7f939d2aa1e3327d)), closes [#286](https://github.com/dhis2/line-listing-app/issues/286) [#269](https://github.com/dhis2/line-listing-app/issues/269) [#291](https://github.com/dhis2/line-listing-app/issues/291) [#285](https://github.com/dhis2/line-listing-app/issues/285) [#296](https://github.com/dhis2/line-listing-app/issues/296) [#289](https://github.com/dhis2/line-listing-app/issues/289) [#298](https://github.com/dhis2/line-listing-app/issues/298) [#302](https://github.com/dhis2/line-listing-app/issues/302) [#301](https://github.com/dhis2/line-listing-app/issues/301) [#306](https://github.com/dhis2/line-listing-app/issues/306) [#299](https://github.com/dhis2/line-listing-app/issues/299) [#303](https://github.com/dhis2/line-listing-app/issues/303) [#308](https://github.com/dhis2/line-listing-app/issues/308) [#307](https://github.com/dhis2/line-listing-app/issues/307) [#309](https://github.com/dhis2/line-listing-app/issues/309) [#297](https://github.com/dhis2/line-listing-app/issues/297) [#304](https://github.com/dhis2/line-listing-app/issues/304)

## [100.3.1](https://github.com/dhis2/line-listing-app/compare/v100.3.0...v100.3.1) (2022-11-16)


### Bug Fixes

* v100.3.1 ([#277](https://github.com/dhis2/line-listing-app/issues/277)) ([fe16e26](https://github.com/dhis2/line-listing-app/commit/fe16e26572aac0a459069e867d37346a8d9beb9f)), closes [#249](https://github.com/dhis2/line-listing-app/issues/249) [#230](https://github.com/dhis2/line-listing-app/issues/230) [#254](https://github.com/dhis2/line-listing-app/issues/254) [#244](https://github.com/dhis2/line-listing-app/issues/244) [#257](https://github.com/dhis2/line-listing-app/issues/257) [#256](https://github.com/dhis2/line-listing-app/issues/256)

# [100.3.0](https://github.com/dhis2/line-listing-app/compare/v100.2.0...v100.3.0) (2022-10-14)


### Features

* add "Scheduled" event status (DHIS2-13881) ([#219](https://github.com/dhis2/line-listing-app/issues/219)) ([773fe9f](https://github.com/dhis2/line-listing-app/commit/773fe9f1837b4b969811e9e436de6cfc8abb1a2e)), closes [#184](https://github.com/dhis2/line-listing-app/issues/184) [#178](https://github.com/dhis2/line-listing-app/issues/178)

# [100.2.0](https://github.com/dhis2/line-listing-app/compare/v100.1.0...v100.2.0) (2022-09-13)


### Features

* visualize scheduled date (DHIS2-11192) ([#206](https://github.com/dhis2/line-listing-app/issues/206)) ([b657de7](https://github.com/dhis2/line-listing-app/commit/b657de76ddd645af29bd53c6246e839566b129b2)), closes [#200](https://github.com/dhis2/line-listing-app/issues/200) [#202](https://github.com/dhis2/line-listing-app/issues/202) [#203](https://github.com/dhis2/line-listing-app/issues/203) [#191](https://github.com/dhis2/line-listing-app/issues/191) [#204](https://github.com/dhis2/line-listing-app/issues/204) [#205](https://github.com/dhis2/line-listing-app/issues/205) [#201](https://github.com/dhis2/line-listing-app/issues/201)

# [100.1.0](https://github.com/dhis2/line-listing-app/compare/v100.0.0...v100.1.0) (2022-08-26)


### Features

* legend set table coloring support in line listing (DHIS2-75) ([#199](https://github.com/dhis2/line-listing-app/issues/199)) ([5d9feb1](https://github.com/dhis2/line-listing-app/commit/5d9feb116a4a58b77a8359e74fc3b96df6c817e0)), closes [#148](https://github.com/dhis2/line-listing-app/issues/148) [#149](https://github.com/dhis2/line-listing-app/issues/149) [#156](https://github.com/dhis2/line-listing-app/issues/156) [#157](https://github.com/dhis2/line-listing-app/issues/157) [#153](https://github.com/dhis2/line-listing-app/issues/153) [#143](https://github.com/dhis2/line-listing-app/issues/143) [#164](https://github.com/dhis2/line-listing-app/issues/164) [#158](https://github.com/dhis2/line-listing-app/issues/158) [#168](https://github.com/dhis2/line-listing-app/issues/168) [#121](https://github.com/dhis2/line-listing-app/issues/121) [#177](https://github.com/dhis2/line-listing-app/issues/177) [#179](https://github.com/dhis2/line-listing-app/issues/179) [#181](https://github.com/dhis2/line-listing-app/issues/181) [#180](https://github.com/dhis2/line-listing-app/issues/180) [#182](https://github.com/dhis2/line-listing-app/issues/182) [#183](https://github.com/dhis2/line-listing-app/issues/183) [#179](https://github.com/dhis2/line-listing-app/issues/179) [#186](https://github.com/dhis2/line-listing-app/issues/186) [#188](https://github.com/dhis2/line-listing-app/issues/188) [#187](https://github.com/dhis2/line-listing-app/issues/187) [#185](https://github.com/dhis2/line-listing-app/issues/185) [#190](https://github.com/dhis2/line-listing-app/issues/190) [#176](https://github.com/dhis2/line-listing-app/issues/176) [#172](https://github.com/dhis2/line-listing-app/issues/172) [#195](https://github.com/dhis2/line-listing-app/issues/195) [#189](https://github.com/dhis2/line-listing-app/issues/189) [#192](https://github.com/dhis2/line-listing-app/issues/192) [#194](https://github.com/dhis2/line-listing-app/issues/194) [#198](https://github.com/dhis2/line-listing-app/issues/198)

# [100.0.0](https://github.com/dhis2/line-listing-app/compare/v99.9.9...v100.0.0) (2022-05-18)


### chore

* cut 100.0.0 CD release ([c4d1dea](https://github.com/dhis2/line-listing-app/commit/c4d1deab455fbab1082c5d0794afdd2eb3498752))


### BREAKING CHANGES

* move to 100.x version scheme

## [1.1.83](https://github.com/dhis2/line-listing-app/compare/v1.1.82...v1.1.83) (2022-05-16)


### Bug Fixes

* prevent replaceAll from crashing due to undefined value ([414e339](https://github.com/dhis2/line-listing-app/commit/414e339b4570d2de10789d038491af62dd0f875c))
* prevent replaceAll from crashing due to undefined value (TECH-1183) [#145](https://github.com/dhis2/line-listing-app/issues/145) ([ad7d6cf](https://github.com/dhis2/line-listing-app/commit/ad7d6cfdbf3017e9c8387dd2728604349c7da4e3))

## [1.1.82](https://github.com/dhis2/line-listing-app/compare/v1.1.81...v1.1.82) (2022-05-13)


### Bug Fixes

* use shortname for the analytics request ([bb6ebca](https://github.com/dhis2/line-listing-app/commit/bb6ebca0a1a339c506125bee396db21474af5ad3))
* use shortname for the analytics request (TECH-1118) [#125](https://github.com/dhis2/line-listing-app/issues/125) ([67f0804](https://github.com/dhis2/line-listing-app/commit/67f08044e5e50e8ad8c2db9c0b1da1f689b3c591))

## [1.1.81](https://github.com/dhis2/line-listing-app/compare/v1.1.80...v1.1.81) (2022-05-13)


### Bug Fixes

* main dimension's tooltip (TECH-1168) ([#140](https://github.com/dhis2/line-listing-app/issues/140)) ([6254e21](https://github.com/dhis2/line-listing-app/commit/6254e218130c1f0e0983403e4069c154f4c97e31))

## [1.1.80](https://github.com/dhis2/line-listing-app/compare/v1.1.79...v1.1.80) (2022-05-13)


### Bug Fixes

* update d2-ui-rich-text dependency LIBS-317 ([#142](https://github.com/dhis2/line-listing-app/issues/142)) ([9c365bd](https://github.com/dhis2/line-listing-app/commit/9c365bd1baa795bf7c3ebf27f1e4bc95090ac877))

## [1.1.79](https://github.com/dhis2/line-listing-app/compare/v1.1.78...v1.1.79) (2022-05-11)


### Bug Fixes

* interpretations use locale format (TECH-1175) [#141](https://github.com/dhis2/line-listing-app/issues/141) ([4a13729](https://github.com/dhis2/line-listing-app/commit/4a1372966308ebc0d5f768c8f15d19f2531d0025))
* use locale format ([8e0a313](https://github.com/dhis2/line-listing-app/commit/8e0a31349d5201897d4cb1db50038ea5d6ab316a))

## [1.1.78](https://github.com/dhis2/line-listing-app/compare/v1.1.77...v1.1.78) (2022-05-10)


### Bug Fixes

* width for MenuItem chevron icon (TECH-1173) [#136](https://github.com/dhis2/line-listing-app/issues/136) ([48f7864](https://github.com/dhis2/line-listing-app/commit/48f78647e2a69f99177b7b47bc19de3b14c2b709))
* wrap the chevron in a div with height and width ([9de6408](https://github.com/dhis2/line-listing-app/commit/9de6408e5e6e0c989232065b2f1d260c4d75a966))

## [1.1.77](https://github.com/dhis2/line-listing-app/compare/v1.1.76...v1.1.77) (2022-05-09)


### Bug Fixes

* app icon and analytics upgrade ([#139](https://github.com/dhis2/line-listing-app/issues/139)) ([5f06e42](https://github.com/dhis2/line-listing-app/commit/5f06e426e0ee715910eaf65571b6ca47c9fa5c23))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))
* use pointer cursor on Interpretations unit TECH-1172 ([#132](https://github.com/dhis2/line-listing-app/issues/132)) ([c2d0de3](https://github.com/dhis2/line-listing-app/commit/c2d0de3166560df22afd6d2409c5ba95071a9424))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))
* use pointer cursor on Interpretations unit TECH-1172 ([#132](https://github.com/dhis2/line-listing-app/issues/132)) ([c2d0de3](https://github.com/dhis2/line-listing-app/commit/c2d0de3166560df22afd6d2409c5ba95071a9424))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))
* use pointer cursor on Interpretations unit TECH-1172 ([#132](https://github.com/dhis2/line-listing-app/issues/132)) ([c2d0de3](https://github.com/dhis2/line-listing-app/commit/c2d0de3166560df22afd6d2409c5ba95071a9424))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))
* use pointer cursor on Interpretations unit TECH-1172 ([#132](https://github.com/dhis2/line-listing-app/issues/132)) ([c2d0de3](https://github.com/dhis2/line-listing-app/commit/c2d0de3166560df22afd6d2409c5ba95071a9424))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.76](https://github.com/dhis2/line-listing-app/compare/v1.1.75...v1.1.76) (2022-05-09)


### Bug Fixes

* use larger lateral padding on Toolbar buttons TECH-1145 ([#135](https://github.com/dhis2/line-listing-app/issues/135)) ([c4bfd97](https://github.com/dhis2/line-listing-app/commit/c4bfd97865c71a2399dbd4296e1b1116556e948c))

## [1.1.75](https://github.com/dhis2/line-listing-app/compare/v1.1.74...v1.1.75) (2022-05-09)


### Bug Fixes

* mark all strings in download menu for translation TECH-1169 ([#133](https://github.com/dhis2/line-listing-app/issues/133)) ([7a7c988](https://github.com/dhis2/line-listing-app/commit/7a7c988e5ec1d5bb3eb4ea6630cabd375d546d49))
* show translated title TECH-1170 ([#134](https://github.com/dhis2/line-listing-app/issues/134)) ([9c9ad2e](https://github.com/dhis2/line-listing-app/commit/9c9ad2e17bd5f59dc5a46ddd5a141ca87db9ffc0))

## [1.1.74](https://github.com/dhis2/line-listing-app/compare/v1.1.73...v1.1.74) (2022-05-09)


### Bug Fixes

* add app icons ([#138](https://github.com/dhis2/line-listing-app/issues/138)) ([d10a064](https://github.com/dhis2/line-listing-app/commit/d10a06440655f4b49135e763ad8efd3eeab9ece4))

## [1.1.73](https://github.com/dhis2/line-listing-app/compare/v1.1.72...v1.1.73) (2022-05-06)


### Bug Fixes

* do not render ProgramDimensionsList if panel is closed ([#122](https://github.com/dhis2/line-listing-app/issues/122)) ([bcbf043](https://github.com/dhis2/line-listing-app/commit/bcbf043af2b29a0c9b2fa3b6a0125fa8b30a2d87)), closes [#112](https://github.com/dhis2/line-listing-app/issues/112)

## [1.1.72](https://github.com/dhis2/line-listing-app/compare/v1.1.71...v1.1.72) (2022-05-05)


### Bug Fixes

* use dimension types from Analytics [#131](https://github.com/dhis2/line-listing-app/issues/131) ([494031f](https://github.com/dhis2/line-listing-app/commit/494031f70d6202aa84d03521780892a692f750d6))

## [1.1.71](https://github.com/dhis2/line-listing-app/compare/v1.1.70...v1.1.71) (2022-05-05)


### Bug Fixes

* remove min-width on Toolbar buttons TECH-1145 ([#130](https://github.com/dhis2/line-listing-app/issues/130)) ([b782db5](https://github.com/dhis2/line-listing-app/commit/b782db5ac7a3da2429c57f92479744eb629fc14e))

## [1.1.70](https://github.com/dhis2/line-listing-app/compare/v1.1.69...v1.1.70) (2022-05-05)


### Bug Fixes

* set default repetition to no repetition ([cbb3928](https://github.com/dhis2/line-listing-app/commit/cbb3928600090c3b438b67f70c7667e1d4987ba6))
* set default repetition to no repetition (TECH-1143) [#116](https://github.com/dhis2/line-listing-app/issues/116) ([1f49189](https://github.com/dhis2/line-listing-app/commit/1f491894b8865248cc69259a8164645f6647794a))
* set new default value to empty array, update tests ([a48353e](https://github.com/dhis2/line-listing-app/commit/a48353e28ee4a2064c886370bb697c3423ae69a8))

## [1.1.69](https://github.com/dhis2/line-listing-app/compare/v1.1.68...v1.1.69) (2022-05-03)


### Bug Fixes

* dimension item clickable everywhere ([df2ddda](https://github.com/dhis2/line-listing-app/commit/df2dddacdd10b39c39ac6c9f7a8af78e024bacdc))
* dimension item fixes (TECH-1135) [#129](https://github.com/dhis2/line-listing-app/issues/129) ([9b1216c](https://github.com/dhis2/line-listing-app/commit/9b1216c3824c4383aa71e74a11ac2a5dccaaeac7))
* handle all three cases in one toggle ([4fef7a6](https://github.com/dhis2/line-listing-app/commit/4fef7a65ba75204f76b8eaa7ff82438b5294a1a0))
* stop event propagation when clicking on the Layer ([39a3af2](https://github.com/dhis2/line-listing-app/commit/39a3af237ec8fd3f5a243e4a074202c312a85437))
* time dimensions full width ([9621288](https://github.com/dhis2/line-listing-app/commit/962128815080f34636fe2327e4d1d3a88beef1b8))

## [1.1.68](https://github.com/dhis2/line-listing-app/compare/v1.1.67...v1.1.68) (2022-05-03)


### Bug Fixes

* update title for most viewed items ([20632f3](https://github.com/dhis2/line-listing-app/commit/20632f30faa620a379a8594de2b655f95ec6dbda))
* update title for most viewed items (TECH-1148) [#128](https://github.com/dhis2/line-listing-app/issues/128) ([bea85e1](https://github.com/dhis2/line-listing-app/commit/bea85e17423adde89e23c636de771f8336230fea))

## [1.1.67](https://github.com/dhis2/line-listing-app/compare/v1.1.66...v1.1.67) (2022-05-03)


### Bug Fixes

* disable pagination while fetching data TECH-1119 ([#110](https://github.com/dhis2/line-listing-app/issues/110)) ([5b1a5ec](https://github.com/dhis2/line-listing-app/commit/5b1a5ece55c5c8bb90f709b92e43537eea8fc435))

## [1.1.66](https://github.com/dhis2/line-listing-app/compare/v1.1.65...v1.1.66) (2022-05-03)


### Bug Fixes

* use correct operator type for phone number ([a902427](https://github.com/dhis2/line-listing-app/commit/a902427dfd041fbe03e2ccb3f48343b0055299fb))
* use correct operator type for phone number (TECH-1147) [#124](https://github.com/dhis2/line-listing-app/issues/124) ([d523f26](https://github.com/dhis2/line-listing-app/commit/d523f260530504e086b5cee29d1bc050a68dd788))

## [1.1.65](https://github.com/dhis2/line-listing-app/compare/v1.1.64...v1.1.65) (2022-05-02)


### Bug Fixes

* add overflow-wrap: anywhere for wrapping of text in dimension item ([#120](https://github.com/dhis2/line-listing-app/issues/120)) ([b7cbdc8](https://github.com/dhis2/line-listing-app/commit/b7cbdc8fbbf6c99b9ba712f05d6cca994d60f3ac))

## [1.1.64](https://github.com/dhis2/line-listing-app/compare/v1.1.63...v1.1.64) (2022-05-02)


### Bug Fixes

* prevent fetchError from reemerging when not loading ([#123](https://github.com/dhis2/line-listing-app/issues/123)) ([760d137](https://github.com/dhis2/line-listing-app/commit/760d1377bf95b07339072b361f76d4b511e531ed))

## [1.1.63](https://github.com/dhis2/line-listing-app/compare/v1.1.62...v1.1.63) (2022-05-02)


### Bug Fixes

* fallback to generic server error ([0fc0f75](https://github.com/dhis2/line-listing-app/commit/0fc0f75236bb0470ba1c5b29e45bc389379b4591))
* fallback to generic server error (TECH-1140) [#115](https://github.com/dhis2/line-listing-app/issues/115) ([2c07bc5](https://github.com/dhis2/line-listing-app/commit/2c07bc59fb15ed0c41cce94c6a8580f83de93590))

## [1.1.62](https://github.com/dhis2/line-listing-app/compare/v1.1.61...v1.1.62) (2022-04-29)


### Bug Fixes

* use correct PropTypes and some missing strings ([#114](https://github.com/dhis2/line-listing-app/issues/114)) ([61640ca](https://github.com/dhis2/line-listing-app/commit/61640ca597771613a1ca5c147b75853081a5bec2))

## [1.1.61](https://github.com/dhis2/line-listing-app/compare/v1.1.60...v1.1.61) (2022-04-29)


### Bug Fixes

* datetime formatting ([#119](https://github.com/dhis2/line-listing-app/issues/119)) ([5703f46](https://github.com/dhis2/line-listing-app/commit/5703f468fc735b812fc57b8fa8f20333b516c339))

## [1.1.60](https://github.com/dhis2/line-listing-app/compare/v1.1.59...v1.1.60) (2022-04-29)


### Bug Fixes

* use small circular loader TECH-1137 ([#118](https://github.com/dhis2/line-listing-app/issues/118)) ([06bf647](https://github.com/dhis2/line-listing-app/commit/06bf647a3a54180a7d650bb6318716b54f76ca01))

## [1.1.59](https://github.com/dhis2/line-listing-app/compare/v1.1.58...v1.1.59) (2022-04-29)


### Bug Fixes

* Remove icon for all, and rename to 'All types' with a line underneath ([#117](https://github.com/dhis2/line-listing-app/issues/117)) ([f0766d5](https://github.com/dhis2/line-listing-app/commit/f0766d56ed46738c8c218ea208f56f4a89daef35))

## [1.1.58](https://github.com/dhis2/line-listing-app/compare/v1.1.57...v1.1.58) (2022-04-28)


### Bug Fixes

* add dimension icons in the dimension selector in program ([#102](https://github.com/dhis2/line-listing-app/issues/102)) ([3170ca5](https://github.com/dhis2/line-listing-app/commit/3170ca5706f3a403cc48f6695cae2c4855c68265))
* add tooltip explaining why a time dimension is disabled ([#109](https://github.com/dhis2/line-listing-app/issues/109)) ([ab379b2](https://github.com/dhis2/line-listing-app/commit/ab379b26af88e57ad0e5424a6a58e9f76aad5d4d))
* various interpretations fixes ([#87](https://github.com/dhis2/line-listing-app/issues/87)) ([9e4571a](https://github.com/dhis2/line-listing-app/commit/9e4571a9c636ca2ab09326980a3a3516870ff4aa))

## [1.1.57](https://github.com/dhis2/line-listing-app/compare/v1.1.56...v1.1.57) (2022-04-28)


### Bug Fixes

* avoid crash when opening tooltip or dimension modal in cases where option metadata is missing ([#74](https://github.com/dhis2/line-listing-app/issues/74)) ([8da3c2d](https://github.com/dhis2/line-listing-app/commit/8da3c2d73565d8b8a0a2b30be8fd3f33978103b1))
* repeated events input validation (TECH-1132) ([#111](https://github.com/dhis2/line-listing-app/issues/111)) ([72d5361](https://github.com/dhis2/line-listing-app/commit/72d536186e3d6ed778e657f2f80d2e56bf611b0b))

## [1.1.56](https://github.com/dhis2/line-listing-app/compare/v1.1.55...v1.1.56) (2022-04-28)


### Bug Fixes

* preserve fetched dimensions when collapsing Program Dimensions panel ([#112](https://github.com/dhis2/line-listing-app/issues/112)) ([3d6fb7c](https://github.com/dhis2/line-listing-app/commit/3d6fb7ca5d4fd22b01cf3ead1aadeb7008b6283c))

## [1.1.55](https://github.com/dhis2/line-listing-app/compare/v1.1.54...v1.1.55) (2022-04-28)


### Bug Fixes

* use different color on hover for action buttons TECH-1086 ([#105](https://github.com/dhis2/line-listing-app/issues/105)) ([53cec84](https://github.com/dhis2/line-listing-app/commit/53cec84366c300ba1a994c22dea65cab8a6cba21))

## [1.1.54](https://github.com/dhis2/line-listing-app/compare/v1.1.53...v1.1.54) (2022-04-26)


### Bug Fixes

* collect and dispatch dimension metadata from visualization (TECH-1128) ([#107](https://github.com/dhis2/line-listing-app/issues/107)) ([487c92b](https://github.com/dhis2/line-listing-app/commit/487c92b87acf87a13bd11dd389865e989ebe52dc))

## [1.1.53](https://github.com/dhis2/line-listing-app/compare/v1.1.52...v1.1.53) (2022-04-26)


### Bug Fixes

* missing change from prev commit ([4b291ca](https://github.com/dhis2/line-listing-app/commit/4b291ca31362ec5fc6f5ebe3ef77ee15270b65b9))
* remove shortname from options search as options only has displayName ([c23e882](https://github.com/dhis2/line-listing-app/commit/c23e8828a9c1ff4999c77075c295a54624dd4de1))
* support shortName throughout the app (TECH-1118) [#108](https://github.com/dhis2/line-listing-app/issues/108) ([c55a1a1](https://github.com/dhis2/line-listing-app/commit/c55a1a1e20454f46b116c42fdb5d50b76a8bf62b))
* use name instead of displayName in search ([745eeb4](https://github.com/dhis2/line-listing-app/commit/745eeb42b9d0de97d79db8531a6c888a726ad37e))
* use shortname for program and dynamic/your dimensions ([f4c9053](https://github.com/dhis2/line-listing-app/commit/f4c9053185ce35a22b26341eb05e8c7465a37f8b))
* use shortname for program when fetching AO ([b1e3016](https://github.com/dhis2/line-listing-app/commit/b1e3016f8a745be19ff3fe6b92ebcbc24e46c581))
* use shortname for programs ([0599917](https://github.com/dhis2/line-listing-app/commit/05999176cb1100612cec03f89d381019c2f5ba9a))

## [1.1.52](https://github.com/dhis2/line-listing-app/compare/v1.1.51...v1.1.52) (2022-04-25)


### Bug Fixes

* change input type to search ([266e2a8](https://github.com/dhis2/line-listing-app/commit/266e2a80e951e2f491d6ce46c06eebe50063bf47))
* change input type to search (TECH-1120) [#106](https://github.com/dhis2/line-listing-app/issues/106) ([8fe5bb0](https://github.com/dhis2/line-listing-app/commit/8fe5bb011032b047e545800ea8ef45a640b6518a))

## [1.1.51](https://github.com/dhis2/line-listing-app/compare/v1.1.50...v1.1.51) (2022-04-20)


### Bug Fixes

* format date and datetime [#101](https://github.com/dhis2/line-listing-app/issues/101) ([93e646b](https://github.com/dhis2/line-listing-app/commit/93e646b14e3e9eabc4ea15cf58e8c269d1c7ee2c))
* format tooltip for time and datetime dims ([404753e](https://github.com/dhis2/line-listing-app/commit/404753e45255c883f8ebb65150bd98a8d7e0353a))
* set max to date and datetime conditions ([f5e2352](https://github.com/dhis2/line-listing-app/commit/f5e2352f6d177b8476f6d9e300029cbc68e823c6))

## [1.1.50](https://github.com/dhis2/line-listing-app/compare/v1.1.49...v1.1.50) (2022-04-19)


### Bug Fixes

* add missing padding to chip ([#100](https://github.com/dhis2/line-listing-app/issues/100)) ([392a2df](https://github.com/dhis2/line-listing-app/commit/392a2df4b849f125a7c4e9070b90e9b76d749c17))

## [1.1.49](https://github.com/dhis2/line-listing-app/compare/v1.1.48...v1.1.49) (2022-04-19)


### Bug Fixes

* check system settings for hidden periods ([#99](https://github.com/dhis2/line-listing-app/issues/99)) ([db7451d](https://github.com/dhis2/line-listing-app/commit/db7451dcd0d7563162307eb0c37b6cf497e65d6d))

## [1.1.48](https://github.com/dhis2/line-listing-app/compare/v1.1.47...v1.1.48) (2022-04-19)


### Bug Fixes

* allow saving when a program has been selected ([9eedbbe](https://github.com/dhis2/line-listing-app/commit/9eedbbe1847071be9d82725d8d380777dacf6ab6))
* clear current in redux store [#82](https://github.com/dhis2/line-listing-app/issues/82) (TECH-1069) ([5610f5e](https://github.com/dhis2/line-listing-app/commit/5610f5e8bce5d79de5e084776003479815fe6626))
* clear current when ui config is invalid ([ea9c0c0](https://github.com/dhis2/line-listing-app/commit/ea9c0c06fc55690b9adaf89489064bf193fc64db))

## [1.1.47](https://github.com/dhis2/line-listing-app/compare/v1.1.46...v1.1.47) (2022-04-19)


### Bug Fixes

* fix vertical alignment of interpretation action buttons TECH-1085 ([#98](https://github.com/dhis2/line-listing-app/issues/98)) ([71a28ac](https://github.com/dhis2/line-listing-app/commit/71a28acf2033a57a35eece4342710571c5de41b8))
* use system settings for DGS option TECH-1091 ([#96](https://github.com/dhis2/line-listing-app/issues/96)) ([d4f4c10](https://github.com/dhis2/line-listing-app/commit/d4f4c10a50f75f74c82cd1a469bb05d827f25eac))

## [1.1.46](https://github.com/dhis2/line-listing-app/compare/v1.1.45...v1.1.46) (2022-04-13)


### Bug Fixes

* filter out longitude and latitude dimensions ([#97](https://github.com/dhis2/line-listing-app/issues/97)) ([00376a0](https://github.com/dhis2/line-listing-app/commit/00376a0887c202266a2c112db8854ec941f8c32a))

## [1.1.45](https://github.com/dhis2/line-listing-app/compare/v1.1.44...v1.1.45) (2022-04-13)


### Bug Fixes

* add missing margin to dimension menu ([506b501](https://github.com/dhis2/line-listing-app/commit/506b501d4c6cb39eed6ef4e75d0820bf852e7f4e))
* add missing margin to dimension menu [#95](https://github.com/dhis2/line-listing-app/issues/95) ([3fca5d6](https://github.com/dhis2/line-listing-app/commit/3fca5d6a1ca796b408f570047290aace47af2ebf))

## [1.1.44](https://github.com/dhis2/line-listing-app/compare/v1.1.43...v1.1.44) (2022-04-13)


### Bug Fixes

* catch error code for indicator error and display a custom error msg ([2daa6d5](https://github.com/dhis2/line-listing-app/commit/2daa6d51acb63af6600ab67504646b871c2dbdb4))
* catch error code for indicator error and display a custom error msg (TECH-1097) [#94](https://github.com/dhis2/line-listing-app/issues/94) ([fa30427](https://github.com/dhis2/line-listing-app/commit/fa304274bea44949bfa344486991f2a79967ac3b))
* use data icon ([a3902b4](https://github.com/dhis2/line-listing-app/commit/a3902b452f7737a6eb0b6c4dd191e0bd5e355910))

## [1.1.43](https://github.com/dhis2/line-listing-app/compare/v1.1.42...v1.1.43) (2022-04-13)


### Bug Fixes

* evaluate code instead of value ([2f47cb7](https://github.com/dhis2/line-listing-app/commit/2f47cb7ce5f079bff56cdbd1fee575b6617fba9e))
* option set to use code instead of value for paging (TECH-1082) [#90](https://github.com/dhis2/line-listing-app/issues/90) ([1d6da88](https://github.com/dhis2/line-listing-app/commit/1d6da88c06cc24b2f8308cd1937b1f856129c9ee))

## [1.1.42](https://github.com/dhis2/line-listing-app/compare/v1.1.41...v1.1.42) (2022-04-12)


### Bug Fixes

* reset page when changing page size TECH-1081 ([#93](https://github.com/dhis2/line-listing-app/issues/93)) ([13e44fe](https://github.com/dhis2/line-listing-app/commit/13e44fe5495b571bc578aa956096c064d2ad8020))

## [1.1.41](https://github.com/dhis2/line-listing-app/compare/v1.1.40...v1.1.41) (2022-04-12)


### Bug Fixes

* mouse pointer and clickable area for chip ([33f625a](https://github.com/dhis2/line-listing-app/commit/33f625a2352dc4516b9f5594f3979fcf238b4eb7))
* mouse pointer and clickable area for chip (TECH-1083) [#91](https://github.com/dhis2/line-listing-app/issues/91) ([e6ee222](https://github.com/dhis2/line-listing-app/commit/e6ee2220ec2adf3bd2ffa96fe3fe457eed959548))

## [1.1.40](https://github.com/dhis2/line-listing-app/compare/v1.1.39...v1.1.40) (2022-04-11)


### Bug Fixes

* remove legacy flag when saving a copy TECH-1092 ([#89](https://github.com/dhis2/line-listing-app/issues/89)) ([e897f5c](https://github.com/dhis2/line-listing-app/commit/e897f5c32dea441f4a067523f2fe4d1b3020bad6))

## [1.1.39](https://github.com/dhis2/line-listing-app/compare/v1.1.38...v1.1.39) (2022-04-11)


### Bug Fixes

* prevent duplicate updates ([507dd8d](https://github.com/dhis2/line-listing-app/commit/507dd8dd42e3a343a9a5f5845c0dc95903d3f125))
* prevent time dims from being wiped when reopening modal ([f7638aa](https://github.com/dhis2/line-listing-app/commit/f7638aa1d35662dfa487370d289377caaae64a87))
* prevent time dims from being wiped when reopening modal (TECH-1061) [#64](https://github.com/dhis2/line-listing-app/issues/64) ([8989654](https://github.com/dhis2/line-listing-app/commit/898965449ddecdd80a78754f2dafdf205edcaed3))
* reverse useEffect change to avoid lint error ([f48e4d3](https://github.com/dhis2/line-listing-app/commit/f48e4d3b9efd734dd99037b2afd53785c0a4cec0))

## [1.1.38](https://github.com/dhis2/line-listing-app/compare/v1.1.37...v1.1.38) (2022-04-08)


### Bug Fixes

* change color of ATL button ([2335afc](https://github.com/dhis2/line-listing-app/commit/2335afca8dc7221242a93c2e86cf2f4d9b95d109))
* prevent add to layout button from triggering an update (TECH-1084) [#86](https://github.com/dhis2/line-listing-app/issues/86) ([ed48660](https://github.com/dhis2/line-listing-app/commit/ed48660b65e006bfb5898df73b08316826b6131e))
* prevent ATL from triggering update ([561da05](https://github.com/dhis2/line-listing-app/commit/561da0560bfeb7049f83deba68ab1eaa2d610545))

## [1.1.37](https://github.com/dhis2/line-listing-app/compare/v1.1.36...v1.1.37) (2022-04-08)


### Bug Fixes

* download url ([#55](https://github.com/dhis2/line-listing-app/issues/55)) ([95bb80a](https://github.com/dhis2/line-listing-app/commit/95bb80a1945e36f3d5ae30a4ba0bd23b1d524c84))

## [1.1.36](https://github.com/dhis2/line-listing-app/compare/v1.1.35...v1.1.36) (2022-04-06)


### Bug Fixes

* interpretations fixes TECH-1055 ([#58](https://github.com/dhis2/line-listing-app/issues/58)) ([0aee0b7](https://github.com/dhis2/line-listing-app/commit/0aee0b7e77afbf0e81977463912aff03a0cd64a3))

## [1.1.35](https://github.com/dhis2/line-listing-app/compare/v1.1.34...v1.1.35) (2022-04-06)


### Bug Fixes

* change max date to 9999 ([a85335c](https://github.com/dhis2/line-listing-app/commit/a85335c66c145a9572156d12a9bb219904052704))
* date max (TECH-1068) [#85](https://github.com/dhis2/line-listing-app/issues/85) ([1b97eaf](https://github.com/dhis2/line-listing-app/commit/1b97eaf61302681a74df63812b6813a60d3798b5))
* prevent dates in the very distant future to be entered ([ae8db2a](https://github.com/dhis2/line-listing-app/commit/ae8db2a49f749583b12bb9b04853b4cedc30b815))
* reverse the ambiguous message for period error ([74da72d](https://github.com/dhis2/line-listing-app/commit/74da72da0ecd190b8dbf6857e494447cb6142a9e))

## [1.1.34](https://github.com/dhis2/line-listing-app/compare/v1.1.33...v1.1.34) (2022-04-05)


### Bug Fixes

* use correct PropTypes and translation strings ([#84](https://github.com/dhis2/line-listing-app/issues/84)) ([b02a9a0](https://github.com/dhis2/line-listing-app/commit/b02a9a0f7b9866fd6f58b3804a1fb13c257ae326))

## [1.1.33](https://github.com/dhis2/line-listing-app/compare/v1.1.32...v1.1.33) (2022-04-05)


### Bug Fixes

* message should handle case where an invalid date has been selected ([#83](https://github.com/dhis2/line-listing-app/issues/83)) ([e1d4802](https://github.com/dhis2/line-listing-app/commit/e1d4802786c02741a4845a2a3cc37cd7e1195456))

## [1.1.32](https://github.com/dhis2/line-listing-app/compare/v1.1.31...v1.1.32) (2022-04-04)


### Bug Fixes

* do not pass unnecessary props to 'save as' ([#81](https://github.com/dhis2/line-listing-app/issues/81)) ([5f5172c](https://github.com/dhis2/line-listing-app/commit/5f5172cf8915ea76989f8bfbbee54bd8aba1acca))

## [1.1.31](https://github.com/dhis2/line-listing-app/compare/v1.1.30...v1.1.31) (2022-04-04)


### Bug Fixes

* use special namespace separator for strings with colons ([#78](https://github.com/dhis2/line-listing-app/issues/78)) ([3791031](https://github.com/dhis2/line-listing-app/commit/3791031eb9b7a860cf5c757da669ee07738d26c2))

## [1.1.30](https://github.com/dhis2/line-listing-app/compare/v1.1.29...v1.1.30) (2022-04-01)


### Bug Fixes

* add util for extracting dimension parts ([abe3d5f](https://github.com/dhis2/line-listing-app/commit/abe3d5f8732b76d0dd06215548476ce640fd4c23))
* only store repetition if its other than default ([a3d508d](https://github.com/dhis2/line-listing-app/commit/a3d508d132ee173351f2dbac6e632409757b3a15))
* repetition index issues (TECH-1066) [#75](https://github.com/dhis2/line-listing-app/issues/75) ([e9b5c48](https://github.com/dhis2/line-listing-app/commit/e9b5c48433f0e92262f0d4490252b93f9703d45e))
* use a separator that is not a colon for this string ([#77](https://github.com/dhis2/line-listing-app/issues/77)) ([c7f5a5a](https://github.com/dhis2/line-listing-app/commit/c7f5a5a422c0b28ae4ea7e87e45c6591e61d9837))

## [1.1.29](https://github.com/dhis2/line-listing-app/compare/v1.1.28...v1.1.29) (2022-04-01)


### Bug Fixes

* upgrade analytics with the fix ([#76](https://github.com/dhis2/line-listing-app/issues/76)) ([c1b0a84](https://github.com/dhis2/line-listing-app/commit/c1b0a84cfc2f1e87be6133736dbaf309ad911775))

## [1.1.28](https://github.com/dhis2/line-listing-app/compare/v1.1.27...v1.1.28) (2022-03-30)


### Bug Fixes

* use pointersensor so most devices can use dnd ([#69](https://github.com/dhis2/line-listing-app/issues/69)) ([65400b9](https://github.com/dhis2/line-listing-app/commit/65400b9e850750d2e6bba023348b6e29a90d87c5))

## [1.1.27](https://github.com/dhis2/line-listing-app/compare/v1.1.26...v1.1.27) (2022-03-30)


### Bug Fixes

* open modal for most recent header TECH-1065 ([#73](https://github.com/dhis2/line-listing-app/issues/73)) ([52e3c13](https://github.com/dhis2/line-listing-app/commit/52e3c13e0806a2e0d062c4ff3a76017bf23a1674))

## [1.1.26](https://github.com/dhis2/line-listing-app/compare/v1.1.25...v1.1.26) (2022-03-30)


### Bug Fixes

* always show program stage in tooltip ([3a2c071](https://github.com/dhis2/line-listing-app/commit/3a2c071ffcf214d523b29a79b0c2c3feeb570728))
* prevent metadata to be edited when dimension props are assigned ([5176f16](https://github.com/dhis2/line-listing-app/commit/5176f1637cd2680c3b35adfcd0fdfea8868b39af))
* show program stage in data table header for duplicates ([f753050](https://github.com/dhis2/line-listing-app/commit/f7530509317be237f5064523e803689382a21fa6))
* show program stage in modal title ([4e09b66](https://github.com/dhis2/line-listing-app/commit/4e09b660478c993213c7f0ecf555e9eeea66bef2))
* various updates to duplicate dimensions (TECH-1032) [#67](https://github.com/dhis2/line-listing-app/issues/67) ([97aa1a3](https://github.com/dhis2/line-listing-app/commit/97aa1a37cad8861c882bf7f160f585ac821dc56f))

## [1.1.25](https://github.com/dhis2/line-listing-app/compare/v1.1.24...v1.1.25) (2022-03-30)


### Bug Fixes

* align vertically toolbar buttons TECH-1048 ([#57](https://github.com/dhis2/line-listing-app/issues/57)) ([1fe394d](https://github.com/dhis2/line-listing-app/commit/1fe394d6f82bd6639a835ac966d89dce3b047f5e))

## [1.1.24](https://github.com/dhis2/line-listing-app/compare/v1.1.23...v1.1.24) (2022-03-29)


### Bug Fixes

* do not show Invalid date for empty dates (TECH-1060) ([#70](https://github.com/dhis2/line-listing-app/issues/70)) ([20d59df](https://github.com/dhis2/line-listing-app/commit/20d59df30835abd1be018f8d9fec163e4505bf8c))
* interpretation modal scrolling ([#71](https://github.com/dhis2/line-listing-app/issues/71)) ([97abf56](https://github.com/dhis2/line-listing-app/commit/97abf56e60a9e5ac0ac1e1f920f2a9f08905a720))

## [1.1.23](https://github.com/dhis2/line-listing-app/compare/v1.1.22...v1.1.23) (2022-03-29)


### Bug Fixes

* reinitialize metadata when new, opening, and deleting an AO ([#62](https://github.com/dhis2/line-listing-app/issues/62)) ([570d39a](https://github.com/dhis2/line-listing-app/commit/570d39a27a1e506ed6fae3fe07364b0b45287343))

## [1.1.22](https://github.com/dhis2/line-listing-app/compare/v1.1.21...v1.1.22) (2022-03-29)


### Bug Fixes

* programStage issues when saving/loading AO ([#63](https://github.com/dhis2/line-listing-app/issues/63)) ([48ab110](https://github.com/dhis2/line-listing-app/commit/48ab11032f389b641375d33869a86f57f6c9cbbe))

## [1.1.21](https://github.com/dhis2/line-listing-app/compare/v1.1.20...v1.1.21) (2022-03-23)


### Bug Fixes

* pass correct page length ([#60](https://github.com/dhis2/line-listing-app/issues/60)) ([098b480](https://github.com/dhis2/line-listing-app/commit/098b48088d8679fa73d07e5651c2e7b5e79c55db))

## [1.1.20](https://github.com/dhis2/line-listing-app/compare/v1.1.19...v1.1.20) (2022-03-22)


### Bug Fixes

* make URL values in datatable clickable TECH-1054 ([9c3f244](https://github.com/dhis2/line-listing-app/commit/9c3f2445befdd4a1347743adeac79f678f39cba0))
* make URL values in datatable clickable TECH-1054 ([b3f1192](https://github.com/dhis2/line-listing-app/commit/b3f11924808919cc14c8ec71aff3e49c5e58e12f))

## [1.1.19](https://github.com/dhis2/line-listing-app/compare/v1.1.18...v1.1.19) (2022-03-22)


### Bug Fixes

* open correct tab, enable date to be removed ([53a5234](https://github.com/dhis2/line-listing-app/commit/53a5234922ba71d81339ca9990b88ecb6b4a3972))
* open correct tab, enable date to be removed (TECH-1044, TECH-1052) [#54](https://github.com/dhis2/line-listing-app/issues/54) ([ef5c0c6](https://github.com/dhis2/line-listing-app/commit/ef5c0c6a9808769c0e775b474a4fc02c73e61829))

## [1.1.18](https://github.com/dhis2/line-listing-app/compare/v1.1.17...v1.1.18) (2022-03-18)


### Bug Fixes

* use prefixed sort dimension ([#49](https://github.com/dhis2/line-listing-app/issues/49)) ([0feb680](https://github.com/dhis2/line-listing-app/commit/0feb680c2876b67027690e9b293302c508742442))

## [1.1.17](https://github.com/dhis2/line-listing-app/compare/v1.1.16...v1.1.17) (2022-03-18)


### Bug Fixes

* after -or- including ([#48](https://github.com/dhis2/line-listing-app/issues/48)) ([a1fabd0](https://github.com/dhis2/line-listing-app/commit/a1fabd06d331cf547ea781f008b1f34d9e191c8e))

## [1.1.16](https://github.com/dhis2/line-listing-app/compare/v1.1.15...v1.1.16) (2022-03-18)


### Bug Fixes

* revert rename lastUpdated to lastUpdatedDate TECH-1040 ([#47](https://github.com/dhis2/line-listing-app/issues/47)) ([13c5104](https://github.com/dhis2/line-listing-app/commit/13c5104389a9701f0c7553d04332ef49d02cebbe))

## [1.1.15](https://github.com/dhis2/line-listing-app/compare/v1.1.14...v1.1.15) (2022-03-17)


### Bug Fixes

* add cat and cogs filters ([#46](https://github.com/dhis2/line-listing-app/issues/46)) ([053e299](https://github.com/dhis2/line-listing-app/commit/053e299742e7c7b47fd70c05319a5bcf8b17124b))
* don't call hook conditionally ([153e25c](https://github.com/dhis2/line-listing-app/commit/153e25caa08ee98c2111b491e917f730dd7f8026))
* don't call hooks conditionally ([#44](https://github.com/dhis2/line-listing-app/issues/44)) ([9678455](https://github.com/dhis2/line-listing-app/commit/967845560a4fa0035ff6243186ea712eac3d56b3))
* remove vis type filter in OpenFileDialog and filter only LL AOs ([#39](https://github.com/dhis2/line-listing-app/issues/39)) ([49a192c](https://github.com/dhis2/line-listing-app/commit/49a192c6cd26c0d8d5294d84c390ccb62024943d))
* restore time dimensions defaults when clearing the ui for a new visualization ([#45](https://github.com/dhis2/line-listing-app/issues/45)) ([33640a3](https://github.com/dhis2/line-listing-app/commit/33640a349c8b56e2ad7fa90a96fa6b05ec36da07))

## [1.1.14](https://github.com/dhis2/line-listing-app/compare/v1.1.13...v1.1.14) (2022-03-16)


### Bug Fixes

* prevent extra api request and render of vis table when sorting and updating ([#40](https://github.com/dhis2/line-listing-app/issues/40)) ([d99ff02](https://github.com/dhis2/line-listing-app/commit/d99ff0203f4dcfd3c13db82ba3107fd0cd217944))

## [1.1.13](https://github.com/dhis2/line-listing-app/compare/v1.1.12...v1.1.13) (2022-03-16)


### Bug Fixes

* rename lastUpdated to lastUpdatedDate TECH-1040 ([#38](https://github.com/dhis2/line-listing-app/issues/38)) ([454ebb1](https://github.com/dhis2/line-listing-app/commit/454ebb1b91184be36168e6f2167bee59e3ba9959))

## [1.1.12](https://github.com/dhis2/line-listing-app/compare/v1.1.11...v1.1.12) (2022-03-16)


### Bug Fixes

* hide attributes for event programs ([#37](https://github.com/dhis2/line-listing-app/issues/37)) ([b99815d](https://github.com/dhis2/line-listing-app/commit/b99815d8118d7f44bc4a4ca695b88f412973dbad))

## [1.1.11](https://github.com/dhis2/line-listing-app/compare/v1.1.10...v1.1.11) (2022-03-14)


### Bug Fixes

* add time dimension metadata when opening ao ([#36](https://github.com/dhis2/line-listing-app/issues/36)) ([6530511](https://github.com/dhis2/line-listing-app/commit/6530511c86989aa344c3574a25bfb4d5dd9ec74f))

## [1.1.10](https://github.com/dhis2/line-listing-app/compare/v1.1.9...v1.1.10) (2022-03-11)


### Bug Fixes

* disable Save if no current ([#30](https://github.com/dhis2/line-listing-app/issues/30)) ([fd613fa](https://github.com/dhis2/line-listing-app/commit/fd613fa9dd897f4e860f1b938a7f6a66d4f3f7db))

## [1.1.9](https://github.com/dhis2/line-listing-app/compare/v1.1.8...v1.1.9) (2022-03-11)


### Bug Fixes

* input description ([#29](https://github.com/dhis2/line-listing-app/issues/29)) ([0230e39](https://github.com/dhis2/line-listing-app/commit/0230e3969f3e5bd6eea2deccee7980372a88055e))

## [1.1.8](https://github.com/dhis2/line-listing-app/compare/v1.1.7...v1.1.8) (2022-03-10)


### Bug Fixes

* remove core app flag to allow app deployment ([#28](https://github.com/dhis2/line-listing-app/issues/28)) ([c64869c](https://github.com/dhis2/line-listing-app/commit/c64869ce456c5a75e7dc04ae2d833d59f975c72c))

## [1.1.7](https://github.com/dhis2/line-listing-app/compare/v1.1.6...v1.1.7) (2022-03-10)


### Bug Fixes

* remove vis type selector, rename app ([#27](https://github.com/dhis2/line-listing-app/issues/27)) ([3110a73](https://github.com/dhis2/line-listing-app/commit/3110a73c19afeea9e4d7c51fd159e0688841f962))

## [1.1.6](https://github.com/dhis2/line-listing-app/compare/v1.1.5...v1.1.6) (2022-03-10)


### Bug Fixes

* set cursor on the chip directly ([#26](https://github.com/dhis2/line-listing-app/issues/26)) ([8cae391](https://github.com/dhis2/line-listing-app/commit/8cae39184b8f19d24bc842be8fd8e724d9228ddc))

## [1.1.5](https://github.com/dhis2/line-listing-app/compare/v1.1.4...v1.1.5) (2022-03-10)


### Bug Fixes

* chip label with stage name and correct suffix ([#11](https://github.com/dhis2/line-listing-app/issues/11)) ([bd68007](https://github.com/dhis2/line-listing-app/commit/bd680074ed7ecd80c4b196eb9b64cbbf75f2fe6a))

## [1.1.4](https://github.com/dhis2/line-listing-app/compare/v1.1.3...v1.1.4) (2022-03-09)


### Bug Fixes

* remove stage index from dimension id used for modal ([#13](https://github.com/dhis2/line-listing-app/issues/13)) ([4ce12c1](https://github.com/dhis2/line-listing-app/commit/4ce12c1a6976a406facf714f648f1a07474e003c))

## [1.1.3](https://github.com/dhis2/line-listing-app/compare/v1.1.2...v1.1.3) (2022-03-09)


### Bug Fixes

* default operators to numeric for program indicators that dont have value type ([c5d1020](https://github.com/dhis2/line-listing-app/commit/c5d102039adb5bb9e0c979e7611dc8f54e887fd6))
* make layout scrollable and collapsible at full height ([cb164dc](https://github.com/dhis2/line-listing-app/commit/cb164dc674993d240792a501faad297cbfe32dc1))
* operators for program indicators [#16](https://github.com/dhis2/line-listing-app/issues/16) ([ffc5d91](https://github.com/dhis2/line-listing-app/commit/ffc5d91c0d3ae8cfe0a70e8d440c4c343a59aa1b))

## [1.1.2](https://github.com/dhis2/line-listing-app/compare/v1.1.1...v1.1.2) (2022-03-07)


### Bug Fixes

* prevent scrolling while dragging item from program dimensions panel ([#15](https://github.com/dhis2/line-listing-app/issues/15)) ([5163658](https://github.com/dhis2/line-listing-app/commit/516365843124a3f855dc439dc0f751c841032c1b))
* reset page to 1 when a sorting is applied (TECH-1025) ([#17](https://github.com/dhis2/line-listing-app/issues/17)) ([4855211](https://github.com/dhis2/line-listing-app/commit/4855211d8584cce2a660707e03be4f898d9b7854))

## [1.1.1](https://github.com/dhis2/line-listing-app/compare/v1.1.0...v1.1.1) (2022-03-05)


### Bug Fixes

* bump Analytics to latest ([#14](https://github.com/dhis2/line-listing-app/issues/14)) ([bc8110d](https://github.com/dhis2/line-listing-app/commit/bc8110df351ddecbd5dd44cce7fc973d3c3775eb))

# [1.1.0](https://github.com/dhis2/line-listing-app/compare/v1.0.1...v1.1.0) (2022-03-04)


### Features

* click on header name opens dimension modal ([#7](https://github.com/dhis2/line-listing-app/issues/7)) ([766fe98](https://github.com/dhis2/line-listing-app/commit/766fe98e33e85f6496aa71210bc86f1ba0992d7b))

## [1.0.1](https://github.com/dhis2/line-listing-app/compare/v1.0.0...v1.0.1) (2022-03-04)


### Bug Fixes

* adjust css according to spec ([#9](https://github.com/dhis2/line-listing-app/issues/9)) ([22097d9](https://github.com/dhis2/line-listing-app/commit/22097d965b46f010e16cd40ab8a5308cbd9a6196))
* format date values (TECH-1008) ([#12](https://github.com/dhis2/line-listing-app/issues/12)) ([dcaf06c](https://github.com/dhis2/line-listing-app/commit/dcaf06ca84a46000ac6137ee717b29c17d8b70fc))

# 1.0.0 (2022-03-03)


### Bug Fixes

* add comment ([8fbd52e](https://github.com/dhis2/line-listing-app/commit/8fbd52e07eca4ee20b00274c115042295ddf4727))
* add dimension to metadata when adding from chip menu ([#996](https://github.com/dhis2/line-listing-app/issues/996)) ([3fc4512](https://github.com/dhis2/line-listing-app/commit/3fc4512dfb78f0afc65add064af5d86fd8195ebe))
* add metadata for status ids ([558c153](https://github.com/dhis2/line-listing-app/commit/558c153a1afc7ca1097f861fbb9e1ff613b9305f))
* add repetition field ([#979](https://github.com/dhis2/line-listing-app/issues/979)) ([f9783e6](https://github.com/dhis2/line-listing-app/commit/f9783e61156fbe726b6a50d26dea19b1c69b8621))
* add valueType to the data property for setting metadata ([c5ad27d](https://github.com/dhis2/line-listing-app/commit/c5ad27d9c5083cf955578171c0ed0e9bd8a74cf7))
* address interpretation modal regressions ([#1006](https://github.com/dhis2/line-listing-app/issues/1006)) ([aed7712](https://github.com/dhis2/line-listing-app/commit/aed7712e33406bea4df4b0071104ae467fd9092c))
* avoid storing incomplete start-end dates ([c42bddb](https://github.com/dhis2/line-listing-app/commit/c42bddb8f97585aa5ca2005ca14c4d42631267c1))
* axis width ([#965](https://github.com/dhis2/line-listing-app/issues/965)) ([d1bcc26](https://github.com/dhis2/line-listing-app/commit/d1bcc26043a773e18c63fe8e72dae4f4f878e912))
* check for dimension value `pe` not `PERIOD` ([8fa2c4f](https://github.com/dhis2/line-listing-app/commit/8fa2c4ffdc9013750709bdaddeea2742242b805c))
* clear program dimensions from layout and itemsBy dimension on clear ([0793db4](https://github.com/dhis2/line-listing-app/commit/0793db4495ec87f5e9482531b7c98a0601102fd1))
* conflict ([3e77fda](https://github.com/dhis2/line-listing-app/commit/3e77fda951e83d4d17af092338f0aa2371ecba36))
* convert dimension type 'PERIOD' from old AOs to 'pe' ([#948](https://github.com/dhis2/line-listing-app/issues/948)) ([5c42d8a](https://github.com/dhis2/line-listing-app/commit/5c42d8a98cec03cd99130f968c1012649829a048))
* createdB lastUpdatedBy dimension handling for analytics ([#957](https://github.com/dhis2/line-listing-app/issues/957)) ([08c582b](https://github.com/dhis2/line-listing-app/commit/08c582bf6aeda61cfe95ff817c9aad8c58ef5240))
* dimensions that are in the layout should show as "selected" (teal background) in the dimensions panel ([#951](https://github.com/dhis2/line-listing-app/issues/951)) ([6133230](https://github.com/dhis2/line-listing-app/commit/6133230b5b30f2492c7042ba421b06f5d3810c94))
* do not update current when validate layout fails ([#975](https://github.com/dhis2/line-listing-app/issues/975)) ([8186c16](https://github.com/dhis2/line-listing-app/commit/8186c16600f2150d1bcf85bc0d261f0d1c8ff29d))
* drag and drop usability improvements ([#968](https://github.com/dhis2/line-listing-app/issues/968)) ([8e28c2f](https://github.com/dhis2/line-listing-app/commit/8e28c2f7f57c29ffed1c1f20b1ec63a7f28e1720))
* event status ([#976](https://github.com/dhis2/line-listing-app/issues/976)) ([d1a95bf](https://github.com/dhis2/line-listing-app/commit/d1a95bf5fc5370c25a97f337e1840ab872b7be03))
* fetch legendset without stageId ([edaf8f6](https://github.com/dhis2/line-listing-app/commit/edaf8f61386f1667bd1ca5acf3b03d7c7de1ca89))
* fix condition and items lookup by dimension ([#958](https://github.com/dhis2/line-listing-app/issues/958)) ([cb09f82](https://github.com/dhis2/line-listing-app/commit/cb09f82fa38eb8394e0788a9398c0e8e25ab5b96))
* format analytics header with repetitions ([#978](https://github.com/dhis2/line-listing-app/issues/978)) ([0ad1285](https://github.com/dhis2/line-listing-app/commit/0ad1285ca080de8d916bb7b3cddd7b7f2b059207))
* format dimension object with programStage ([#949](https://github.com/dhis2/line-listing-app/issues/949)) ([3e3902f](https://github.com/dhis2/line-listing-app/commit/3e3902fb03aafcd1c6d6f8ee1c37b07b49cdaece))
* found 2 issues which prevented reload after Save to work ([#963](https://github.com/dhis2/line-listing-app/issues/963)) ([7870987](https://github.com/dhis2/line-listing-app/commit/7870987d70f055bb9b256ddb29dc864bab48d2b1))
* lookup in metadata for column header names ([#974](https://github.com/dhis2/line-listing-app/issues/974)) ([00c46a4](https://github.com/dhis2/line-listing-app/commit/00c46a4ddc90832a3da97691ce2329b1ccf57135))
* lookup row value in metadata for program and event status ([#970](https://github.com/dhis2/line-listing-app/issues/970)) ([0c0b6f9](https://github.com/dhis2/line-listing-app/commit/0c0b6f9cb7760bda3fbc6f4a4520eabd11aad3a7))
* parse repetition when loading a visualization ([029afa5](https://github.com/dhis2/line-listing-app/commit/029afa5e655298c9fef23c05c12c1aee9cfaa36a))
* period dimension dynamic names and enabled state ([#961](https://github.com/dhis2/line-listing-app/issues/961)) ([70af19c](https://github.com/dhis2/line-listing-app/commit/70af19cc14c641651d623333d8c55faf466faf6d))
* prefix programStageId to dimensionId in analytics headers ([3f72ac6](https://github.com/dhis2/line-listing-app/commit/3f72ac6095d80bbe7f64ff1cdd9a40e7e06b8432))
* prefix programStageId to dimensionId in analytics headers [#950](https://github.com/dhis2/line-listing-app/issues/950) ([8a772d8](https://github.com/dhis2/line-listing-app/commit/8a772d8569ff0a2796d65561103df1d74dcb6d60))
* program stage analytics handling ([#942](https://github.com/dhis2/line-listing-app/issues/942)) ([f6b6a10](https://github.com/dhis2/line-listing-app/commit/f6b6a10df35ef3e735f36bd26babe8b26b8aea1e))
* read dimensions from layout and clear after stage change ([d8cdfa0](https://github.com/dhis2/line-listing-app/commit/d8cdfa0d6e014f0b324ee28fb0b5b807859fce0e))
* readd DIMENSION_TYPES_TIME ([99d001b](https://github.com/dhis2/line-listing-app/commit/99d001b651988e0c14e5c1e0c26b0eb75355b75a))
* remove console warnings due to component props ([#953](https://github.com/dhis2/line-listing-app/issues/953)) ([b7b96e8](https://github.com/dhis2/line-listing-app/commit/b7b96e80056f613cdd4e37432dbe8bd1f511a62c))
* remove grey area below the vis type selector ([#980](https://github.com/dhis2/line-listing-app/issues/980)) ([0806ae6](https://github.com/dhis2/line-listing-app/commit/0806ae6bbf13d3760b5b4fcf71ebf5837fef2a5c))
* remove value type from option set check ([4ba82bf](https://github.com/dhis2/line-listing-app/commit/4ba82bf83ae8c035287b57cf7bde232f901a3ddd))
* restore time dimensions tests excl scheduled dat ([#969](https://github.com/dhis2/line-listing-app/issues/969)) ([c27e00a](https://github.com/dhis2/line-listing-app/commit/c27e00af0e16db84e58953f72757f1df1824b3db))
* scrollbar css ([#977](https://github.com/dhis2/line-listing-app/issues/977)) ([7be51d0](https://github.com/dhis2/line-listing-app/commit/7be51d0857c6bcbf06b235d31fa024f5c032ce15))
* scrollbar style ([#966](https://github.com/dhis2/line-listing-app/issues/966)) ([9aef8bd](https://github.com/dhis2/line-listing-app/commit/9aef8bdde8fcc931cfc9f7c2a28ec6d34ca8a310))
* set initial value in reducer function ([02c9130](https://github.com/dhis2/line-listing-app/commit/02c9130253b35d6d3a368778539f67f3e53dce64))
* time dimensions ([#962](https://github.com/dhis2/line-listing-app/issues/962)) ([6e49f1a](https://github.com/dhis2/line-listing-app/commit/6e49f1afea1ca76c01a0e27faaa3824169032111))
* update period validation ([#960](https://github.com/dhis2/line-listing-app/issues/960)) ([64e229a](https://github.com/dhis2/line-listing-app/commit/64e229ad1b5d45f73a37674b1014d623b526757d))
* use correct id for matching repetition to dimension ([47659ef](https://github.com/dhis2/line-listing-app/commit/47659ef9544dbd53a35f40a9b53feb0adf507fd7))
* use correct name for header ([489f486](https://github.com/dhis2/line-listing-app/commit/489f4868764d8eba259be809d9038382ee6e9df2))
* use same styles as ui for Toolbar buttons ([25bb265](https://github.com/dhis2/line-listing-app/commit/25bb2651ae096111c32e3680c7e87cc6da5c36c5))
* **visualization:** use analytics requests with a pager without total ([#1018](https://github.com/dhis2/line-listing-app/issues/1018)) ([4370f0d](https://github.com/dhis2/line-listing-app/commit/4370f0dce8e0726bd5d085a2e4f2426cc4687b3b))
* add additional check to determine which time dimensions to clear ([#1002](https://github.com/dhis2/line-listing-app/issues/1002)) ([55ecbcf](https://github.com/dhis2/line-listing-app/commit/55ecbcfe412e1c2510411c8303713bf127a48e37))
* add button for opening Sharing dialog for interpretation ([#997](https://github.com/dhis2/line-listing-app/issues/997)) ([b896e52](https://github.com/dhis2/line-listing-app/commit/b896e5242db7f658d3097c096b4071cdd0baa6d3))
* add default time dimensions metadata ([53fa560](https://github.com/dhis2/line-listing-app/commit/53fa560357d6c9f5a92d24a375e2ac8a49528caa))
* add default value for conditions ([29058e0](https://github.com/dhis2/line-listing-app/commit/29058e0eb2af07603e9a532cb7c72bb1fe74f27f))
* add fix for visualization error ([d19a1d2](https://github.com/dhis2/line-listing-app/commit/d19a1d28eff734666114d50be28e158839e853e5))
* add layout validation and error handling through UVC ([ddbc2c3](https://github.com/dhis2/line-listing-app/commit/ddbc2c3e0e99d5152f4976401e4a92c9eef6fbe9))
* add logic for toggling the tabs and disabled state ([0c789a1](https://github.com/dhis2/line-listing-app/commit/0c789a1f96f5a991bef82f4e98829ccde87f80a6))
* add main dimsnions to metadata store on init ([abf88a9](https://github.com/dhis2/line-listing-app/commit/abf88a9e45cf1288e9307465fa7ef53ded6a797c))
* add metadata for default period TECH-989 ([#992](https://github.com/dhis2/line-listing-app/issues/992)) ([48ef85c](https://github.com/dhis2/line-listing-app/commit/48ef85c5914ba36d1e7be464b7a7ff95b7c901cb))
* add placeholder for multi select ([95fb956](https://github.com/dhis2/line-listing-app/commit/95fb9568e1f0e10856ceef88b7c9b69bdf1a65fc))
* add stage to metadata when there is only one artificial stage ([ef94f8f](https://github.com/dhis2/line-listing-app/commit/ef94f8f8bbd92f10f3d0c599629518ff7b2411fa))
* add start screen instructions ([#930](https://github.com/dhis2/line-listing-app/issues/930)) ([0d4005e](https://github.com/dhis2/line-listing-app/commit/0d4005e6cbc3bb80fb26b7291f891836b8555f5f))
* adjust badge styles to updated specs ([5bde92e](https://github.com/dhis2/line-listing-app/commit/5bde92e525f9dd0bd86299cc0004af9431a5f264))
* adjust whitespace to correct for checkbox internal whitspace ([fdb17e6](https://github.com/dhis2/line-listing-app/commit/fdb17e61fd91d6add7ea280def6def2cdab7200e))
* adress failing test ([eff7667](https://github.com/dhis2/line-listing-app/commit/eff76677fb0c8a9a18ecdaf7256a01c50a7d7360))
* avoid clearing program after setting ui from loaded visualisation ([8ad376c](https://github.com/dhis2/line-listing-app/commit/8ad376c8110af7ef31ba3266f6deb77db9ce8561))
* catch error codes and output user friendly errors ([5402954](https://github.com/dhis2/line-listing-app/commit/5402954c2ef6c2695d93e7b4b762fccd1434d787))
* classes -> commonClasses ([ff1d76d](https://github.com/dhis2/line-listing-app/commit/ff1d76df70879867fa63a61b89b71d57b72be136))
* cleanup test code ([56a3f2f](https://github.com/dhis2/line-listing-app/commit/56a3f2fc57516be2c80f5878b63b0bd8b62c68c3))
* clear event and program status conditionally ([8472b21](https://github.com/dhis2/line-listing-app/commit/8472b21a16cfb54f8dc27808a223fbf068269705))
* clear event status when clearing program ([bdff6ea](https://github.com/dhis2/line-listing-app/commit/bdff6ea6ed71322107050bafd6a2cb9bf93b1219))
* clear load error on opening an AO ([82e995f](https://github.com/dhis2/line-listing-app/commit/82e995f209c877111f465b859a7c4450c2e3cd6e))
* columns doesnt require dimension items ([39c2417](https://github.com/dhis2/line-listing-app/commit/39c24176d890561bb77d4288400c6a9114c9a45f))
* conditionally update state on input type change ([#1001](https://github.com/dhis2/line-listing-app/issues/1001)) ([806bac3](https://github.com/dhis2/line-listing-app/commit/806bac37c16e3f15f0cbc90e7db6874ba4d1d936))
* consolidate all items to a single action ([2945025](https://github.com/dhis2/line-listing-app/commit/29450258f883abcfc6c705a6db3307e2dd6f932e))
* convert PROGRAM_DATA_ELEMENT to DATA_ELEMENT dimensions (TECH-964) ([#922](https://github.com/dhis2/line-listing-app/issues/922)) ([543d804](https://github.com/dhis2/line-listing-app/commit/543d804fa81978867357e1dafe61f88a28b14762))
* correct inner width for border width ([f3cf4ae](https://github.com/dhis2/line-listing-app/commit/f3cf4ae049c4bcd344f358e5a445f8ab1e71e103))
* correct problem with time dimension enabling and adjust test ([2401c4c](https://github.com/dhis2/line-listing-app/commit/2401c4c4aedda8ea27d83a9922c7ca6141741f2c))
* default period has been removed, remove its metadata ([6fecb05](https://github.com/dhis2/line-listing-app/commit/6fecb0588a7f5bd98062e5cbaf606f4c3a8c494a))
* do not show blank chips after visualization load error ([#1000](https://github.com/dhis2/line-listing-app/issues/1000)) ([863160b](https://github.com/dhis2/line-listing-app/commit/863160be1637a6bd0719387562d28857c200ee1c))
* fallback in case stage or program metadata is missing ([#923](https://github.com/dhis2/line-listing-app/issues/923)) ([e0c82ca](https://github.com/dhis2/line-listing-app/commit/e0c82ca0541bbced91d1a1201ea7b4df11f51c53))
* filter out unsupported value types ([17cf082](https://github.com/dhis2/line-listing-app/commit/17cf08253eda63cf919a65f7631771cef0a35ed4))
* fix vertical alignment of toolbar buttons ([#999](https://github.com/dhis2/line-listing-app/issues/999)) ([2738a5a](https://github.com/dhis2/line-listing-app/commit/2738a5a7d4218562c2107a93ba18b0302747e1a2))
* format event/enrollment/incident dates (TECH-1008) ([#1007](https://github.com/dhis2/line-listing-app/issues/1007)) ([fc4a710](https://github.com/dhis2/line-listing-app/commit/fc4a7101b122e4bf0c2b6885ceb4e11b2ab2b95f))
* hide your dimensions button when no dimensions are available ([#986](https://github.com/dhis2/line-listing-app/issues/986)) ([afd45bd](https://github.com/dhis2/line-listing-app/commit/afd45bdb2ce13ebbd1a616014f8435c5c3cca5b2))
* imperatively clear program and rename action ([e222c2f](https://github.com/dhis2/line-listing-app/commit/e222c2fbd47dac742851779246fb578690abb536))
* implement chip tooltip ([#1012](https://github.com/dhis2/line-listing-app/issues/1012)) ([11b7ea7](https://github.com/dhis2/line-listing-app/commit/11b7ea77fa20ebfddf1e546c0746f5d5ef73aa42))
* improved loading state and response handling for legend sets [#911](https://github.com/dhis2/line-listing-app/issues/911) ([205e8be](https://github.com/dhis2/line-listing-app/commit/205e8be8c818d9ddd2995a4ec2a1a017d5040d0b))
* include valueType on DND [#985](https://github.com/dhis2/line-listing-app/issues/985) ([c7ecf65](https://github.com/dhis2/line-listing-app/commit/c7ecf65981b14ffcadecbc81c6b230106b479353))
* individual styles for each type according to the spec ([efd7349](https://github.com/dhis2/line-listing-app/commit/efd73490fbdefda21afd148d86126c3543667864))
* int to string ([de56c54](https://github.com/dhis2/line-listing-app/commit/de56c5410d843a073a017540e0f90b544f15544c))
* inverse type support to explicitly list all supported types ([6914ce4](https://github.com/dhis2/line-listing-app/commit/6914ce4bd4b404fa59727e26c699e999e6df5476))
* item hover styles ([9827918](https://github.com/dhis2/line-listing-app/commit/9827918cbe9bc45b48bdac1adb73366a2fb4af53))
* let use-main-dimsnions return an array ([394e166](https://github.com/dhis2/line-listing-app/commit/394e16605820a3ae0c3e725d171fac3c83716a74))
* lint errors ([9cab653](https://github.com/dhis2/line-listing-app/commit/9cab653dd383b709349596dd4bda75d33e7363e5))
* loading state ([7979b2d](https://github.com/dhis2/line-listing-app/commit/7979b2db738d9bb37c2d15def912ca287e2c6686))
* merge conflicts ([dd856f5](https://github.com/dhis2/line-listing-app/commit/dd856f54a51d9540346581be72f7223e2a347f05))
* migrate dimension modal + options to use the UVC ([9c6397a](https://github.com/dhis2/line-listing-app/commit/9c6397ab2b10be90554b0bfbfebfe84fed5bc810))
* no data WIP, needs the UpdateVisualizationContainer and catching errors ([c9f450a](https://github.com/dhis2/line-listing-app/commit/c9f450a017f6f8aa1c32d2491f157cda46348692))
* only clear time dimension which will be disabled ([0c8f249](https://github.com/dhis2/line-listing-app/commit/0c8f24978b8be7f60d2ce0e10d9bc47364185e20))
* only dispatch once in metadata middleware ([#920](https://github.com/dhis2/line-listing-app/issues/920)) ([8bda5e6](https://github.com/dhis2/line-listing-app/commit/8bda5e6a2a211547db31bc9f42ad60cec2aefa75))
* optionSets display value ([#912](https://github.com/dhis2/line-listing-app/issues/912)) ([fa0a86c](https://github.com/dhis2/line-listing-app/commit/fa0a86c890b49ffd721a95fe3c92085dbbaff104))
* parse repetition when loading a visualization [#984](https://github.com/dhis2/line-listing-app/issues/984) ([b8e03bf](https://github.com/dhis2/line-listing-app/commit/b8e03bf2e2b912acc22c861d81022edfd00929da))
* pass headers in the analytics request DHIS2-12314 ([#906](https://github.com/dhis2/line-listing-app/issues/906)) ([c031891](https://github.com/dhis2/line-listing-app/commit/c031891f0959bf5ae833137d6720d2586d532c19))
* programType is needed to determine enabled time dimensions ([#932](https://github.com/dhis2/line-listing-app/issues/932)) ([b05dd4b](https://github.com/dhis2/line-listing-app/commit/b05dd4beeb1eedfceadfccdf68b4684c0c2afcff))
* proper styling ([75b40a6](https://github.com/dhis2/line-listing-app/commit/75b40a6a61542964a0199b1b1241306abc32dff7))
* properly add metadata for options / codes ([7caa49e](https://github.com/dhis2/line-listing-app/commit/7caa49e4b06659c1f3132fb930b2832e12eb81fa))
* read input from saved visualization and clear when it changes ([d474edd](https://github.com/dhis2/line-listing-app/commit/d474edd079819bf26a875ccf1f0965d817c0c786))
* read output type from ui-state's input-type ([fcc3d7e](https://github.com/dhis2/line-listing-app/commit/fcc3d7e8789554c2a566ce683f870d707ed5c95c))
* read total page-size and page from pager object ([badd06b](https://github.com/dhis2/line-listing-app/commit/badd06b780228372fbaede0ecf098482a54e53ad))
* readd margin between components ([203e3b8](https://github.com/dhis2/line-listing-app/commit/203e3b8537b5566e4edb5bdb82be0d6f2a67a9f5))
* remove color from legendset request ([a0ae705](https://github.com/dhis2/line-listing-app/commit/a0ae7059d307da0143a50a1336eb40aa5b2e3723))
* remove console.error ([ecac1f9](https://github.com/dhis2/line-listing-app/commit/ecac1f9ae6e6e4c6f431779c9d4496d4533df96d))
* remove debug text from conditions dialog ([#1008](https://github.com/dhis2/line-listing-app/issues/1008)) ([4fb90b5](https://github.com/dhis2/line-listing-app/commit/4fb90b529f41611425672c33f63f2c30e80ed1cf))
* remove event date this month from default ui selection ([330fc28](https://github.com/dhis2/line-listing-app/commit/330fc282c5b43aeea6291d6328704488d56d154f))
* remove fixed widths, WIP ([f4b72d7](https://github.com/dhis2/line-listing-app/commit/f4b72d760c8f37f6ab99514d17df2ac50ec1b146))
* remove ouLevels request since it isn't currently used ([b4ec3ed](https://github.com/dhis2/line-listing-app/commit/b4ec3ed559c1a1d287f53a348971294106eea2c8))
* remove prop from error ([946d71a](https://github.com/dhis2/line-listing-app/commit/946d71af4bb723d0fc2cceb3f22561c06c8c7b39))
* remove stage indent ([#1013](https://github.com/dhis2/line-listing-app/issues/1013)) ([4adb570](https://github.com/dhis2/line-listing-app/commit/4adb570a359ab1aa98d5ff56aa14c3f3ad9a74ac))
* rename display name to name ([81994a1](https://github.com/dhis2/line-listing-app/commit/81994a1dffd407cafa6f711ab6e282301ed2c3f6))
* rename selector and action to include "id" and fix missing metadata for stage ([#926](https://github.com/dhis2/line-listing-app/issues/926)) ([dc7a12c](https://github.com/dhis2/line-listing-app/commit/dc7a12ca5e9e2e3d7d07ac5f0fa22fd543063771))
* repetition in ui and current ([6778657](https://github.com/dhis2/line-listing-app/commit/67786570af7855517266a5d56a295ae22e4f5a64))
* replace throw with setLoadError for no data ([faac6a5](https://github.com/dhis2/line-listing-app/commit/faac6a5e67ed23de46ab009b56e8758f85f6c534))
* reset app when New is clicked ([#993](https://github.com/dhis2/line-listing-app/issues/993)) ([29fd8d5](https://github.com/dhis2/line-listing-app/commit/29fd8d5715901a14c2b1a64e6b9c15c1bf5cbf4b))
* reset badge count when program is cleared ([39369d5](https://github.com/dhis2/line-listing-app/commit/39369d54b0162cd9a6f1858b78fb3bb574fc3c4b))
* reset fetch error to allow loading a different AO ([#1009](https://github.com/dhis2/line-listing-app/issues/1009)) ([6ad737b](https://github.com/dhis2/line-listing-app/commit/6ad737b3a35bb0252bc5341885b63ab4d27e2f48))
* restore disabled style and behaviour for dimension-list-item ([783a5b1](https://github.com/dhis2/line-listing-app/commit/783a5b175723c79a1e3e9beef9a2d20e2d899da9))
* restore page size to 50 ([854ee60](https://github.com/dhis2/line-listing-app/commit/854ee609f16315117e88bf6954d932f2985b38d8))
* return localised string ([4c682fd](https://github.com/dhis2/line-listing-app/commit/4c682fddfb39660d6c7bcaef3c3581e28ccbcabe))
* reverse order of callbacks ([01c6351](https://github.com/dhis2/line-listing-app/commit/01c6351d59478eff11fb6649afa576bc889ebb31))
* separate to outer and inner component so outer component is never re-rendered ([c4a7700](https://github.com/dhis2/line-listing-app/commit/c4a770018ad3a667f2373def4745e573493b624c))
* set customized ui-only dimensionType for eventStatus, programStatus, createdBy, lastUpdatedBy ([#1005](https://github.com/dhis2/line-listing-app/issues/1005)) ([c898af4](https://github.com/dhis2/line-listing-app/commit/c898af41fac6e59d6307976af88883dd3eb95dfc))
* set default repetition on component render ([c810a4c](https://github.com/dhis2/line-listing-app/commit/c810a4ceb002804e83907bd427cbd06b18411455))
* set optionSet so the correct modal is opened ([#1011](https://github.com/dhis2/line-listing-app/issues/1011)) ([6ed156c](https://github.com/dhis2/line-listing-app/commit/6ed156c53411296d4fa998b1b6cb6e87ae0c453f))
* set program too in get-ui-from-visualisation ([aedb2db](https://github.com/dhis2/line-listing-app/commit/aedb2dbe5661b8f3c922be1573218f8dfc637ec0))
* sort dimension lists alphabetically by display name ([#998](https://github.com/dhis2/line-listing-app/issues/998)) ([c9f8937](https://github.com/dhis2/line-listing-app/commit/c9f893762c9e2de41526459ec51a875bd2302050))
* stop trying to remove metadata objects since this isn't supported ([463609f](https://github.com/dhis2/line-listing-app/commit/463609f7908dacf48a9c3090f03d0c5aaa4f8441))
* style conditions (TECH-787) [#899](https://github.com/dhis2/line-listing-app/issues/899) ([3325542](https://github.com/dhis2/line-listing-app/commit/33255429993677efab007f57bd052753250a70fc))
* styles for chips in layout and dimension items in panel ([#989](https://github.com/dhis2/line-listing-app/issues/989)) ([8953d26](https://github.com/dhis2/line-listing-app/commit/8953d26acf2d7cdcd6f3cd78c0960091dc1b7717))
* throw proper error for unsupported dimension types ([5a85503](https://github.com/dhis2/line-listing-app/commit/5a855032f06f96abc4eea68bff376accdd1538c9))
* time and main dimension constants should use _ID_ rather than _TYPE_ ([#991](https://github.com/dhis2/line-listing-app/issues/991)) ([41790ce](https://github.com/dhis2/line-listing-app/commit/41790ced588cfdc02306723786f75486bed24857))
* tweak enabled time dimensions ([6e5eea9](https://github.com/dhis2/line-listing-app/commit/6e5eea90489ad711b31d4e310c17bca23b517218))
* tweak program selection styling to match design specs ([05215b8](https://github.com/dhis2/line-listing-app/commit/05215b83e159cf9db09731e0cc82b09a39773067))
* typo ([6bb3e05](https://github.com/dhis2/line-listing-app/commit/6bb3e052b5edd1142de245697e8bec70307a5ecf))
* typo ([770c235](https://github.com/dhis2/line-listing-app/commit/770c23578c7876cfab7d81c23504a2f171f6371b))
* typo with import ([d408869](https://github.com/dhis2/line-listing-app/commit/d40886950e435fd0de1a5ce2a6cb679933b30404))
* uncomment code and set console.error instead ([036174d](https://github.com/dhis2/line-listing-app/commit/036174d1832ebff13465ee8ae6805fee01a50bf6))
* unrelated, remove data tab from options as completedOnly is now redundant ([4b14ec4](https://github.com/dhis2/line-listing-app/commit/4b14ec4182c2ceb7e0ab15c80e8a06150804751f))
* update metadata imperatively ([c588819](https://github.com/dhis2/line-listing-app/commit/c5888194368d19aa576bd6379e6898f2ee43b928))
* update time dimension names in metadata store and fix name bug ([cb946fa](https://github.com/dhis2/line-listing-app/commit/cb946fa274af27e4214a7a46a5c5c25f03a9d9fd))
* update timeDimensions metadata after actions that change them ([ca35f46](https://github.com/dhis2/line-listing-app/commit/ca35f466fc8aefa3ec88e460b315420acce16008))
* URLs used for download ([#1004](https://github.com/dhis2/line-listing-app/issues/1004)) ([d0a3b76](https://github.com/dhis2/line-listing-app/commit/d0a3b76fb9b51f025d74537c57782bc2208b3717))
* use a left border on right sidebar when open ([#988](https://github.com/dhis2/line-listing-app/issues/988)) ([2acbbdb](https://github.com/dhis2/line-listing-app/commit/2acbbdb6c527423654e96b06e9a236a09d191920))
* use connected add-to-layout-button so vis-type has a value ([46739df](https://github.com/dhis2/line-listing-app/commit/46739df2127603ca46ae0a12357a0f984f05ae82))
* use custom time dimsnion names and reset them again on clear ([a76881c](https://github.com/dhis2/line-listing-app/commit/a76881cba7f275523e3250b736fe531a0b8c03ad))
* use period dimension names from metadata fir initial selection ([54639e4](https://github.com/dhis2/line-listing-app/commit/54639e4bf0b48caca3532e61360eb236e18a1d74))
* use prefixed dim id for conditions in store ([#1014](https://github.com/dhis2/line-listing-app/issues/1014)) ([e4ba2c5](https://github.com/dhis2/line-listing-app/commit/e4ba2c5916599db942406a2822dd7b55733d7362))
* use starts-with and stop passing all stages as filter query param ([b5ca5b0](https://github.com/dhis2/line-listing-app/commit/b5ca5b0de1041291324c169b18298979aaefcabc))
* **main-dimensions:** disable only program and event status ([c7adba7](https://github.com/dhis2/line-listing-app/commit/c7adba73e21fcc7ce3e9d7300bfd2290298756d4))
* use the correct analytics endpoint based on outputType ([#909](https://github.com/dhis2/line-listing-app/issues/909)) ([34f0c52](https://github.com/dhis2/line-listing-app/commit/34f0c52b419d955cfed91a375b1cb13eaa5bdfd2))
* use the same mechanism for clearing and disabling main dimensions ([2086db9](https://github.com/dhis2/line-listing-app/commit/2086db9827f5ff0e56213d4c1a338d6d390168d7))
* use the same prop types as MenuItem ([#994](https://github.com/dhis2/line-listing-app/issues/994)) ([516c425](https://github.com/dhis2/line-listing-app/commit/516c4258d95ac1825557e324384005724b1e4613))
* various bugs with conditions (TECH-787) [#917](https://github.com/dhis2/line-listing-app/issues/917) ([47114e5](https://github.com/dhis2/line-listing-app/commit/47114e58304b3f6acc8e5bfe1baf9831a9702cb1))
* vis type selector icons ([#973](https://github.com/dhis2/line-listing-app/issues/973)) ([a6d5261](https://github.com/dhis2/line-listing-app/commit/a6d5261b277af994ff8dfccf3f6fa31f295dd8aa))
* **dimension-list-item:** make optionSet and valueType props optional ([8791c23](https://github.com/dhis2/line-listing-app/commit/8791c239f4aee38a829f3e0301bd09b4b73f0cc9))
* add decimal handling ([cb03f42](https://github.com/dhis2/line-listing-app/commit/cb03f421af8e8b78b7abea8ee3bc9ceb3606d8c9))
* add missing i18n wrapping ([84feb35](https://github.com/dhis2/line-listing-app/commit/84feb353f2be398b0aeb21d9f8196fcf816bc274))
* adjust icon color ([794175c](https://github.com/dhis2/line-listing-app/commit/794175c0483b5e4ebd85c33d0d883881802f7a54))
* adjust right panel animation to design specs ([390ad34](https://github.com/dhis2/line-listing-app/commit/390ad342e83e1764e283553978d6d4c57e1683b4))
* avoid crash when switching to input type ([3482487](https://github.com/dhis2/line-listing-app/commit/34824872246d6cd9eac5434915de73cbe3051162))
* bug causing incorrect value when moving away from a legendset ([ade3389](https://github.com/dhis2/line-listing-app/commit/ade3389df7af13384e3d411ad643d05485055e51))
* checkbox state ([#908](https://github.com/dhis2/line-listing-app/issues/908)) ([80a35ec](https://github.com/dhis2/line-listing-app/commit/80a35ec49ce253a4dd74a73bdd144df5c79a4b8e))
* clear filter fields when program changes ([4e09e15](https://github.com/dhis2/line-listing-app/commit/4e09e155418163d04d3f88cabf22148d82de05e2))
* close the DownloadMenu when clicking outside of it ([#897](https://github.com/dhis2/line-listing-app/issues/897)) ([c81ed19](https://github.com/dhis2/line-listing-app/commit/c81ed19cee1461f1a341ed23d8dcd339bf1e9ab5))
* correctly re-open last active menu item ([b38baf6](https://github.com/dhis2/line-listing-app/commit/b38baf6bb3e469e8ff88eb42d257b0c492bc477b))
* dummy commit ([c75a07c](https://github.com/dhis2/line-listing-app/commit/c75a07c91704297e5806ff72d0c895a1fffb9ebe))
* filtering ([350d91c](https://github.com/dhis2/line-listing-app/commit/350d91c83a74a80cf85ec53e262e3ae48d7722fc))
* fix visualization types passed to the AO ([#883](https://github.com/dhis2/line-listing-app/issues/883)) ([f533607](https://github.com/dhis2/line-listing-app/commit/f5336070d46ffdd0bf829e6321d80484d050f560))
* format empty value for BOOLEAN and TRUE_ONLY ([#904](https://github.com/dhis2/line-listing-app/issues/904)) ([1e1b267](https://github.com/dhis2/line-listing-app/commit/1e1b2671e9b33d34e4ed861017da673d9e9d0437))
* icon border radius and hover color ([66a4d84](https://github.com/dhis2/line-listing-app/commit/66a4d840ca48518f4f77ff783eb009d8875fcd3a))
* ignore modal related history changes in app and respond in modal ([3454408](https://github.com/dhis2/line-listing-app/commit/3454408dc63c86be70b71db321c97be4bb1eb31e))
* keep spinner in view when table is scrolled ([0549e7e](https://github.com/dhis2/line-listing-app/commit/0549e7ef84cf623188675bd3584d7dd2357a8ce1))
* only fetch LS when OP is selected, use ui comp loading spinners ([ee0d010](https://github.com/dhis2/line-listing-app/commit/ee0d0101ea461c8c0818f454ee52fd9a32475277))
* prevent content shift during animation ([8622600](https://github.com/dhis2/line-listing-app/commit/8622600eb759fda5f2201465440fc70d765e18b3))
* prevent double loader and ensure loaders are the same size ([b870fb0](https://github.com/dhis2/line-listing-app/commit/b870fb094cd226ca78b4efd98abf1ae556882c02))
* prevent NOT I as being prefixed as I NOT ([ec9b132](https://github.com/dhis2/line-listing-app/commit/ec9b1322b40de01220cf0d922343e7fbdb9ef84b))
* prevent outline on click, show on keyboard navigation only ([7f524a0](https://github.com/dhis2/line-listing-app/commit/7f524a09fdcfc02f6282958cf177ca1d6de23b64))
* prevent second route change when clicking see interpretation button ([baf705f](https://github.com/dhis2/line-listing-app/commit/baf705f272b074210c9417d850ae3f837fd6790c))
* program indicators show numeric condition + refactor names ([#902](https://github.com/dhis2/line-listing-app/issues/902)) ([26c810f](https://github.com/dhis2/line-listing-app/commit/26c810f6fc866be4f6d2e83c684471766db0ca3f))
* proper legendSet implementation ([f5f102a](https://github.com/dhis2/line-listing-app/commit/f5f102a36d70b61d05463590419f710077a6e0df))
* proper styling with css ([8321afd](https://github.com/dhis2/line-listing-app/commit/8321afd1a342a38b66804eeabc84c550128cc0e9))
* remove content shift on initial load and remove spinner on close ([8b032d3](https://github.com/dhis2/line-listing-app/commit/8b032d3590e56cab0431a25c5c7e69055adfd60f))
* remove dummy commit ([ac1ab55](https://github.com/dhis2/line-listing-app/commit/ac1ab55219be070e0c9d4998f4715b798cfd69a7))
* remove DV specific store props ([#890](https://github.com/dhis2/line-listing-app/issues/890)) ([bcc5613](https://github.com/dhis2/line-listing-app/commit/bcc561370ee5d166999a67e50604c1ee7248cd82))
* repetition format parser ([#888](https://github.com/dhis2/line-listing-app/issues/888)) ([f1243f9](https://github.com/dhis2/line-listing-app/commit/f1243f9a19ac574ffb3cf8e3b20b9025afc66a4f))
* repetition infrastructure ([#889](https://github.com/dhis2/line-listing-app/issues/889)) ([2bea0dd](https://github.com/dhis2/line-listing-app/commit/2bea0ddc41ad80e9a4d1b79d4b96a9ba8ad29294))
* save and fetch options to/from metadata with code ([#901](https://github.com/dhis2/line-listing-app/issues/901)) ([e5f9099](https://github.com/dhis2/line-listing-app/commit/e5f9099da6d02c8f34937ebf37737e8ec6f12846))
* store and fetch avail LS and the LS to/from the store ([0586ba0](https://github.com/dhis2/line-listing-app/commit/0586ba0641498f09c778e855afe179d5a601da48))
* tweak styles to match data visualizer app ([c86e461](https://github.com/dhis2/line-listing-app/commit/c86e461473141be6155b0c09d8b18cacf8c0bc12))
* unset stage when program is updated ([b9a44e0](https://github.com/dhis2/line-listing-app/commit/b9a44e05117f76657bed708d4f3642d0f75ea69e))
* use consistent debounce time ([20978ff](https://github.com/dhis2/line-listing-app/commit/20978ffbaf82d38a03b6e33359d62cc22e9c0752))
* use correct error text in dimension list ([c7cb985](https://github.com/dhis2/line-listing-app/commit/c7cb98572ba71dc6802a41a9fa21a1f7267ad605))
* **accessory-sidebar:** restore padding for normal sections ([468ebc5](https://github.com/dhis2/line-listing-app/commit/468ebc5a208bcf6f37d1a8d34e25ebc7b851697d))
* **download-button:** bump @dhis2/ui so dropdown-button is controlled ([936351f](https://github.com/dhis2/line-listing-app/commit/936351ff7905c249c406f784b9b4b4f138d757c2))
* **download-menu:** add relativePeriodDate to download paths from modal ([683d80d](https://github.com/dhis2/line-listing-app/commit/683d80daabc56ff32b2f21f59f1a6fe0c92e4ab0))
* **input-panel:** ensure input always has a value ([33b1540](https://github.com/dhis2/line-listing-app/commit/33b154049c2ab9968a0a12f8cace5c714b0e11da))
* **interpretation-modal:** use default position top ([b87c341](https://github.com/dhis2/line-listing-app/commit/b87c3411c0335c10a58cc6d4641fa85433888b50))
* **main-sidebar:** localise menu item labels ([1e87b90](https://github.com/dhis2/line-listing-app/commit/1e87b90338e42f5deebbdbd3e89d392cc271123c))
* **program-dimensions:** stop reserving space for hidden button ([a175b22](https://github.com/dhis2/line-listing-app/commit/a175b2278328c7bd085eac3b7a3c0788ab0c7479))
* **visualization:** reassign req variable ([7c2623c](https://github.com/dhis2/line-listing-app/commit/7c2623c9c96cc6b7fb6500ed064b0685a2b1b324))
* **visualization:** reassign request variable ([5002500](https://github.com/dhis2/line-listing-app/commit/50025006eb986196e6e42cd49c762bdf8b839587))
* add the loading spinner to the visualization section ([1ad6b49](https://github.com/dhis2/line-listing-app/commit/1ad6b49418d20e9fa91281d12f36955b9fa36cef))
* address lint error ([2cad325](https://github.com/dhis2/line-listing-app/commit/2cad325cc3d47faa44ab939921a9c71934933981))
* bump ls-lint ([b823cbb](https://github.com/dhis2/line-listing-app/commit/b823cbb90e21755d935c1a6ffe283a7efa082ab8))
* conditionsmanager first draft ([f033edc](https://github.com/dhis2/line-listing-app/commit/f033edc1439908a2146619511712a3d680be23b5))
* connect options + loading spinner ([#847](https://github.com/dhis2/line-listing-app/issues/847)) ([e5ea736](https://github.com/dhis2/line-listing-app/commit/e5ea7362018c24105b13e95542ec5e63c05df5c5))
* connect visualization to options ([6ce97d0](https://github.com/dhis2/line-listing-app/commit/6ce97d0900fb2cec4a81a9e057e20ccec5bc4ab1))
* disable click handler on disabled vis types (PT) ([#863](https://github.com/dhis2/line-listing-app/issues/863)) ([86ef0a0](https://github.com/dhis2/line-listing-app/commit/86ef0a058c5db43462193fd1afc7b63e1b987140))
* disable preview button when no text is entered ([d409fe9](https://github.com/dhis2/line-listing-app/commit/d409fe95b33ecbbc0a98f3b20e619da0f90adc99))
* display density option, tSetCurrentFromUi, update button, toolbar ([#850](https://github.com/dhis2/line-listing-app/issues/850)) ([074ee43](https://github.com/dhis2/line-listing-app/commit/074ee437a3c9f69241cb6ebfa925491a1182c476))
* fetch legendSets ([9cbe7ee](https://github.com/dhis2/line-listing-app/commit/9cbe7ee4523c88217e437b5c9057eb9988250def))
* filter out incomplete conditions when storing ([b6e481f](https://github.com/dhis2/line-listing-app/commit/b6e481f4f0099672428247aaa0841d99dca3e329))
* first draft for adding the org unit modal ([92fe297](https://github.com/dhis2/line-listing-app/commit/92fe297e4c2e578fbc30b6d66deaee3ae27e0774))
* fixes and improvements to the RichTextEditor ([#864](https://github.com/dhis2/line-listing-app/issues/864)) ([2200687](https://github.com/dhis2/line-listing-app/commit/22006873b93babf6842cac8bcc6320492051f86a))
* implement the font size option in the table ([dc5c858](https://github.com/dhis2/line-listing-app/commit/dc5c8589595c386789ebef552ded88f165bb25a0))
* loading spinner part 2 ([99bfcab](https://github.com/dhis2/line-listing-app/commit/99bfcabec9c2617abea4a8ca42ac7327c27e6540))
* only render chips when data is available ([ec55ec5](https://github.com/dhis2/line-listing-app/commit/ec55ec5a857cae5f84eb946852e095d8ada8f96b))
* preselect user org unit instead of root org unit + add default metadata ([4dce1b3](https://github.com/dhis2/line-listing-app/commit/4dce1b3b18316ebfd4d321b213d8bab45f7c9695))
* rangeset first draft WIP ([efd502b](https://github.com/dhis2/line-listing-app/commit/efd502b732647fd8afc854c7b3feb585e363a6d6))
* split dialogManager into two, include conditions on update ([5c9a40e](https://github.com/dhis2/line-listing-app/commit/5c9a40e2efa738a7b76b944d9abf3ad48ce27bac))
* style form buttons ([edcd0e9](https://github.com/dhis2/line-listing-app/commit/edcd0e9fff48b5746a967cb17867924fd413395b))
* use dimension name only ([1c02aaa](https://github.com/dhis2/line-listing-app/commit/1c02aaaf78a2366eddfcb3bf9a69a936e4fd0539))
* **interpretation-modal:** make app responsible for showing and hiding ([700df9c](https://github.com/dhis2/line-listing-app/commit/700df9c796da00626553c80e88eb59bc933569c5))
* add chip menu ([2756942](https://github.com/dhis2/line-listing-app/commit/2756942cbdbde44cfc67efa21c0e65aea4f3054a))
* add drag handler ([93b07eb](https://github.com/dhis2/line-listing-app/commit/93b07eb30563f22b8a4d8fcd60deaaa70a706688))
* add LL visType and clone dimension menu from analytics ([59bdc8e](https://github.com/dhis2/line-listing-app/commit/59bdc8e00a878d6c2cc34b5105718bd982f86d0b))
* add missing reducers in combined reducer ([ad6df84](https://github.com/dhis2/line-listing-app/commit/ad6df8468e97fd53974134fa92bf2e05202c6036))
* avoid global css ([237786a](https://github.com/dhis2/line-listing-app/commit/237786ad010cf08e625d38d27b008f8186114834))
* custom pagination summary as seen in classic ER ([#841](https://github.com/dhis2/line-listing-app/issues/841)) ([67c3939](https://github.com/dhis2/line-listing-app/commit/67c393976a8760af553c54992159e018cc93b4f8))
* d2-analysis@33.2.18 ([4070d33](https://github.com/dhis2/line-listing-app/commit/4070d336f4c4f2a47e861256d69a9e46da6e7454))
* d2-analysis@33.2.19 ([7a7f993](https://github.com/dhis2/line-listing-app/commit/7a7f993dd3edaa86aab73562864f116d119fe878))
* d2-analysis@33.2.21 ([dfb980b](https://github.com/dhis2/line-listing-app/commit/dfb980b94b90d3c96a78cf162ce567b118a415e7))
* d2-analysis@33.2.22 ([e692fed](https://github.com/dhis2/line-listing-app/commit/e692fed05daeb8b2282637c0cf722e5a51aeec2e))
* d2-analysis@33.2.23 ([8c3c8c1](https://github.com/dhis2/line-listing-app/commit/8c3c8c10a59ce3cfa307ad75e154a4ba7e53886f))
* d2-analysis@33.2.24 ([44feb2e](https://github.com/dhis2/line-listing-app/commit/44feb2edd8c7244cf0cf1584b057ed59606c6a80))
* dependencies ([e85a976](https://github.com/dhis2/line-listing-app/commit/e85a9763789944a029d1029b50fb6d7cfca166bb))
* empty schemas ([29e47a2](https://github.com/dhis2/line-listing-app/commit/29e47a2a8982f672f0be1ee004dbf6a1aecbb7b7))
* first draft for layout ([40e062e](https://github.com/dhis2/line-listing-app/commit/40e062e3fe52d387f4ac4580435e6aebc62fbb6f))
* layout section ([#842](https://github.com/dhis2/line-listing-app/issues/842)) ([9508df7](https://github.com/dhis2/line-listing-app/commit/9508df74fde1bc1cb062023b9503eaf443be9e8c))
* linelist config ([bd87f04](https://github.com/dhis2/line-listing-app/commit/bd87f044149b7b8b81593a08967084d950f92fac))
* set ui from visualization ([4792ede](https://github.com/dhis2/line-listing-app/commit/4792ede7007739bc79924c861d877d3d2d06dbd3))
* settings issue from DV ([92463b0](https://github.com/dhis2/line-listing-app/commit/92463b06bbd3effeae249f9ac871683383fabbf1))
* visualization -> eventReport ([e1ea53f](https://github.com/dhis2/line-listing-app/commit/e1ea53f3fb01e364a06effd0d54447b3e110ea42))
* **translations:** sync translations from transifex (master) ([b7642c3](https://github.com/dhis2/line-listing-app/commit/b7642c39d361802473ae575e7b2b02adda803fca))
* **translations:** sync translations from transifex (master) ([865f76f](https://github.com/dhis2/line-listing-app/commit/865f76fa20ce267f60d20d949786c3dba41ee6e2))
* **translations:** sync translations from transifex (master) ([5f0233f](https://github.com/dhis2/line-listing-app/commit/5f0233fa21471a06f5e04999a5d332a00c4d2121))
* **translations:** sync translations from transifex (master) ([d47e6e2](https://github.com/dhis2/line-listing-app/commit/d47e6e26400f3b8f9228065b71b1c5b66a65deb8))
* **translations:** sync translations from transifex (master) ([3693cf3](https://github.com/dhis2/line-listing-app/commit/3693cf305bbc9e33d1bfd62e372f43d8aceadaa2))
* **translations:** sync translations from transifex (master) ([f12e536](https://github.com/dhis2/line-listing-app/commit/f12e53636c097400d2fb7d9b3be01dce3c974fc5))
* **translations:** sync translations from transifex (master) ([eda2f69](https://github.com/dhis2/line-listing-app/commit/eda2f6917a1c4838e89edcbfcc72daa01200852f))
* **translations:** sync translations from transifex (master) ([dfc5e30](https://github.com/dhis2/line-listing-app/commit/dfc5e30caaa15e5ada3cbccd2c182c144026ba45))
* **translations:** sync translations from transifex (master) ([e53249b](https://github.com/dhis2/line-listing-app/commit/e53249bc387082f6325321a811aef15fc04da380))
* **translations:** sync translations from transifex (master) ([10e06fd](https://github.com/dhis2/line-listing-app/commit/10e06fd2b3c4b0890be83359695f7e88246e0d6c))
* **translations:** sync translations from transifex (master) ([28ddd27](https://github.com/dhis2/line-listing-app/commit/28ddd27445022c9592b9b17c75426a49cb0b71ec))
* **translations:** sync translations from transifex (master) ([ed0c725](https://github.com/dhis2/line-listing-app/commit/ed0c725a48563d6cf93f2befdfaa7b3feb3df887))
* **translations:** sync translations from transifex (master) ([0c71b25](https://github.com/dhis2/line-listing-app/commit/0c71b2565f46f929f57a3946f10b9eeec07f988d))
* **translations:** sync translations from transifex (master) ([e9cfaf4](https://github.com/dhis2/line-listing-app/commit/e9cfaf42d9ff3f825c4ddfe98a4d449279d213fe))
* **translations:** sync translations from transifex (master) ([e88efeb](https://github.com/dhis2/line-listing-app/commit/e88efeb69c395e78b22f470dd1968a89a6c88d64))
* **translations:** sync translations from transifex (master) ([fb4952b](https://github.com/dhis2/line-listing-app/commit/fb4952b3f2eda3985bd3d6bb74d023861e4cd620))
* **translations:** sync translations from transifex (master) ([19cafe5](https://github.com/dhis2/line-listing-app/commit/19cafe51f2566f4c14cc8c82920fc303696eb19b))
* **translations:** sync translations from transifex (master) ([c02f70e](https://github.com/dhis2/line-listing-app/commit/c02f70e48e2463ab75d8becaecc5d6078ed964fa))
* **translations:** sync translations from transifex (master) ([eb3a85d](https://github.com/dhis2/line-listing-app/commit/eb3a85d225b47c9106f10ce27032cd4490e28f12))
* **translations:** sync translations from transifex (master) ([0a43449](https://github.com/dhis2/line-listing-app/commit/0a43449cbfc4ee85eb1a4e06c8b194a70ad5b5f3))
* **translations:** sync translations from transifex (master) ([eda7610](https://github.com/dhis2/line-listing-app/commit/eda76108bc6717f2afe1fcbf0bf4d3b378b58ad1))
* **translations:** sync translations from transifex (master) ([62d1d93](https://github.com/dhis2/line-listing-app/commit/62d1d936687a2cd5edb976c23cf6a922b336cf6c))
* **translations:** sync translations from transifex (master) ([61f2524](https://github.com/dhis2/line-listing-app/commit/61f2524a0e36325dc6e18c61b7ed3aaa5e6777ce))
* **translations:** sync translations from transifex (master) ([866a6bd](https://github.com/dhis2/line-listing-app/commit/866a6bda3263d8658a7ff0845ef56a1ffd668e3f))
* **translations:** sync translations from transifex (master) ([8b50f14](https://github.com/dhis2/line-listing-app/commit/8b50f14b764425fe8635f2be7874fa8ccd1b9070))
* **translations:** sync translations from transifex (master) ([ffa606a](https://github.com/dhis2/line-listing-app/commit/ffa606a8d3d775aecc84b2c716572c997eada941))
* **translations:** sync translations from transifex (master) ([ab68bd2](https://github.com/dhis2/line-listing-app/commit/ab68bd230581efab138ba54e99696c3195f16e68))
* **translations:** sync translations from transifex (master) ([f639acc](https://github.com/dhis2/line-listing-app/commit/f639acceff98a253532ad0e66b15aab868c44b5c))
* **translations:** sync translations from transifex (master) ([89e0eb4](https://github.com/dhis2/line-listing-app/commit/89e0eb4546532cdb763ccac909889867f87a09f5))
* **translations:** sync translations from transifex (master) ([2e06114](https://github.com/dhis2/line-listing-app/commit/2e061146314e330a3e4df2b5c18777d2ea24544f))
* **translations:** sync translations from transifex (master) ([1889aed](https://github.com/dhis2/line-listing-app/commit/1889aed09c5e99cee91a9e4a74857f35de9562fb))
* d2-analysis@33.2.17 ([be843e2](https://github.com/dhis2/line-listing-app/commit/be843e267767dcd0b2e9817b9bd7a6ea7cee01c6))
* **translations:** sync translations from transifex (master) ([5ec90d5](https://github.com/dhis2/line-listing-app/commit/5ec90d57bc0befceb94545ae617b6b9a2db7c8e9))
* **translations:** sync translations from transifex (master) ([d156897](https://github.com/dhis2/line-listing-app/commit/d156897d4922534530b8c32ae1993c4a80e089d9))
* **translations:** sync translations from transifex (master) ([2adfb30](https://github.com/dhis2/line-listing-app/commit/2adfb30ef7daf8e4f94e788f9a70dc933ab99377))
* **translations:** sync translations from transifex (master) ([cdee9da](https://github.com/dhis2/line-listing-app/commit/cdee9da6ef43a302e13859c31d71d14bb745aa34))
* **translations:** sync translations from transifex (master) ([cc3cb69](https://github.com/dhis2/line-listing-app/commit/cc3cb695bffe6b434e59d45510b82dc2fbc115c6))
* **translations:** sync translations from transifex (master) ([8cce9a8](https://github.com/dhis2/line-listing-app/commit/8cce9a8a9fc51ac6941b8bfe1d300af89f9ab11a))
* d2-analysis@33.2.12 ([2d033e4](https://github.com/dhis2/line-listing-app/commit/2d033e4ca6eb4e8c4c15ac0268ab66ff77089759))
* d2-analysis@33.2.13 ([bf59a07](https://github.com/dhis2/line-listing-app/commit/bf59a070d16bc975e8bad579f55f182d44108299))
* d2-analysis@33.2.14 ([b8a89c5](https://github.com/dhis2/line-listing-app/commit/b8a89c5a32c18a26151a447ec3eea1e7f8d1a250))
* d2-analysis@33.2.15 ([b92854e](https://github.com/dhis2/line-listing-app/commit/b92854e0fecec9632711c97aa096cecca94d9422))
* dates and paging for line lists ([#552](https://github.com/dhis2/line-listing-app/issues/552)) ([3ddce75](https://github.com/dhis2/line-listing-app/commit/3ddce75b6ea07519b7a7c7baeb1aed65090ff33c))
* font size option ([#851](https://github.com/dhis2/line-listing-app/issues/851)) ([6f5cb5e](https://github.com/dhis2/line-listing-app/commit/6f5cb5e21aa3c937c0a195801d07817b122180f0))
* i18n for daily rel periods + d2-analysis@33.2.16 ([#554](https://github.com/dhis2/line-listing-app/issues/554)) ([ac899de](https://github.com/dhis2/line-listing-app/commit/ac899de57fba951e6a0ba7d125388a9d943190b8))
* layout pt 2 [#845](https://github.com/dhis2/line-listing-app/issues/845) ([dd65c5d](https://github.com/dhis2/line-listing-app/commit/dd65c5d1639af5fc9bc0246f15cc48d6819ed19c))
* pass current to Visualization, add completedOnly in analytics req ([#848](https://github.com/dhis2/line-listing-app/issues/848)) ([68d4a48](https://github.com/dhis2/line-listing-app/commit/68d4a48ae2f9873eb8dc93dfee451a85180f20cf))
* remove branch identifier ([37787cd](https://github.com/dhis2/line-listing-app/commit/37787cd52a7764282840e9132357695eb591bbef))
* remove min height for VTS ([6e21226](https://github.com/dhis2/line-listing-app/commit/6e2122620ee87ba293f2cd1cae235a0b836f76ca))
* set data id scheme ([#553](https://github.com/dhis2/line-listing-app/issues/553)) ([b9385fd](https://github.com/dhis2/line-listing-app/commit/b9385fd9738fe51ec73c140c5e3cc4fe4e452f18))
* set root org unit as selected by default and add metadata ([5652429](https://github.com/dhis2/line-listing-app/commit/5652429ad80b76b7d2f4ae800ed7049356f3b333))
* store conditions as array ([65569cf](https://github.com/dhis2/line-listing-app/commit/65569cf44bf66ea54c36f5945ba063961adec033))
* unwrap unlisten of the async ([6ae5583](https://github.com/dhis2/line-listing-app/commit/6ae5583210b82a8a370cfe921f43c8bba515bfc3))
* update button ([0fa30d3](https://github.com/dhis2/line-listing-app/commit/0fa30d345f9501fe12ab42082a9f1aebe0885769))
* use metadata instead of dimensions for various lookups ([a244745](https://github.com/dhis2/line-listing-app/commit/a244745359c63124c5898e5e5772401083bf69cd))
* value input first draft ([cc16a68](https://github.com/dhis2/line-listing-app/commit/cc16a68511ef93318200e84b1b85d58ed42dca0e))
* **translations:** sync translations from transifex (master) ([185ee22](https://github.com/dhis2/line-listing-app/commit/185ee226ebc2eaff2684be8b690fea9d65022419))
* **translations:** sync translations from transifex (master) ([ac0dd2c](https://github.com/dhis2/line-listing-app/commit/ac0dd2cbf3e6d343b2cb8fca8b26b2924528de97))
* **translations:** sync translations from transifex (master) ([098d6b3](https://github.com/dhis2/line-listing-app/commit/098d6b386b9cc1b6127f72284bdd302280119b04))
* **translations:** sync translations from transifex (master) ([bc78b8b](https://github.com/dhis2/line-listing-app/commit/bc78b8b824d3c0fc73ad4de39c844d2f799231a0))
* **translations:** sync translations from transifex (master) ([dc1d62e](https://github.com/dhis2/line-listing-app/commit/dc1d62ef984af8ed03d119ee76174b31ce603df1))
* **visualization:** add auto height and sticky pagination ([8264b24](https://github.com/dhis2/line-listing-app/commit/8264b245952d22c4cd100c2034e3d1e0ca11cfcb))
* **visualization:** left align data table ([2c682f5](https://github.com/dhis2/line-listing-app/commit/2c682f56630720de861c7abadfb3b8e601999a3f))
* **visualization:** make table auto-width + add relativePeriodDate prop ([99d10d9](https://github.com/dhis2/line-listing-app/commit/99d10d921765087edebdd491a933f602e9c24a86))
* remove legacy 'dy' dimension ([4915277](https://github.com/dhis2/line-listing-app/commit/4915277a2a23acc55b27759e7adaff89ced4e609))
* saving multiple data element filters ([#71](https://github.com/dhis2/line-listing-app/issues/71)) ([aaa4f1f](https://github.com/dhis2/line-listing-app/commit/aaa4f1f61eb24e311e243b2e721c4389654146db))


### Features

* add all icons to dimension item according to updated specs ([426bea7](https://github.com/dhis2/line-listing-app/commit/426bea72cbfd97f5b344c48e73cd082a2355d22f))
* add dahsed style to program menu badge if no program is selected ([3c328ad](https://github.com/dhis2/line-listing-app/commit/3c328ad8b695956b61ed96d373c43cf73701ad10))
* add hover style to the chip's show more button ([67cca23](https://github.com/dhis2/line-listing-app/commit/67cca23c10c4b2a78d7c571aa65dc04f53cfafb6))
* add line list icon on start screen ([#939](https://github.com/dhis2/line-listing-app/issues/939)) ([4308976](https://github.com/dhis2/line-listing-app/commit/4308976b018c9a00473fb015b78eaececa36a730))
* add main dimensions section ([f159d34](https://github.com/dhis2/line-listing-app/commit/f159d341d30042d70585a892b3b5d36ca354c8b1))
* add main dimensions section ([9418521](https://github.com/dhis2/line-listing-app/commit/9418521828730225c34cb70bd3807a1ce0957185))
* add support for cat, cogs, ougs ([95bd4c2](https://github.com/dhis2/line-listing-app/commit/95bd4c2b95ef8d67a6d8bce82cf6a66428ed3bdc))
* add support for cat, cogs, ougs (TECH-968) [#928](https://github.com/dhis2/line-listing-app/issues/928) ([0e058d6](https://github.com/dhis2/line-listing-app/commit/0e058d674c68a45fe8c934c5de438ee6ea7c19f7))
* add support for program status in the modal and store values to ui ([6e8db46](https://github.com/dhis2/line-listing-app/commit/6e8db46254bd237e6225a041314dc5da87e4891e))
* add time dimension dialog ui (not connected to the store) ([b1f3ac9](https://github.com/dhis2/line-listing-app/commit/b1f3ac91961f0eacaec8998d420d1372069f48d4))
* add time dimensions to main sidebar [TECH-804] ([#919](https://github.com/dhis2/line-listing-app/issues/919)) ([39338ed](https://github.com/dhis2/line-listing-app/commit/39338edabba8b360451c9ed1cc48403dc512388c))
* apply font size and padding based on settings ([#990](https://github.com/dhis2/line-listing-app/issues/990)) ([9ff67e3](https://github.com/dhis2/line-listing-app/commit/9ff67e336ac2b7ee254325ddb6c52e06e27fe449))
* auto-select stage if there is only one ([#972](https://github.com/dhis2/line-listing-app/issues/972)) ([b7f679e](https://github.com/dhis2/line-listing-app/commit/b7f679e6c2629cb253b8c1308705fb07173ddd68))
* chip loading skeleton ([#964](https://github.com/dhis2/line-listing-app/issues/964)) ([033660a](https://github.com/dhis2/line-listing-app/commit/033660a3e531561ee5270fe633b8705163f9f2bd))
* convert completedOnly option to eventStatus filter TECH-965 ([#940](https://github.com/dhis2/line-listing-app/issues/940)) ([4f70dc8](https://github.com/dhis2/line-listing-app/commit/4f70dc816ff13755f31f926db4655124fc723ae2))
* dimension fetching and filtering ([1981868](https://github.com/dhis2/line-listing-app/commit/1981868705100899e5e5c92b17b0286cc54c0a08))
* disable save button for legacy ao (TECH-1013) ([#1015](https://github.com/dhis2/line-listing-app/issues/1015)) ([1da2f38](https://github.com/dhis2/line-listing-app/commit/1da2f38b1fe649afc36069dc9ed10ff001d71502))
* dnd layout and dimensions panel ([#937](https://github.com/dhis2/line-listing-app/issues/937)) ([f303769](https://github.com/dhis2/line-listing-app/commit/f303769fc233407cc0f77468b4d0efe95fd6677e))
* error handling (TECH-706) [#934](https://github.com/dhis2/line-listing-app/issues/934) ([3a681ca](https://github.com/dhis2/line-listing-app/commit/3a681cab59e1d7d121a4522fb6dfbee1e2ffec84))
* expand and collapse layout panel ([#915](https://github.com/dhis2/line-listing-app/issues/915)) ([2712c8c](https://github.com/dhis2/line-listing-app/commit/2712c8cda4d9ae2e93a0c102f51f6d6e7d65940f))
* export status values and labels ([540fd94](https://github.com/dhis2/line-listing-app/commit/540fd94a22f7eb61b587345044dd240e768de6a5))
* first draft for repeatable events ([dba7265](https://github.com/dhis2/line-listing-app/commit/dba72652e7a99e1b32761dbc6a5cdbce5eae25f3))
* forward compatibility: pe - time dimension conversion TECH-796 ([#913](https://github.com/dhis2/line-listing-app/issues/913)) ([f37a33e](https://github.com/dhis2/line-listing-app/commit/f37a33e41ce96e3b78f6451a3f36f3ae565bcc5f))
* implement panel toggling ([37c13cd](https://github.com/dhis2/line-listing-app/commit/37c13cdfeba3348bddba10161d88fa82a1b37f1b))
* implement time dimension selection ([b491028](https://github.com/dhis2/line-listing-app/commit/b491028e85e148f1c56f352feca94016f2cb5cae))
* implement user mention wrapper ([#876](https://github.com/dhis2/line-listing-app/issues/876)) ([f2d1760](https://github.com/dhis2/line-listing-app/commit/f2d176048cb3bd0c00a4fcefef9e1955392f06bd))
* increase program select max height ([b1dffa9](https://github.com/dhis2/line-listing-app/commit/b1dffa9b50b77a13cd194d87e78f5a5745a5d278))
* input type accessory panel ([74ecf67](https://github.com/dhis2/line-listing-app/commit/74ecf67d132945d7011c8856e5b7514c9d312fad))
* lazy load dimension list ([0de0d70](https://github.com/dhis2/line-listing-app/commit/0de0d70812f72dc31978520599733d648087d95d))
* numeric conditions to fetch legendsets (TECH-788) ([#892](https://github.com/dhis2/line-listing-app/issues/892)) ([95acc48](https://github.com/dhis2/line-listing-app/commit/95acc4887db9b32b4f46574e2c3e4af75e949641))
* org unit condition (TECH-883) ([#896](https://github.com/dhis2/line-listing-app/issues/896)) ([f43e839](https://github.com/dhis2/line-listing-app/commit/f43e839aa87d3115b5202cefa589d16d353fb689))
* partial dimension item type styles and functionality ([773eaf5](https://github.com/dhis2/line-listing-app/commit/773eaf5f3005055275ccad5095df494f075a9212))
* program and event status modal (TECH-697) [#945](https://github.com/dhis2/line-listing-app/issues/945) ([9b212dd](https://github.com/dhis2/line-listing-app/commit/9b212ddb87785c9b5e6d44f463a1cfd3472ad7dd))
* program dimension item selection ([060c7e5](https://github.com/dhis2/line-listing-app/commit/060c7e579d41d27539c5e8adb32a4c938d250ff0))
* program dimension panel WIP ([340e5f8](https://github.com/dhis2/line-listing-app/commit/340e5f844050fdbfe11ff36ce11a3a354c62270f))
* remove d2, use CachedDataQueryProvider for user info ([#886](https://github.com/dhis2/line-listing-app/issues/886)) ([991732d](https://github.com/dhis2/line-listing-app/commit/991732d226e24535ca8787f8991b077a4d411484))
* repeatable events (TECH-894) [#925](https://github.com/dhis2/line-listing-app/issues/925) ([67af199](https://github.com/dhis2/line-listing-app/commit/67af199dab5f60d5853007ccac0e7e5f5578a987))
* same as prev commit but for event status ([362876b](https://github.com/dhis2/line-listing-app/commit/362876b058ea5177c8f39acd406a492bfca01f1a))
* show dimension context menu when hovering item in dimension panel ([#967](https://github.com/dhis2/line-listing-app/issues/967)) ([5424196](https://github.com/dhis2/line-listing-app/commit/5424196d565dc0c889d3c4abcf47e3a2bf2578b7))
* show error message when AO isnt found ([#929](https://github.com/dhis2/line-listing-app/issues/929)) ([ead6106](https://github.com/dhis2/line-listing-app/commit/ead6106c9bbe9e18ba4dbce6a5b4ae24d15953ee))
* show input accesory panel selection in main panel ([a9a3c57](https://github.com/dhis2/line-listing-app/commit/a9a3c574f1e7c053a0971bd4d579b2f5808ff8e8))
* show repetition in headers (TECH-984) ([#982](https://github.com/dhis2/line-listing-app/issues/982)) ([c5317fb](https://github.com/dhis2/line-listing-app/commit/c5317fb7927dd546b024cf8e0848cf7cba88ca6a))
* show static text for non-filterable dims (TECH-884) [#893](https://github.com/dhis2/line-listing-app/issues/893) ([cba8d6b](https://github.com/dhis2/line-listing-app/commit/cba8d6b070722c8ce2d0603a63cffdb74c53b88f))
* sidebar selection ([6b767bc](https://github.com/dhis2/line-listing-app/commit/6b767bc6d277a5169d57d080308daf8fa95ae16c))
* store program and program stage in metadata store ([87bb722](https://github.com/dhis2/line-listing-app/commit/87bb7228ca5bb36a1b173edc84bdf41b50e11186))
* switch from eventReport to eventVisualization ([#907](https://github.com/dhis2/line-listing-app/issues/907)) ([b3d96bf](https://github.com/dhis2/line-listing-app/commit/b3d96bf9cf7255e39a4c154c9f4059512a119067))
* update ui, metadata and current from period dimension modal ([742eabe](https://github.com/dhis2/line-listing-app/commit/742eabebb2cd9b141c99791f783034a8778e1a4f))
* visualization scrollbox auto-width ([#914](https://github.com/dhis2/line-listing-app/issues/914)) ([c959c11](https://github.com/dhis2/line-listing-app/commit/c959c112cdec6d2f22cef15e63bb7ea73071c6ad))
* your dimensions panel with search ([3c8e8d5](https://github.com/dhis2/line-listing-app/commit/3c8e8d501746226c4d6a953b1955ce5716b4e6f1))
* **dimensions-panel:** add dimension-menu-item ([450d6e8](https://github.com/dhis2/line-listing-app/commit/450d6e83af5626fdd17ab918c9fcd4b3638cb203))
* **program-dimensions:** add program select ([d21f39d](https://github.com/dhis2/line-listing-app/commit/d21f39d780a879cb4964f7ad20ebaee1296606c8))
* **program-dimensions:** filter available programs by input type ([8cb91f7](https://github.com/dhis2/line-listing-app/commit/8cb91f7311c840e688a364ad651f4ae63b65ef3c))
* add case sensitive checkbox ([27635f6](https://github.com/dhis2/line-listing-app/commit/27635f695b243a40e5260f917bd8cc93b79e2822))
* add dimension panel with slide-in-out animation ([013855f](https://github.com/dhis2/line-listing-app/commit/013855fd2b9314ce0802ce6086493289a2f82742))
* add download dropdown ([66d0f04](https://github.com/dhis2/line-listing-app/commit/66d0f0427d380928ff3fec199269f92d857d755b))
* add initial focus prop to interpretations thread ([0f97ccc](https://github.com/dhis2/line-listing-app/commit/0f97ccc8aa04ea33a60aab8a8ffd07063b0f8e9c))
* add loading overlay to interpretation thread ([076cfc6](https://github.com/dhis2/line-listing-app/commit/076cfc6a298a7e6e7787a63af8b1c9f1595fb944))
* add loading overlay to interpretation unit ([79cca2d](https://github.com/dhis2/line-listing-app/commit/79cca2d6c84e5aa88f2c877591500f7491aa25b7))
* add loading state to comment add form ([57ce7f2](https://github.com/dhis2/line-listing-app/commit/57ce7f24a547363ef62038823cb0018d285e4585))
* add loading state to modal ([3f64840](https://github.com/dhis2/line-listing-app/commit/3f64840e242d61d89b67da9f0cb095f907f6a6e8))
* Add support for org unit field ([#59](https://github.com/dhis2/line-listing-app/issues/59)) ([2142121](https://github.com/dhis2/line-listing-app/commit/21421217b5bfeaa8c713e1b653648f8fdc80403f))
* add TitleBar, Visualization and StartScreen components ([#826](https://github.com/dhis2/line-listing-app/issues/826)) ([3d0b1ba](https://github.com/dhis2/line-listing-app/commit/3d0b1bab7967943e6d717169fd612ef4506947aa))
* alphanumeric conditions (TECH-812) [#880](https://github.com/dhis2/line-listing-app/issues/880) ([9215053](https://github.com/dhis2/line-listing-app/commit/9215053a189b9ce4a6d7d9846a9294de67d40483))
* animated right panel ([8366012](https://github.com/dhis2/line-listing-app/commit/8366012079d125e756e8795bdedc4da5864a7470))
* autocollapse left bar when showing right bar ([ace477f](https://github.com/dhis2/line-listing-app/commit/ace477feb40c6cf5caaad9696ff8a5e55b5c88fd))
* basic imports and first draft of the options modal ([d8f9181](https://github.com/dhis2/line-listing-app/commit/d8f918135c0b6653b2e45c807f728a3514d6b520))
* boolean conditions (TECH-815) [#882](https://github.com/dhis2/line-listing-app/issues/882) ([e3c5c07](https://github.com/dhis2/line-listing-app/commit/e3c5c07533473cd1a059e5d48981c8c7f92b077e))
* date, datetime, time conditions (TECH-817) [#885](https://github.com/dhis2/line-listing-app/issues/885) ([f2fbdc2](https://github.com/dhis2/line-listing-app/commit/f2fbdc2c90ed594759e95393f9b0d9e54e67ab6c))
* datetime and time conditions ([fff3b09](https://github.com/dhis2/line-listing-app/commit/fff3b093955b366b52d6e78f4801c10ab736cd9c))
* fetch optionset and valuetype from backend and store in metadata ([4f1dd57](https://github.com/dhis2/line-listing-app/commit/4f1dd57dd6e9c1d235dee80e11748a0bcd62469b))
* FileMenu in MenuBar and loading of visualization ([#825](https://github.com/dhis2/line-listing-app/issues/825)) ([1ec40cb](https://github.com/dhis2/line-listing-app/commit/1ec40cb3b0363b28c4f3704942ecaff3783d801f))
* first draft for alphanumeric conditions ([14ba27a](https://github.com/dhis2/line-listing-app/commit/14ba27a94130be6efae234404f62e6c04cc8c57e))
* first draft for boolean conditions ([ca7f60b](https://github.com/dhis2/line-listing-app/commit/ca7f60b765dda291523f2ec2330c19a59f67c9d0))
* first draft for date condition, text based input ([9e6f16a](https://github.com/dhis2/line-listing-app/commit/9e6f16ac3743a25af5fc4091b52a440e96df4618))
* format numeric values with digit group separator ([#853](https://github.com/dhis2/line-listing-app/issues/853)) ([1abaf0c](https://github.com/dhis2/line-listing-app/commit/1abaf0c967e5f70f7b7e01ee0b93e71a7fb5f506))
* hide false for the true_only condition type ([f6fdf78](https://github.com/dhis2/line-listing-app/commit/f6fdf788492f57402919e3103b20316ab45a5de1))
* implement AlertBar component ([#844](https://github.com/dhis2/line-listing-app/issues/844)) ([54f8025](https://github.com/dhis2/line-listing-app/commit/54f802594093f77a8f9531f173a3ae20a4cbbf19))
* implement component for the interpretations list (TECH-783) ([6c7837a](https://github.com/dhis2/line-listing-app/commit/6c7837ae67efd9d212b7ce5700c78a4e93a4ff55))
* implement new/save/save as/rename/delete actions from FileMenu ([#840](https://github.com/dhis2/line-listing-app/issues/840)) ([d81440f](https://github.com/dhis2/line-listing-app/commit/d81440fc85385270dd25b86c4183581bf1de5f7f))
* implement toggle button and right sidebar container ([#854](https://github.com/dhis2/line-listing-app/issues/854)) ([26303fa](https://github.com/dhis2/line-listing-app/commit/26303fac8ef5f1ece4579657b71698d54565140c))
* input type date ([9665f34](https://github.com/dhis2/line-listing-app/commit/9665f341931b8b95e975daaf271ed464500f1cef))
* interpretation modal (TECH-702) ([bc2b2b9](https://github.com/dhis2/line-listing-app/commit/bc2b2b916acf55daa4b031bfd2f0d73dfb18db3d))
* interpretation thread ([0f78a90](https://github.com/dhis2/line-listing-app/commit/0f78a90cd256525dda3fa3c816111c410cfec8d7))
* interpretations unit component ([#860](https://github.com/dhis2/line-listing-app/issues/860)) ([a678ad2](https://github.com/dhis2/line-listing-app/commit/a678ad211a69de4d6ade67439d23a651e55ef918))
* new org unit dimension (TECH-707) ([#861](https://github.com/dhis2/line-listing-app/issues/861)) ([c36804d](https://github.com/dhis2/line-listing-app/commit/c36804d96c7fa8708aeb23eb0b59d881329582c8))
* numeric condition (TECH-788) [#875](https://github.com/dhis2/line-listing-app/issues/875) ([70c0741](https://github.com/dhis2/line-listing-app/commit/70c0741625c9ff899fe37da26a9dd4efb38b3de6))
* numeric condition pt 2 (TECH-788) [#879](https://github.com/dhis2/line-listing-app/issues/879) ([01f4332](https://github.com/dhis2/line-listing-app/commit/01f433259f4b78e6c9db1a425d1565dc5d5fce01))
* option sets can be viewed and changed ([80de31b](https://github.com/dhis2/line-listing-app/commit/80de31b704953b3bbcff97ff925a09318e8b5cee))
* options modal ([#824](https://github.com/dhis2/line-listing-app/issues/824)) ([f4fdc1a](https://github.com/dhis2/line-listing-app/commit/f4fdc1a36d36bcb3ea6e7ceba9da2166a74a92b1))
* optionset condition (TECH-816) [#887](https://github.com/dhis2/line-listing-app/issues/887) ([cd16f27](https://github.com/dhis2/line-listing-app/commit/cd16f2705d7b66d5872b56eead80e37ef363b61e))
* optionsetcondition.js draft ([77e3f38](https://github.com/dhis2/line-listing-app/commit/77e3f3860319b4692067b76c2704dc5220495336))
* show static text for non-filterable dims ([d66f795](https://github.com/dhis2/line-listing-app/commit/d66f795060569624eb6418188bcda81a4a2d1e78))
* support selection from multiple stages ([#62](https://github.com/dhis2/line-listing-app/issues/62)) ([aea5a4c](https://github.com/dhis2/line-listing-app/commit/aea5a4ce0ee79dabce2cc25fb4ca346369d8da04))
* TitleBar styles and logic for unsaved/edited titles ([#837](https://github.com/dhis2/line-listing-app/issues/837)) ([09e6874](https://github.com/dhis2/line-listing-app/commit/09e687459476c862d0445eb5cbdd3ba50d2b8fe1))
* TRUE_ONLY condition type (TECH-815) [#884](https://github.com/dhis2/line-listing-app/issues/884) ([feac946](https://github.com/dhis2/line-listing-app/commit/feac946068d67852b8d9e83326caa8d6cdd9761e))
* **visualization:** use swr patter to avoid content shifts ([478d964](https://github.com/dhis2/line-listing-app/commit/478d964b829fa80a396c6018f7d5560dae8ab1dc))
* update and delete interpretations ([223b67f](https://github.com/dhis2/line-listing-app/commit/223b67f68a261ec381834a2f115768336bcb8643))
* update details pane when intepretations have changed in the modal ([654e10d](https://github.com/dhis2/line-listing-app/commit/654e10d934ad0f327ad7d0d710a9e3f76daec175))
* **interpretations:** show modal when interpretation ID is in URL ([1230b50](https://github.com/dhis2/line-listing-app/commit/1230b508204ab17d431a304131163828fa54e206))
* **program-dimensions:** filter available programs by input type ([83a36a3](https://github.com/dhis2/line-listing-app/commit/83a36a3101bb1c53fb318ddb82d60eb8a990e602))
* use a RichTextEditor component for adding interpretations ([2892cf4](https://github.com/dhis2/line-listing-app/commit/2892cf45e275f27997ddf36cc590790c8065d877))
* use AboutAOUnit in right sidebar ([#858](https://github.com/dhis2/line-listing-app/issues/858)) ([d664cd4](https://github.com/dhis2/line-listing-app/commit/d664cd44d399ccf36ecd059f161226d1c424cb76))
* VisualizationTypeSelector component ([#849](https://github.com/dhis2/line-listing-app/issues/849)) ([da3867f](https://github.com/dhis2/line-listing-app/commit/da3867f593a71ca80b02c82c54f8d81a5aedc64b))

# [33.3.0](https://github.com/dhis2/event-reports-app/compare/v33.2.22...v33.3.0) (2021-10-04)


### Bug Fixes

* empty schemas ([29e47a2](https://github.com/dhis2/event-reports-app/commit/29e47a2a8982f672f0be1ee004dbf6a1aecbb7b7))
* linelist config ([bd87f04](https://github.com/dhis2/event-reports-app/commit/bd87f044149b7b8b81593a08967084d950f92fac))
* visualization -> eventReport ([e1ea53f](https://github.com/dhis2/event-reports-app/commit/e1ea53f3fb01e364a06effd0d54447b3e110ea42))


### Features

* basic imports and first draft of the options modal ([d8f9181](https://github.com/dhis2/event-reports-app/commit/d8f918135c0b6653b2e45c807f728a3514d6b520))
* options modal ([#824](https://github.com/dhis2/event-reports-app/issues/824)) ([f4fdc1a](https://github.com/dhis2/event-reports-app/commit/f4fdc1a36d36bcb3ea6e7ceba9da2166a74a92b1))
