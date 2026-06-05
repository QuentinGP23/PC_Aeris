# Changelog

## [2.5.0](https://github.com/QuentinGP23/PC_Aeris/compare/v2.4.2...v2.5.0) (2026-06-05)


### Features

* **configurator:** configs prêtes, questionnaire guidé, tri par benc… ([8ea974b](https://github.com/QuentinGP23/PC_Aeris/commit/8ea974b887479479192dacbd1b8c83708178a976))
* **configurator:** configs prêtes, questionnaire guidé, tri par benchmark + popin de sauvegarde ([dcbcc69](https://github.com/QuentinGP23/PC_Aeris/commit/dcbcc69a6d5d614364f54aea0abb44b0fdc21fee))


### Bug Fixes

* **configurator:** filtre compat côté SQL via embedding PostgREST ([64311d3](https://github.com/QuentinGP23/PC_Aeris/commit/64311d33f3427bae99997c6f98ff535164448737))
* **configurator:** ordre strict + fallback robuste sur filtre vide ([05e7430](https://github.com/QuentinGP23/PC_Aeris/commit/05e74307902c65ab1a0e2d7170c7a29a8534fb1c))
* **configurator:** ordre strict + fallback robuste sur filtre vide ([bf82308](https://github.com/QuentinGP23/PC_Aeris/commit/bf82308ead43d89fd818ddf082773f510c956420))
* **lint:** évite setState synchrone dans l'effet de SaveConfigModal ([aeb017e](https://github.com/QuentinGP23/PC_Aeris/commit/aeb017e83a2026546596f2023e6c5d3db972b094))

## [2.4.2](https://github.com/QuentinGP23/PC_Aeris/compare/v2.4.1...v2.4.2) (2026-05-29)


### Bug Fixes

* **compatibility:** boîtier et stockage ne disparaissent plus à tort ([60cd538](https://github.com/QuentinGP23/PC_Aeris/commit/60cd5387d6a7edcf8282c36b2286c6adc9caa2a8))
* **compatibility:** boîtier et stockage ne disparaissent plus à tort ([fb87306](https://github.com/QuentinGP23/PC_Aeris/commit/fb87306145c747585ef0cb38659a0ce17991b323))
* **test:** élargir le type mock pour inclure supported_mobo_form_factors ([b1ef6b9](https://github.com/QuentinGP23/PC_Aeris/commit/b1ef6b96ff2a293db753bfbc2982d4379d1c2e59))

## [2.4.1](https://github.com/QuentinGP23/PC_Aeris/compare/v2.4.0...v2.4.1) (2026-05-29)


### Bug Fixes

* **admin:** ad-table invisible — min-width:0 sur grid + display block explicite ([11b5184](https://github.com/QuentinGP23/PC_Aeris/commit/11b51844b1686ce8f44d3bb175da731b4b951c99))
* **admin:** ad-table invisible — min-width:0 sur grid cell ([e80caf6](https://github.com/QuentinGP23/PC_Aeris/commit/e80caf6ba04d515fa568ab65d0aa6c97963371ad))
* **admin:** renomme préfixe ad- en adm- + hauteur sidebar à 100vh ([e07cbe5](https://github.com/QuentinGP23/PC_Aeris/commit/e07cbe5130564dae255e1fc2ae2bc5a0f1d1abae))
* **admin:** sidebar desktop sticky en top:0 ([942f28b](https://github.com/QuentinGP23/PC_Aeris/commit/942f28b6148cb91cf26ac5b6c08dde3676dca492))
* **admin:** sidebar desktop sticky en top:0 au lieu de top:var(--nav-h) ([96f7866](https://github.com/QuentinGP23/PC_Aeris/commit/96f78662f92889ccf04e0a35b64f12307ea5fee1))

## [2.4.0](https://github.com/QuentinGP23/PC_Aeris/compare/v2.3.1...v2.4.0) (2026-05-29)


### Features

* **sprint-5:** remember me, tarifs assemblage, responsive admin ([233f158](https://github.com/QuentinGP23/PC_Aeris/commit/233f158ba33e252d20b2d15a418b7e48fb24ba49))


### Bug Fixes

* **admin:** désactive react-hooks/set-state-in-effect pour la fermeture du drawer ([49d6729](https://github.com/QuentinGP23/PC_Aeris/commit/49d6729e9d0f074481939a53f700799a9e4236c0))
* **admin:** sidebar pleine hauteur, drawer mobile, diagnostic vide/erreur ([0257265](https://github.com/QuentinGP23/PC_Aeris/commit/025726539d639dc23273e897c3cca872dd32217d))
* **admin:** sidebar pleine hauteur, drawer mobile, états vides explicites ([5c0f02d](https://github.com/QuentinGP23/PC_Aeris/commit/5c0f02d41ad114afc0d874621dc8e3bd2c235982))
* **test:** mock setRememberMe dans les tests auth pour passer le CI ([790c9b5](https://github.com/QuentinGP23/PC_Aeris/commit/790c9b5aa4d827c5bbdef8e28d1911ca696cea84))

## [2.3.1](https://github.com/QuentinGP23/PC_Aeris/compare/v2.3.0...v2.3.1) (2026-05-22)


### Bug Fixes

* **configurator:** verrouille l'ordre de sélection et corrige les imp… ([c8b8273](https://github.com/QuentinGP23/PC_Aeris/commit/c8b8273f84971921b5dadb7901b592c7f8cdbc54))
* **configurator:** verrouille l'ordre de sélection et corrige les impasses de compatibilité ([25cf7de](https://github.com/QuentinGP23/PC_Aeris/commit/25cf7dedb2f000c928c1043097fb5b873d732f60))

## [2.3.0](https://github.com/QuentinGP23/PC_Aeris/compare/v2.2.0...v2.3.0) (2026-04-22)


### Features

* **design:** fondations du design system Aeris 2026 ([01d21db](https://github.com/QuentinGP23/PC_Aeris/commit/01d21db6d708361ab42549aca55cb03ebcbee17c))
* **redesign:** refonte complète Aeris Dark sur tout le site ([4a3b463](https://github.com/QuentinGP23/PC_Aeris/commit/4a3b4637e6b7c02f87d3e2795de348e8c082b500))


### Bug Fixes

* **redesign:** RGAA, vraies stats et retrait doublons sur la home ([90127c5](https://github.com/QuentinGP23/PC_Aeris/commit/90127c5e275c869b174fcb0772d48732c169c4ac))

## [2.2.0](https://github.com/QuentinGP23/PC_Aeris/compare/v2.1.0...v2.2.0) (2026-04-21)


### Features

* **sprint-2:** fix login pseudo + toast notifications globales ([62e3fda](https://github.com/QuentinGP23/PC_Aeris/commit/62e3fda4fa60a4f54d32b3b21eec546ab696a19b))
* **sprint-2:** fix login pseudo + toast notifications globales ([eef1ea0](https://github.com/QuentinGP23/PC_Aeris/commit/eef1ea0b84a749b8e9d6ac30d63390f26a56da60))
* **sprint-3:** compatibilités GPU/PSU TDP, boîtier/mobo format, stockage/connectique ([0714e6e](https://github.com/QuentinGP23/PC_Aeris/commit/0714e6e94e6385f9d7d60c45a723a9515557b879))
* **sprint-3:** compatibilités GPU/PSU/Storage + tests unitaires ([d26fe76](https://github.com/QuentinGP23/PC_Aeris/commit/d26fe76cf558d39d5a3d88163a4b2d1dce7a3808))
* **sprint-4:** admin création produit + édition prix (US-078, US-079) ([cb0358a](https://github.com/QuentinGP23/PC_Aeris/commit/cb0358a97d2ad69d28a52f972c18edc0100d84e0))
* **sprint-4:** admin produits (CRUD + prix) + tests d'intégration ([138f3df](https://github.com/QuentinGP23/PC_Aeris/commit/138f3df132e498587d9759e503a23334dc41feb8))


### Bug Fixes

* **ci:** résoudre conflit vitest@2 / coverage-v8@4 + ajouter npm test au CI ([b28b519](https://github.com/QuentinGP23/PC_Aeris/commit/b28b5191b681292c74cf891b5e0676a2b6d49a74))
* **ci:** résoudre conflit vitest@2 / coverage-v8@4 + ajouter npm test au CI ([4ef6096](https://github.com/QuentinGP23/PC_Aeris/commit/4ef6096d1dfe2dbe536fec39595f0a28878809d6))
* **test:** aligner makeProduct avec les champs réels du type Product ([16c4868](https://github.com/QuentinGP23/PC_Aeris/commit/16c4868cfb7c62f1535d7b8db7152d3e494ea2e1))
* **toast:** replace undefined SCSS vars with valid values ([3abe049](https://github.com/QuentinGP23/PC_Aeris/commit/3abe0492400f55c8cfe28b6eb55ae77c0a39ca94))

## [2.1.0](https://github.com/QuentinGP23/PC_Aeris/compare/v2.0.0...v2.1.0) (2026-04-07)


### Features

* **profile:** add user profile page ([3404c8e](https://github.com/QuentinGP23/PC_Aeris/commit/3404c8e861d0880eebb2a625a00559f53821277b))
* **profile:** merge user profile page into develop ([d8396aa](https://github.com/QuentinGP23/PC_Aeris/commit/d8396aa15ef8c3cfe3a6bd905203f2ac6b314d90))

## [2.0.0](https://github.com/QuentinGP23/PC_Aeris/compare/v1.5.0...v2.0.0) (2026-04-03)


### ⚠ BREAKING CHANGES

* clean restart - suppression des composants et pages pour repartir sur de bonnes bases

### Features

* add admin pages for users and products management ([be6079b](https://github.com/QuentinGP23/PC_Aeris/commit/be6079bde3ec348e0071f7670c9c17c23d635a7c))
* add complete design system ([dd5a9df](https://github.com/QuentinGP23/PC_Aeris/commit/dd5a9dff69e018839940e3064dfbe07384b927bd))
* add complete design system ([3c203b1](https://github.com/QuentinGP23/PC_Aeris/commit/3c203b165de864d0e72e6f7f371f291c8fbe62fb))
* add components catalog page and BuildCores import scripts ([e1f1493](https://github.com/QuentinGP23/PC_Aeris/commit/e1f1493ceba18806776102e9094f182522e227ff))
* add hero banner, admin user management, and signup email confirmation ([19f47e0](https://github.com/QuentinGP23/PC_Aeris/commit/19f47e08fd3a3a4c6d6758dc604e0848eff7b47a))
* add PC configurator with compatibility filtering ([d28f56c](https://github.com/QuentinGP23/PC_Aeris/commit/d28f56c2c01ba84f3cf085c2fbc09c9c750272ce))
* **admin:** add reset button to specs tab ([b0b4fa4](https://github.com/QuentinGP23/PC_Aeris/commit/b0b4fa47eec19bad1622a7eadf1a1b95a473fbed))
* **admin:** add sortable columns to products table ([b5329f7](https://github.com/QuentinGP23/PC_Aeris/commit/b5329f7b901552f43bd9ddb202ddb23b7752d3fb))
* **admin:** add specs editing to Products page ([e36256e](https://github.com/QuentinGP23/PC_Aeris/commit/e36256e8dd42870eea17d1b2ab8e54b5398db68a))
* ajout système d'authentification complet avec Supabase ([499116a](https://github.com/QuentinGP23/PC_Aeris/commit/499116a2b3479a6f46bbc1ad315ae8cf77ce6a7d))
* ajout vérification que les PR vers main viennent de develop ([87f3ea8](https://github.com/QuentinGP23/PC_Aeris/commit/87f3ea8ad69fd80cce2264c9a7e6539eb24dd18b))
* **design-system:** apply DS to home, auth, legal pages ([3fbc172](https://github.com/QuentinGP23/PC_Aeris/commit/3fbc172f56a89215808a629d40580dfdf0349897))
* **design-system:** implement base DS tokens — colors, typography, spacing, animations ([157c405](https://github.com/QuentinGP23/PC_Aeris/commit/157c405e308be9bf3858cd8909fd9652584b3088))
* **home:** build home page with 4 sections ([000c0d3](https://github.com/QuentinGP23/PC_Aeris/commit/000c0d3e3a296673f803c05ef7cc5f41ffa80d79))
* **home:** redesign all sections with modern visual identity ([c98cfdc](https://github.com/QuentinGP23/PC_Aeris/commit/c98cfdc4f4d0e2a7dbcea43f5d3ef0989646a635))
* **product-api:** fiche produit, enrichissement images/prix, labels FR ([e51b801](https://github.com/QuentinGP23/PC_Aeris/commit/e51b801a404e65b50367b54c40b1ebc60b083617))
* **product-api:** fiche produit, enrichissement images/prix, labels FR ([1d0d352](https://github.com/QuentinGP23/PC_Aeris/commit/1d0d352e2a21c2170bc54ba403c5b09b45253e69))


### Bug Fixes

* ajout vercel.json pour le routing SPA ([76190ed](https://github.com/QuentinGP23/PC_Aeris/commit/76190ed42a656f6e7cc576f76f34856d183c13d0))
* ajout vercel.json pour le routing SPA ([868f79c](https://github.com/QuentinGP23/PC_Aeris/commit/868f79cd60c4f749fb22162efcfe922810fb070f))
* check-branch ne s'exécute que sur les PR vers main ([8d82b82](https://github.com/QuentinGP23/PC_Aeris/commit/8d82b8293e60a85644a173871503fecaea0cdd22))
* **configurator:** fix react-hooks/set-state-in-effect lint errors ([fccc6e7](https://github.com/QuentinGP23/PC_Aeris/commit/fccc6e710672a9a81bda267b7c2007c3a38ac6b7))
* correction sauvegarde pseudo et téléphone à l'inscription ([0b49bd1](https://github.com/QuentinGP23/PC_Aeris/commit/0b49bd17a84066b01424ab1008dd652df578b688))
* **lint:** remove unused destructured vars in ProductDetail ([cc0f4ff](https://github.com/QuentinGP23/PC_Aeris/commit/cc0f4ff3374ecdcc3dcc6b78b0a0cdee19c6ef0d))
* resolve build and lint errors in Components and Users pages ([8229d3e](https://github.com/QuentinGP23/PC_Aeris/commit/8229d3e4372504971846e21a45c77c142dbb9875))
* rewrite Components page to fix TS and lint errors ([d75016c](https://github.com/QuentinGP23/PC_Aeris/commit/d75016cb9825bfb27d205f4bc8ae3f72921811d3))
* **table:** add onClick prop to Th component ([f2f6f1c](https://github.com/QuentinGP23/PC_Aeris/commit/f2f6f1c0a1a6cca775bbf8a6362032d456598a85))


### Code Refactoring

* clean restart - suppression des composants et pages pour repartir sur de bonnes bases ([eb4d576](https://github.com/QuentinGP23/PC_Aeris/commit/eb4d57663ff6359e38db57412a9015d6f7ebd5c1))

## [1.5.0](https://github.com/QuentinGP23/PC_Aeris/compare/v1.4.0...v1.5.0) (2026-04-03)


### Features

* **product-api:** fiche produit, enrichissement images/prix, labels FR ([e51b801](https://github.com/QuentinGP23/PC_Aeris/commit/e51b801a404e65b50367b54c40b1ebc60b083617))
* **product-api:** fiche produit, enrichissement images/prix, labels FR ([1d0d352](https://github.com/QuentinGP23/PC_Aeris/commit/1d0d352e2a21c2170bc54ba403c5b09b45253e69))


### Bug Fixes

* **lint:** remove unused destructured vars in ProductDetail ([cc0f4ff](https://github.com/QuentinGP23/PC_Aeris/commit/cc0f4ff3374ecdcc3dcc6b78b0a0cdee19c6ef0d))

## [1.4.0](https://github.com/QuentinGP23/PC_Aeris/compare/v1.3.0...v1.4.0) (2026-04-03)


### Features

* **design-system:** apply DS to home, auth, legal pages ([3fbc172](https://github.com/QuentinGP23/PC_Aeris/commit/3fbc172f56a89215808a629d40580dfdf0349897))
* **design-system:** implement base DS tokens — colors, typography, spacing, animations ([157c405](https://github.com/QuentinGP23/PC_Aeris/commit/157c405e308be9bf3858cd8909fd9652584b3088))

## [1.3.0](https://github.com/QuentinGP23/PC_Aeris/compare/v1.2.0...v1.3.0) (2026-03-18)


### Features

* add admin pages for users and products management ([be6079b](https://github.com/QuentinGP23/PC_Aeris/commit/be6079bde3ec348e0071f7670c9c17c23d635a7c))
* add complete design system ([dd5a9df](https://github.com/QuentinGP23/PC_Aeris/commit/dd5a9dff69e018839940e3064dfbe07384b927bd))
* add complete design system ([3c203b1](https://github.com/QuentinGP23/PC_Aeris/commit/3c203b165de864d0e72e6f7f371f291c8fbe62fb))
* add PC configurator with compatibility filtering ([d28f56c](https://github.com/QuentinGP23/PC_Aeris/commit/d28f56c2c01ba84f3cf085c2fbc09c9c750272ce))
* **admin:** add reset button to specs tab ([b0b4fa4](https://github.com/QuentinGP23/PC_Aeris/commit/b0b4fa47eec19bad1622a7eadf1a1b95a473fbed))
* **admin:** add sortable columns to products table ([b5329f7](https://github.com/QuentinGP23/PC_Aeris/commit/b5329f7b901552f43bd9ddb202ddb23b7752d3fb))
* **admin:** add specs editing to Products page ([e36256e](https://github.com/QuentinGP23/PC_Aeris/commit/e36256e8dd42870eea17d1b2ab8e54b5398db68a))


### Bug Fixes

* **configurator:** fix react-hooks/set-state-in-effect lint errors ([fccc6e7](https://github.com/QuentinGP23/PC_Aeris/commit/fccc6e710672a9a81bda267b7c2007c3a38ac6b7))
* **table:** add onClick prop to Th component ([f2f6f1c](https://github.com/QuentinGP23/PC_Aeris/commit/f2f6f1c0a1a6cca775bbf8a6362032d456598a85))

## [1.2.0](https://github.com/QuentinGP23/PC_Aeris/compare/v1.1.1...v1.2.0) (2026-03-13)


### Features

* add components catalog page and BuildCores import scripts ([e1f1493](https://github.com/QuentinGP23/PC_Aeris/commit/e1f1493ceba18806776102e9094f182522e227ff))
* add hero banner, admin user management, and signup email confirmation ([19f47e0](https://github.com/QuentinGP23/PC_Aeris/commit/19f47e08fd3a3a4c6d6758dc604e0848eff7b47a))


### Bug Fixes

* resolve build and lint errors in Components and Users pages ([8229d3e](https://github.com/QuentinGP23/PC_Aeris/commit/8229d3e4372504971846e21a45c77c142dbb9875))
* rewrite Components page to fix TS and lint errors ([d75016c](https://github.com/QuentinGP23/PC_Aeris/commit/d75016cb9825bfb27d205f4bc8ae3f72921811d3))

## [1.1.1](https://github.com/QuentinGP23/PC_Aeris/compare/v1.1.0...v1.1.1) (2026-02-27)


### Bug Fixes

* ajout vercel.json pour le routing SPA ([76190ed](https://github.com/QuentinGP23/PC_Aeris/commit/76190ed42a656f6e7cc576f76f34856d183c13d0))
* ajout vercel.json pour le routing SPA ([868f79c](https://github.com/QuentinGP23/PC_Aeris/commit/868f79cd60c4f749fb22162efcfe922810fb070f))

## [1.1.0](https://github.com/QuentinGP23/PC_Aeris/compare/v1.0.0...v1.1.0) (2026-02-27)


### Features

* ajout système d'authentification complet avec Supabase ([499116a](https://github.com/QuentinGP23/PC_Aeris/commit/499116a2b3479a6f46bbc1ad315ae8cf77ce6a7d))
* ajout vérification que les PR vers main viennent de develop ([87f3ea8](https://github.com/QuentinGP23/PC_Aeris/commit/87f3ea8ad69fd80cce2264c9a7e6539eb24dd18b))


### Bug Fixes

* check-branch ne s'exécute que sur les PR vers main ([8d82b82](https://github.com/QuentinGP23/PC_Aeris/commit/8d82b8293e60a85644a173871503fecaea0cdd22))
* correction sauvegarde pseudo et téléphone à l'inscription ([0b49bd1](https://github.com/QuentinGP23/PC_Aeris/commit/0b49bd17a84066b01424ab1008dd652df578b688))

## 1.0.0 (2026-01-30)


### ⚠ BREAKING CHANGES

* clean restart - suppression des composants et pages pour repartir sur de bonnes bases

### Code Refactoring

* clean restart - suppression des composants et pages pour repartir sur de bonnes bases ([eb4d576](https://github.com/QuentinGP23/PC_Aeris/commit/eb4d57663ff6359e38db57412a9015d6f7ebd5c1))
