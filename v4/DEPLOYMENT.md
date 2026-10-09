# V4 deployment and data operations

Implemented code, not a deployed or cloud-validated release. The normal API never falls back to browser scoring, anonymous identities or MemoryStore. MemoryStore is an explicitly injected adapter used by independent tests only.

## Required configuration

- Node 22, `npm ci`, build whitelist `dist`; browser files only, no question banks, answer generators, server code or secrets in publish directory.
- `FIREBASE_ADMIN_SERVICE_ACCOUNT`: JSON service account supplied as a server secret. `V4_ENVIRONMENT=production` or `qa` (legacy `V4_ENV` supported). `V4_PRODUCTION_PROJECT_ID`; previews additionally require a distinct `V4_QA_PROJECT_ID` equal to the credential's project. Never reuse production credentials in preview.
- `V4_FIREBASE_PUBLIC_API_KEY`: public Firebase Auth configuration. Enable durable Firebase email/password or another durable provider in the chosen project. An anonymous token is rejected.
- Create trusted `profiles/{uid}` records server-side: student `parentUids`; parent `role:parent`, `studentUids`. Administrator privileges are server-managed `role:admin`. Reciprocal verified parent links govern notifications; parent access to a student requires trusted `studentUids`.
- Optional live help: `OPENAI_API_KEY`, `V4_COACH_MODEL`. Missing/provider-error help is explicitly labelled prepared help without AI. API also persists a six requests/minute quota per student context; test-phase help is rejected before any provider call.
- Live notifications: `RESEND_API_KEY`, verified `V4_EMAIL_FROM`; parent profile `notificationEmail` and `notificationEmailVerified:true`. Dispatcher sends only to reciprocal linked parent profiles. Preview/QA disables external delivery. Provider acceptance is recorded separately from actual receipt.

The function returns 503 without configured server persistence; it does not pretend that cloud synchronisation succeeded. Firebase public configuration only becomes available after backend configuration passes. An isolated QA project remains necessary before testing real cloud behaviour.

## API and persistence

POST `/.netlify/functions/v4-api`, JSON `{action,...payload}`, `Authorization: Bearer <Firebase ID token>`. Server verifies revocation, owner or trusted parent link. Successful response `{ok:true,data}`, error `{ok:false,error}`. `mode:'qa'` must be present on each QA request. Production can enable integrated quality testing only with optional `FIREBASE_QA_SERVICE_ACCOUNT` whose project equals `V4_QA_PROJECT_ID` and differs from production; authentication uses the normal durable identity but all QA writes are routed to the separate project. It uses `qaStudents`, separately from ordinary fictitious `students` data in that deployment. Production without that separate QA store refuses QA mode and exposes `qaAvailable:false`.

Actions: `config`, `dashboard`, `create`, `practice`, `startTest`, `answer`, `finish`, `abandon`, `help`, `feedback`, `redeem`, `migrate`. No HTTP action accepts score/XP as authority. The initial fifteen answers are persisted; exactly ten practice answers precede test, exactly fifteen distinct expected answers precede completion. Retrying submission returns the initial answer. Test response DTOs contain neither correctness nor corrections until completion. Theory and AI help are absent during test.

Firestore transaction adapter splits sessions, journal, history, daily counters, notification events and request IDs into separate documents; profile/progression/XP remain in the student root. Functions are sole access path; proposed rules deny direct client access. Do **not** blindly apply the blanket rules to an existing V3 project while V3 remains in production: use isolated V4 QA first, audit existing collections and perform the controlled production cutover. Admin SDK bypasses rules and therefore performs API authorisation itself.

Transactions read the student's aggregate subcollections to execute pure rules and write only changed records. This is suitable for the initial small deployment but reads grow with retained history. Profile transaction contention and Firestore read costs must be observed; replace aggregate reads with scoped session/counter/journal reads before history becomes large. No document combines all question banks or all historical sessions.

