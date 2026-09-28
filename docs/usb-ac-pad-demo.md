# USB AC Coupling Pad demo

- Solution card: `/solution`
- Landing page: `/web-tools/usb-ac-pad`
- Standalone offline demo: `/tools/usb-ac-pad/index.html`
- Release: GUI11, 2026-09-28. Static browser computation, no server inference or MCP endpoint.
- Artifact SHA256: `803c1e0f5c19d7380e5ab49ac80aecd7d96b2c084b772e1a7c0f49ae00d237ed`
- Embedded model SHA256: `7ce31a6db29306edce892de6842fb734a78ea146214136515e78ae2f1afa99f3`

The HTML contains the public educational model and reference pilot data. It is intentionally downloadable. Component files selected by visitors are processed locally, not uploaded. No manufacturer component files, HFSS projects, credentials, or DOE workspace are bundled.

Scope: 24 HFSS training cases, 6 development cases; independent final validation pending. Fixed 1.6 mm four-layer board, outer dielectric h=0.1 mm, 0402 inch footprint. Model RF band 10 MHz–12.5 GHz; DC extrapolated. Imported series S2P uses the common RF band only. SPICE input supports a passive two-terminal RLC subset. No compliance/manufacturing qualification claim.

GUI11 was checked with 18 DOM callback regression cases, including the supplied 6 GHz Samsung Simple/Precise models, and numerical impulse/trace checks. These do not constitute visual browser QA or measurement validation.

Deploy through the existing main-branch Vercel production integration. Updates should replace this single static artifact and update its hash. MCP is a future separate integration.
