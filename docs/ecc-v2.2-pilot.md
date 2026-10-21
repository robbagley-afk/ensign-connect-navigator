# ECC v2.2 pilot

Source main: 220d792970b230eabf43515215fe5c685b9dfa50. Design system and auditor: robbagley-afk/ensign-design-system at fdcee86079b64c4e7b1e2be2c9c96d21e5b527f0.

Re-vendors all four shared CSS files, removes header/main width caps, aligns their responsive gutters and makes three inline grids fit narrower panels. Adds a network favicon at /favicon.ico and a secret-free pinned ECC audit caller. No outreach-generation or backend behavior changes.

Baseline: six static FAILs (two stale assets, four width caps). Final static audit: 0 FAIL, 0 WARN. Runtime checks: all five onboarding states pass with 0 FAIL, 0 WARN at 320,375,768,1440,1920. The outreach-state 320px check originally overflowed by 4px. A browser experiment changed only the 220px intrinsic grid minimum and reduced scrollWidth from 324 to 320. The source now uses minmax(min(100%,220px),1fr). All public/static files match byte for byte.

Remaining before release: screenshots/interaction results, independent helper review, GitHub check result and hosted preview verification. The helper GitHub connector returned opaque references during preflight, so review must use a supplied verified diff rather than unverified source-read claims. No production deployment or merge is authorized by this record.

## Interaction and visual checks

Persistent Edge Beta captures at [375px landing](ecc-v2.2-shots/landing-375.png), [1440px landing](ecc-v2.2-shots/landing-1440.png), [375px outreach](ecc-v2.2-shots/outreach-375.png) and [1440px outreach](ecc-v2.2-shots/outreach-1440.png) were inspected. Isolated headless screenshot capture stalled, while the owning persistent MCP screenshot operation worked.

Native mobile mouse testing exposed an existing sticky-sidebar overlay missed by the DOM audit. At 375px the sidebar covered the main form, intercepted its Generate button and caught wheel events. Setting the stacked sidebar to position:static, max-height:none and overflow:visible below the existing 992px desktop breakpoint restored the native click and page scrolling. The source fix preserves desktop behavior. A repeat native click received HTTP200 and rendered the fictional draft. Page wheel movement changed scrollY from0 to600 at375 and1440. Montserrat loading and /favicon.ico200 image/x-icon were checked.

The app generates deterministic outreach text and has no upload/LLM flow, so resume-upload/AI-reply checks are not applicable. Fictional Student and Example Mentor were the only sample people entered. Nothing was sent to PeopleGrove or another person.

Initial independent helper review of the supplied diff returned NO FINDINGS. Its explanation incorrectly inferred a16px gutter at320, so that inference is rejected. Actual token CSS sets12px there. A follow-up review covers only the mobile sidebar fix. Helper source-read preflight failed honestly on opaque file handles, so no GitHub-read claim is accepted.

GitHub ECC check observed: ecc-audit / ecc-audit, successful. First preview deployed automatically for3d3c933, while production remained220d792. Final preview and review verification remain pending. Required Claude design sign-off is not complete.