Email events use provider idempotency keys. Failure leaves a retriable event and does not roll back a completed session. Repeated normal practice/finish requests retry pending/failed events. The production-only `v4-notification-retry` scheduled Netlify function runs every five minutes and examines at most twenty outbox records, attempting at most two sends per run within a twenty-second work budget. It requires the same production credentials and recipient verification as normal dispatch; QA does not dispatch. A transaction lease prevents overlapping send claims, exponential backoff bounds retries, and the exact request body is frozen for provider idempotency. An uncertain event after 23 hours, or a revoked recipient, is held as `review` for provider reconciliation rather than resent blindly. Resend retains idempotency keys for 24 hours. Provider acceptance is not inbox receipt; delivery webhooks remain unimplemented. Configure the collection-group single-field `notifications.status` index from `firestore.indexes.json` in the isolated V4 project before enabling retry, preserving any existing indexes; do not replace a production index catalogue blindly. Check scheduler execution and failed/review outbox items in the cloud validation rehearsal. The query is a bounded unordered page: twenty blocked/unverified or deferred events can delay newer ready events. This small-deployment worker needs ready-time ordering/pagination before higher outbox volume; monitor backlog rather than raising the limit blindly. Official references: https://docs.netlify.com/build/functions/scheduled-functions/ and https://resend.com/changelog/idempotency-keys .

## Backup and migration

1. Verify code backup commit/tag and export existing Firestore/local data with provenance. Restore a copy to the isolated project and record a checksum. Never publish pupil backups or credentials in Git.
2. Read genuine V3 source state, whose history is `sessions`, progression `englishTopicV31`/`mathTopicV31`, last activity `lastDay`, and rewards `redemptions`. Mapping uses the matching historical catalogue order, not a newly sorted order. Keep original fields and all unknown metadata.
3. Run `planMigration` or administrator `migrate` dry run. It preserves source XP exactly and does not infer unrecorded gains. It retains legacy sessions, score fields, progression by stable chapter ID, inactivity base and redemption history in migration provenance. Daily completed-session counters and known successful chapter IDs are rebuilt only from documented, dated normal legacy sessions, without recalculating XP. Conflicting histories or nonempty V4 targets require explicit reconciliation; never merge by selecting maximum XP.
4. Test reapplication, identity matching, old/new chapter mapping and totals on copies. Administrator flags in the preview API are test aids, not proof of backup or identity. Production API refuses migration mutation.
5. Production requires a controlled operator job using `applyMigration` only after recorded backup restoration and identity approval; credentials are unavailable in this environment. Cutover and rollback must preserve newly created V4 data, not restore an old export over them.

Source redemption records remain in provenance; they do not trigger a second deduction. No claim of exact lost XP recovery without recorded successful sessions. Snapshot rules are stored with each session. Configuration, real Auth/Firestore integration, provider delivery, restore rehearsal and production publication remain unvalidated until independently tested.

## Reproducible release checks

Run from the repository root on Node 22:

```sh
npm ci
npm run check
node scripts/build-v4.mjs
npx playwright install --with-deps chromium
node --test tests/v4-e2e.spec.mjs
```

Use a provisioned Chromium for Playwright; the tests run against an injected local test store and do not establish real Firestore/Auth/provider validation. Netlify runs unit checks and the whitelist build. Before release, verify in the isolated cloud deployment: durable student and linked parent sign-in, independent QA project isolation, first completion and retried completion across reconnect, 79/80 percent progression, both daily limits and Brussels midnight, notifications with recipient links and scheduled retry, and help disabled in test. Record deployed commit and actual visible version. Missing keys/project access block these cloud checks and production certification.

Migration provenance is stored as a private checksummed JSON archive in `migrationArchive` subdocuments, each below 64 KiB. The student root keeps only a pointer, version and checksums. Reads reconstruct and verify the archive; a missing or changed chunk fails closed. Unit fixtures verify Unicode round-trip, corruption detection and root size. Transactions refuse more than 450 writes, archives above 400 chunks, or an aggregate write budget reaching 5 MiB (serialized values plus paths and 4 KiB per-document overhead) before any write. This conservative limit reserves headroom below Firestore’s transaction request limit; a large genuine export/history requires a staged operator import, not evidence truncation. The archive and the student target must be included in operator backup/restore rehearsal.
