# Security Policy

## Scope

FBI UFO Archive KR is a static Astro reader and public dataset repository. It
does not require user accounts, store user secrets, or process private user
data in the public reader.

Security reports are in scope when they affect:

- The static reader application under `src/`.
- Published static assets under `public/`.
- Build or deployment configuration that could expose private files.
- Public dataset integrity in `data/` or `dataset/`.

Out of scope:

- Claims about source-document interpretation.
- Translation disagreements without a security impact.
- Third-party availability issues on FBI Vault, GitHub, or Vercel.
- Source PDFs that are not included in this repository.

## Reporting

Do not publish exploit details, secrets, or private environment values in a
public issue.

If GitHub private vulnerability reporting is available for this repository, use
that channel. If it is not available, open a minimal public issue titled
`Security report contact needed` without exploit details, and a maintainer will
arrange a private follow-up.

## Supported Version

Security fixes target the current `main` branch and the production static reader
deployed at:

https://ufo.n2f.site

## Disclosure

The project will avoid publishing exploit details until a fix is available or
the affected deployment path is no longer active.
