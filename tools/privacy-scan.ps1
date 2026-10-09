param(
    [Parameter(Position = 0)]
    [string]$Path = ".",
    [string]$ReportPath
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath $Path
$patterns = @(
    @{ Name = "email"; Regex = "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" },
    @{ Name = "phone-like"; Regex = "(\+?\d[\d \t().-]{7,}\d)" },
    @{ Name = "id-card-like"; Regex = "\b\d{17}[\dXx]\b" },
    @{ Name = "token-like"; Regex = "(ghp_|gho_|sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}|xox[baprs]-|AKIA[0-9A-Z]{16})" },
    @{ Name = "private-key"; Regex = "BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY" },
    @{ Name = "password-word"; Regex = "(?i)(password|passwd|pwd|secret|token|cookie|api[_-]?key)\s*(?::|=(?!=|>))" },
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
        $_.Extension -notin @('.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico') -and
        $normalized -notmatch "\\web\\worker-configuration\.d\.ts$" -and
        $normalized -notmatch "\\web\\dist\\" -and
        $normalized -notmatch "\\web\\\.astro\\" -and
        $normalized -notmatch "\\web\\\.wrangler\\" -and
        $normalized -notlike "*\tools\privacy-scan.ps1" -and
        $normalized -notmatch "\\private\\" -and
        $normalized -notmatch "\\raw\\" -and
        $normalized -notmatch "\\source(s)?\\" -and
        -not ($localOnlyPathRegex | Where-Object { $normalized -match $_ })
    }

$hits = @()

function Test-ContainedHit {
    param([string]$Line, [int]$Index, [int]$Length, [string]$Expression)
    foreach ($context in [regex]::Matches($Line, $Expression)) {
        $range = if ($context.Groups['safe'].Success) { $context.Groups['safe'] } else { $context }
        if ($Index -ge $range.Index -and ($Index + $Length) -le ($range.Index + $range.Length)) { return $true }
    }
    return $false
}

function Test-AllowedHit {
    param(
        [string]$File,
        [string]$Type,
        [string]$Line,
        [string]$Value,
        [int]$Index
    )

    $normalized = $File -replace "/", "\"
    # Allow only exact reviewed non-private numbers, not every match on a line.
    if ($Type -eq 'phone-like') {
        $technicalRanges = @(
            '(?i)\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b',
            '\b\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?',
            'https?://127\.0\.0\.1(?::\d+)?(?:/[^\s"''<>`]*)?',
            'https?://[^\s"''<>`]+/(?:[^\s"''<>`]*/)*(?:assets|_Resources|Static|Packages|media|images|icons)/[^\s"''<>`]+',
            '(?i)\b(?:viewBox|points|d)\s*=\s*\\?["''](?<safe>[0-9a-z.,+ \t-]+)\\?["'']',
            '(?i)"(?:sha256|exportSha256)"\s*:\s*"(?<safe>[a-f0-9]{64})"'
        )
        foreach ($expression in $technicalRanges) {
            if (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression $expression) { return $true }
        }
        if ($normalized -match '\\web\\data\\site-icons\.json$' -and
            (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression '"source"\s*:\s*"(?<safe>https?://[^"\s]+)"')) { return $true }
        if ($normalized -match '\\docs\\reading-resource-expansion-20261007\.md$' -and
            (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression 'https://www\.klett-sprachen\.de/[^\s)]+/97[89]\d{10}')) { return $true }
        if ($normalized -match '\\web\\public\\reader\\data\\reading-stats\.json$' -and
            (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression '"(?:totalHoursAt\d+Wpm|addedHoursAt\d+Wpm|hoursAt\d+Wpm)"\s*:\s*(?<safe>\d+\.\d+)')) { return $true }
        if ($Value -eq '127.0.0.1' -and $normalized -match '\\web\\tests\\[^\\]+\.py$') { return $true }
        if ($normalized -match '\\web\\public\\og-directory\.svg$' -and $Value -eq '0 0 1200 630' -and $Line -match 'viewBox="0 0 1200 630"') { return $true }
        if ($normalized -match '\\web\\public\\reader\\index\.html$' -and $Value -eq '0 0 32 32' -and $Line -match "viewBox='0 0 32 32'") { return $true }
        if ($normalized -match '\\web\\public\\reader\\data\\(?:books\.js|(?:books|translations)\\\d+(?:\\\d+)?\.json)$' -and
            $Value -in @('64-6221541', '+1 (862) 621-9288')) { return $true }
        if ($normalized -match '\\web\\public\\reader\\reader-sync\.js$' -and
            (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression '\b512\s*\*\s*(?<safe>1024\s*-\s*16)\b')) { return $true }
    }
    if ($Type -eq "phone-like" -and $Line -match '127\.0\.0\.1' -and $normalized -match '\\web\\e2e\\public_site\.py$') { return $true }
    if ($Type -eq "phone-like" -and $normalized -match "\\README(\.en)?\.md$" -and $Line -match "shields\.io") { return $true }
    if ($Type -eq "phone-like" -and
        $normalized -match "\\.github\\workflows\\" -and
        $Line -match "uses:\s+\S+@[0-9a-f]{40}(\s|#|$)") {
        return $true
    }

    if ($Type -eq "phone-like" -and
        (($normalized -match "\\web\\package\.json$" -and $Line -match "127\.0\.0\.1") -or
         ($normalized -match "\\web\\wrangler\.jsonc$" -and $Line -match "database_id") -or
         ($normalized -match "\\web\\src\\layouts\\BaseLayout\.astro$" -and $Line -match "viewBox"))) {
        return $true
    }

    if ($Type -eq "phone-like" -and $normalized -match "\\web\\package-lock\.json$" -and ($Line -match '"(integrity|version|resolved|node)"\s*:' -or $Line -match '":\s*"[\^~]?\d+(?:\.\d+)+(?:[-+\w.]*)"' -or $Line -match '"workerd"\s*:\s*"[<>^~]?\d+\.\d{8,}\.\d+')) {
        return $true
    }

    if ($Type -ne "password-word") {
        return $false
    }

    if ($normalized -match '\\web\\public\\reader\\app\.js$' -and
        (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression '\btoken\s*(?::\s*0\b|=\s*(?:\+\+)?speechState\.token\b)')) { return $true }

    if ($normalized -match '\\web\\public\\reader\\reader-sync\.js$' -and
        (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression '\btoken\s*:\s*(?:parts\[2\]|random\(32\))')) { return $true }
    if ($normalized -match '\\web\\worker\\reader-sync\.mjs$' -and
        (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression '\btoken\s*=\s*request\.headers\.get\(''authorization''\)')) { return $true }
    if ($normalized -match '\\web\\tests\\reader-sync\.test\.mjs$' -and
        (Test-ContainedHit -Line $Line -Index $Index -Length $Value.Length -Expression '\btoken\s*=\s*''cd''\.repeat\(32\)')) { return $true }

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
            $lineStart = $text.LastIndexOf("`n", [Math]::Max(0, $match.Index - 1)) + 1
            if (Test-AllowedHit -File $file.FullName -Type $pattern.Name -Line $line -Value $match.Value -Index ($match.Index - $lineStart)) {
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
    $safeHits = @($hits | Select-Object File, Line, Type)
    if ($ReportPath) {
        ConvertTo-Json -InputObject $safeHits -Depth 3 | Set-Content -LiteralPath $ReportPath -Encoding UTF8
    }
    $safeHits | Format-Table -AutoSize
    Write-Error "Privacy scan found suspicious content. Review before publishing."
}

if ($ReportPath) {
    '[]' | Set-Content -LiteralPath $ReportPath -Encoding UTF8
}

Write-Host "Privacy scan passed for $root"
