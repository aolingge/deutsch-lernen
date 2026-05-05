param(
    [Parameter(Position = 0)]
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

$gitRoot = (& git -C $Path rev-parse --show-toplevel).Trim()
if (-not $gitRoot) {
    throw "Not inside a git repository."
}

& (Join-Path $gitRoot "tools/privacy-scan.ps1") $gitRoot

$markdownFiles = & git -C $gitRoot ls-files --cached --others --exclude-standard -- "*.md"
$missing = @()

foreach ($relative in $markdownFiles) {
    $filePath = Join-Path $gitRoot $relative
    if (-not (Test-Path -LiteralPath $filePath)) {
        continue
    }

    $text = Get-Content -LiteralPath $filePath -Raw
    $matches = [regex]::Matches($text, "\[[^\]]+\]\(([^)]+)\)")
    foreach ($match in $matches) {
        $target = $match.Groups[1].Value.Trim()
        if (
            -not $target -or
            $target.StartsWith("http://") -or
            $target.StartsWith("https://") -or
            $target.StartsWith("mailto:") -or
            $target.StartsWith("#")
        ) {
            continue
        }

        $target = $target.Trim("<", ">").Split("#")[0]
        if (-not $target) {
            continue
        }

        $candidate = Join-Path (Split-Path -Parent $filePath) ([uri]::UnescapeDataString($target))
        if (-not (Test-Path -LiteralPath $candidate)) {
            $missing += "$relative -> $($match.Groups[1].Value)"
        }
    }
}

if ($missing.Count -gt 0) {
    $missing | ForEach-Object { Write-Error $_ }
    throw "Markdown link check failed."
}

Write-Host "Publication check passed for $($markdownFiles.Count) Markdown files"
