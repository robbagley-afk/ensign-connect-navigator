# ECC v2.2 pilot

Source main: 220d792970b230eabf43515215fe5c685b9dfa50. Design system and auditor: robbagley-afk/ensign-design-system at fdcee86079b64c4e7b1e2be2c9c96d21e5b527f0.

Re-vendors all four shared CSS files, removes header/main width caps, aligns their responsive gutters and makes three inline grids fit narrower panels. Adds a network favicon at /favicon.ico and a secret-free pinned ECC audit caller. No outreach-generation or backend behavior changes.

Baseline: six static FAILs (two stale assets, four width caps). Final static audit: 0 FAIL, 0 WARN. Runtime checks: all five onboarding states pass with 0 FAIL, 0 WARN at 320,375,768,1440,1920. The outreach-state 320px check originally overflowed by 4px. A browser experiment changed only the 220px intrinsic grid minimum and reduced scrollWidth from 324 to 320. The source now uses minmax(min(100%,220px),1fr). All public/static files match byte for byte.

Remaining before release: screenshots/interaction results, independent helper review, GitHub check result and hosted preview verification. The helper GitHub connector returned opaque references during preflight, so review must use a supplied verified diff rather than unverified source-read claims. No production deployment or merge is authorized by this record.
