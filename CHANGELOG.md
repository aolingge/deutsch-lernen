# Changelog

这个文件记录仓库中对公开学习者有用的内容更新。它不是个人学习日志，也不记录本地私有资料来源。

## 2026-05-05

- Added A1-C1 self-check drills, original DSH module exercises, a B2-C1 academic expression bank, a vocabulary review loop, and a Germany-prep scenario German phrasebook.
- Expanded the repository from a B1-focused scaffold into an A1-C1 learning system with per-level routes, grammar progression, four-skill training, DSH/TestDaF/C1 guidance, and reusable weekly/DSH templates.
- Added Germany-prep pages for study application, visa/residence navigation, APS/uni-assist, housing/Anmeldung, banking/insurance, healthcare, transport, work/internship, recognition, and core glossary.
- Added official-resource indexes and safety boundaries for publishing only sanitized reusable Markdown and external links.

## 2026-04-22

- Added a README quick start section for B1 learning, exam preparation, Germany life topics, and public resources.
- Added official Germany life entry points for integration courses, adult migration advice, visa information, work and settlement guidance, and professional qualification recognition.
- Added a public-content security policy for reporting accidental private data, credentials, or copyrighted material.

## 2026-04-27

- Added a public backlog to show the next documentation priorities and acceptance criteria for contributors.

## Release checklist

Before turning a local documentation update into a public release note, run:

```powershell
pwsh ./tools/privacy-scan.ps1 .
```

If `agent-secret-guard` is available locally, also run:

```powershell
npx agent-secret-guard scan . --fail-on high
```
