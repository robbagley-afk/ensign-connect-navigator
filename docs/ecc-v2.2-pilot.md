# ECC v2.2 pilot

Source main: 220d792970b230eabf43515215fe5c685b9dfa50. Design system and auditor: robbagley-afk/ensign-design-system at fdcee86079b64c4e7b1e2be2c9c96d21e5b527f0.

Re-vendors all four shared CSS files, removes header/main width caps, aligns their responsive gutters and makes three inline grids fit narrower panels. Adds a network favicon at /favicon.ico and a secret-free pinned ECC audit caller. No outreach-generation or backend behavior changes.

Baseline: six static FAILs (two stale assets, four width caps). Final static audit: 0 FAIL, 0 WARN. Runtime checks: all five onboarding states pass with 0 FAIL, 0 WARN at 320,375,768,1440,1920. The outreach-state 320px check originally overflowed by 4px. A browser experiment changed only the 220px intrinsic grid minimum and reduced scrollWidth from 324 to 320. The source now uses minmax(min(100%,220px),1fr). All public/static files match byte for byte.

Remaining before release: hosted preview verification and required Claude design sign-off. The helper GitHub connector returned opaque references during preflight, so review must use a supplied verified diff rather than unverified source-read claims. No production deployment or merge is authorized by this record.

## Interaction and visual checks

Persistent Edge Beta captures at [375px landing before the sticky-panel correction](ecc-v2.2-shots/landing-375.png), [1440px landing](ecc-v2.2-shots/landing-1440.png), [375px outreach](ecc-v2.2-shots/outreach-375.png) and [1440px outreach](ecc-v2.2-shots/outreach-1440.png) were inspected. Isolated headless screenshot capture stalled, while the owning persistent MCP screenshot operation worked.

Native mobile mouse testing exposed an existing sticky-sidebar overlay missed by the DOM audit. At 375px the sidebar covered the main form, intercepted its Generate button and caught wheel events. Setting the stacked sidebar to position:static, max-height:none and overflow:visible below the existing 992px desktop breakpoint restored the native click and page scrolling. The source fix preserves desktop behavior. A repeat native click received HTTP200 and rendered the fictional draft. Page wheel movement changed scrollY from0 to600 at375 and1440. Montserrat loading and /favicon.ico200 image/x-icon were checked.

The app generates deterministic outreach text and has no upload/LLM flow, so resume-upload/AI-reply checks are not applicable. Fictional Student and Example Mentor were the only sample people entered. Nothing was sent to PeopleGrove or another person.

Initial independent helper review of the supplied diff returned NO FINDINGS. Its explanation incorrectly inferred a16px gutter at320, so that inference is rejected. Actual token CSS sets12px there. The follow-up review of the mobile sidebar fix also returned NO FINDINGS. Helper source-read preflight failed honestly on opaque file handles, so no GitHub-read claim is accepted.

GitHub ECC check observed: ecc-audit / ecc-audit, successful. First preview deployed automatically for3d3c933, while production remained220d792. Final code commit3df742807d4e109471589327724dd5940bee6f49 passed both observed ECC jobs. Its Preview deployment7214516343 succeeded. The protected preview redirected the dedicated Edge Beta session to Vercel sign-in, so hosted form behavior is not yet verified. No alternate authenticated surface or protection bypass was used. Required Claude design sign-off is not complete.

## Current hold

Keep this PR as a draft until the protected preview can be checked and Claude design sign-off is recorded. Vercel login is open in the owning Edge Beta tab. Resume there after Rob signs in and replies go. Do not merge or deploy production from this pilot without the existing publication authorization.

Review conversation: [supplied-diff and mobile-fix review](https://m365.cloud.microsoft/chat/agent/T_f14842f5-33be-4845-fed9-3991fee2e5ea.da0360c5-0abe-406e-ad17-e735f454fc15/conversation/0ef18206-3b3f-49d1-a141-511c45dc84a3). Two review messages, no helper implementation batches, no local-model offloads and no paid native agents. Exact changes and root-cause-confirmed CSS fixes were small enough for deterministic/inline application.
