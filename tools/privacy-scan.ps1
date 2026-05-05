param(
    [Parameter(Position = 0)]
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath $Path
$patterns = @(
    @{ Name = "email"; Regex = "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" },
    @{ Name = "phone-like"; Regex = "(\+?\d[\d\s().-]{7,}\d)" },
    @{ Name = "id-card-like"; Regex = "\b\d{17}[\dXx]\b" },
    @{ Name = "token-like"; Regex = "(ghp_|gho_|sk-[A-Za-z0-9]|xox[baprs]-|AKIA[0-9A-Z]{16})" },
    @{ Name = "private-key"; Regex = "BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY" },
    @{ Name = "password-word"; Regex = "(?i)(password|passwd|pwd|secret|token|cookie|api[_-]?key)\s*[:=]" },
    @{ Name = "windows-private-path"; Regex = "[A-Z]:\\Users\\[^\\\s]+" },
    @{ Name = "obsidian-private-path"; Regex = "[A-Z]:\\笔记保存obstian|[A-Z]:\\.*Obsidian|[A-Z]:\\.*OneNote" }
)

$localOnlyPathRegex = @(
    "\\docs\\maintenance\\",
    "\\scripts\\ralph\\",
    "\\.codex\\",
    "\\.omx\\",
    "\\.obsidian\\",
    "\\00_Inbox\\",
    "\\90_System\\"
)

$files = Get-ChildItem -LiteralPath $root -Recurse -File -Force |
    Where-Object {
        $normalized = $_.FullName -replace "/", "\"
        $normalized -notmatch "\\.git\\" -and
        $normalized -notmatch "\\node_modules\\" -and
        $normalized -notlike "*\tools\privacy-scan.ps1" -and
        $normalized -notmatch "\\private\\" -and
        $normalized -notmatch "\\raw\\" -and
        $normalized -notmatch "\\source(s)?\\" -and
        -not ($localOnlyPathRegex | Where-Object { $normalized -match $_ })
    }

$hits = @()

function Test-AllowedHit {
    param(
        [string]$File,
        [string]$Type,
        [string]$Line
    )

    if ($Type -ne "password-word") {
        return $false
    }

    $normalized = $File -replace "/", "\"
    if ($normalized -match "\\.github\\workflows\\" -and $Line -match "secrets\.GITHUB_TOKEN") {
        return $true
    }

    if ($normalized -match "\\scripts\\maintenance-digest\.mjs$" -and $Line -match "GITHUB_TOKEN|Bearer \`\$\{token\}|token[,:=]") {
        return $true
    }

    return $false
}

foreach ($file in $files) {
    $text = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($null -eq $text) {
        continue
    }

    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($text, $pattern.Regex)
        foreach ($match in $matches) {
            if ($pattern.Name -eq "phone-like" -and $match.Value -match "^\d{4}-\d{2}-\d{2}$") {
                continue
            }

            $lineNumber = ($text.Substring(0, $match.Index) -split "`n").Count
            $line = ($text -split "`r?`n")[$lineNumber - 1]
            if (Test-AllowedHit -File $file.FullName -Type $pattern.Name -Line $line) {
                continue
            }

            $hits += [pscustomobject]@{
                File = $file.FullName
                Line = $lineNumber
                Type = $pattern.Name
                Match = $match.Value.Substring(0, [Math]::Min($match.Value.Length, 80))
            }
        }
    }
}

if ($hits.Count -gt 0) {
    $hits | Format-Table -AutoSize
    Write-Error "Privacy scan found suspicious content. Review before publishing."
}

Write-Host "Privacy scan passed for $root"
