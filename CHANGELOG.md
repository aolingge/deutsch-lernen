# Changelog

这个文件记录仓库中对公开学习者有用的内容更新。它不是个人学习日志，也不记录本地私有资料来源。

## 2026-04-22

- Added a README quick start section for B1 learning, exam preparation, Germany life topics, and public resources.
- Added official Germany life entry points for integration courses, adult migration advice, visa information, work and settlement guidance, and professional qualification recognition.
- Added a public-content security policy for reporting accidental private data, credentials, or copyrighted material.

## Release checklist

Before turning a local documentation update into a public release note, run:

```powershell
pwsh ./tools/privacy-scan.ps1 .
```

If `agent-secret-guard` is available locally, also run:

```powershell
npx agent-secret-guard scan . --fail-on high
```
