param([string]$ReaderDirectory = (Join-Path $PSScriptRoot '../../web/public/reader'))
$ErrorActionPreference = 'Stop'
$books = Get-Content (Join-Path $ReaderDirectory 'books-manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$records = foreach ($book in $books | Where-Object downloadUrl) {
  $target = Join-Path $ReaderDirectory $book.sourceFile
  New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
  $temporary = "$target.download"
  & curl.exe --fail --location --retry 2 --max-time 60 --silent --show-error --output $temporary $book.downloadUrl
  if ($LASTEXITCODE -ne 0) { throw "Download failed: $($book.id)" }
  $text = Get-Content $temporary -Raw -Encoding UTF8
  if ($text.Length -lt 20000 -or $text -match '^\s*<!DOCTYPE|^\s*<html' -or $text -notmatch '\*{3}\s+START OF (?:THE )?PROJECT GUTENBERG EBOOK' -or $text -notmatch 'Language:\s+German') {
    throw "Not a full German Gutenberg text: $($book.id)"
  }
  Move-Item -LiteralPath $temporary -Destination $target -Force
  Write-Host "$($book.id): downloaded $($text.Length) characters"
  [ordered]@{
    id = $book.id; title = $book.germanTitle; sourceUrl = $book.sourceUrl
    downloadUrl = $book.downloadUrl; licenseUrl = $book.licenseUrl
    downloadedAt = (Get-Date).ToUniversalTime().ToString('o')
    sha256 = (Get-FileHash $target -Algorithm SHA256).Hash.ToLowerInvariant()
  }
}
$records | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $ReaderDirectory 'data/source-records.json') -Encoding UTF8
