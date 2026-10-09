param(
  [string]$PdfDirectory = (Split-Path -Parent $PSScriptRoot),
  [string]$OutputDirectory = (Join-Path $PSScriptRoot 'data'),
  [string]$ManifestPath = (Join-Path $PSScriptRoot 'books-manifest.json'),
  [switch]$ReuseExistingPdfData
)

$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

if (-not (Test-Path -LiteralPath $ManifestPath)) { throw "Manifest not found: $ManifestPath" }
$books = @(Get-Content -LiteralPath $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json)
if ($books.Count -eq 0) { throw 'The book manifest is empty.' }

function Convert-ToPlainText([string]$html) {
  $value = [regex]::Replace($html, '<[^>]+>', ' ')
  $value = [System.Net.WebUtility]::HtmlDecode($value)
  return (($value -replace '\s+', ' ').Trim())
}

function Normalize([string]$value) {
  return (($value.Normalize() -replace '\u00ad', '' -replace '\s+', '').Trim()).ToLowerInvariant()
}

function Read-TranslationMap([string]$path) {
  $map = @{}
  if ([string]::IsNullOrWhiteSpace($path) -or -not (Test-Path -LiteralPath $path)) { return $map }
  $html = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  foreach ($paragraph in [regex]::Matches($html, '<p\b[^>]*>([\s\S]*?)</p>', 'IgnoreCase')) {
    $block = $paragraph.Groups[1].Value
    $translated = [regex]::Match($block, 'translate-content="">([\s\S]*?)</acronym>', 'IgnoreCase')
    if (-not $translated.Success) { continue }
    $sourceHtml = [regex]::Replace($block, '<eudic-translate-content-web-element[\s\S]*?</eudic-translate-content-web-element>', ' ', 'IgnoreCase')
    $source = Convert-ToPlainText $sourceHtml
    $target = Convert-ToPlainText $translated.Groups[1].Value
    if ($source.Length -gt 2 -and $target.Length -gt 0) { $map[(Normalize $source)] = $target }
  }
  return $map
}

function Read-BookParagraphs([string]$path, [string]$displayTitle) {
  $raw = (& pdftotext -layout -nopgbrk -- $path - 2>$null) -join "`n"
  $lines = $raw -split "`r?`n"
  $clean = New-Object System.Collections.Generic.List[string]
  $started = $false
  foreach ($line in $lines) {
    $value = ($line -replace '\s+$', '').Trim()
    $startMarker = ($value -replace '\s+', ' ')
    if ($startMarker -match '^\*\*\*\s+START\s+OF\s+THE\s+PROJECT\s+GUTENBERG\s+EBOOK') { $started = $true; continue }
    if (-not $started) { continue }
    if ($value -eq '' -or $value -match ('^' + [regex]::Escape($displayTitle) + '.*\s+\d+(\s|$)')) {
      $clean.Add('')
      continue
    }
    $clean.Add($value)
  }
  $paragraphs = New-Object System.Collections.Generic.List[string]
  $buffer = New-Object System.Collections.Generic.List[string]
  foreach ($line in $clean) {
    if ($line -eq '') {
      if ($buffer.Count -gt 0) { $paragraphs.Add((($buffer -join ' ') -replace '\s+', ' ').Trim()); $buffer.Clear() }
    } else { $buffer.Add($line) }
  }
  if ($buffer.Count -gt 0) { $paragraphs.Add((($buffer -join ' ') -replace '\s+', ' ').Trim()) }
  return @($paragraphs | Where-Object { $_.Length -gt 2 -and $_ -notmatch '\*{3}' -and $_ -notmatch 'START\s+OF\s+THE\s+PROJECT\s+GUTENBERG' })
}

function Read-PlainTextParagraphs([string]$path, $book) {
  $raw = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  $raw = $raw -replace "`r`n", "`n"
  $start = [regex]::Match($raw, '(?ms)^\*{3}\s+START OF (?:THE )?PROJECT GUTENBERG EBOOK.*?$')
  if ($start.Success) { $raw = $raw.Substring($start.Index + $start.Length) }
  $end = [regex]::Match($raw, '(?ms)^\*{3}\s+END OF (?:THE )?PROJECT GUTENBERG EBOOK.*?$')
  if ($end.Success) { $raw = $raw.Substring(0, $end.Index) }
  $backMatter = switch ([string]$book.id) {
    '15' { '(?m)^\s*Inhalt\s*$' }
    '19' { '(?m)^Druck von Breitkopf' }
    '20' { '(?m)^Inhalt\.' }
    default { $null }
  }
  if ($backMatter) {
    $end = [regex]::Match($raw, $backMatter)
    if (-not $end.Success) { throw "Back matter marker missing: $($book.id)" }
    $raw = $raw.Substring(0, $end.Index)
  }
  if ($book.contentStart) {
    $start = [regex]::Match($raw, [string]$book.contentStart)
    if (-not $start.Success) { throw "Content start missing: $($book.id)" }
    $raw = $raw.Substring($start.Index)
  }
  if ($book.contentEnd) {
    $end = [regex]::Match($raw, [string]$book.contentEnd)
    if (-not $end.Success) { throw "Content end missing: $($book.id)" }
    $raw = $raw.Substring(0, $end.Index)
  }
  $blocks = $raw -split '(?m)(?:\r?\n){2,}'
  return @($blocks | ForEach-Object {
    $value = ($_ -replace '\r?\n', ' ' -replace '\s+', ' ').Trim()
    if ($value.Length -gt 2 -and $value -notmatch '^\[Illustration' -and $value -notmatch '^Project Gutenberg' -and $value -notmatch '^The Project Gutenberg' -and $value -notmatch '^This eBook is for the use' -and $value -notmatch '^You may copy it' -and $value -notmatch '^Language:\s+German' -and $value -notmatch '^Release date:' -and $value -notmatch '^Credits:' -and $value -notmatch '^Other information and formats:' -and $value -notmatch '^\[ ?Transcrib') { $value }
  })
}

$existing = @{}
if ($ReuseExistingPdfData) {
  $oldPath = Join-Path $OutputDirectory 'books.js'
  $oldJson = (Get-Content $oldPath -Raw -Encoding UTF8) -replace '^\s*window.GUTENBERG_BOOKS\s*=\s*', '' -replace ';\s*$', ''
  foreach ($oldBook in ($oldJson | ConvertFrom-Json)) { $existing[$oldBook.id] = $oldBook }
}
$result = foreach ($book in @($books | ForEach-Object { $_ })) {
  if ($ReuseExistingPdfData -and -not $book.sourceFile) {
    if (-not $existing.ContainsKey($book.id) -or $existing[$book.id].paragraphs.Count -eq 0) { throw "Existing PDF content missing: $($book.id)" }
    $existing[$book.id]
    continue
  }
  $sourcePath = if ($book.sourceFile) { Join-Path $PSScriptRoot ([string]$book.sourceFile) } else { Join-Path $PdfDirectory ([string]$book.pdf) }
  if (-not (Test-Path -LiteralPath $sourcePath)) { throw "Source not found for book $($book.id): $sourcePath" }
  $translationPath = if (-not [string]::IsNullOrWhiteSpace([string]$book.translation)) { Join-Path $PdfDirectory ([string]$book.translation) } else { $null }
  $translationMap = Read-TranslationMap $translationPath
  $cachePath = Join-Path $OutputDirectory ('translations/' + $book.id + '.json')
  if (Test-Path -LiteralPath $cachePath) {
    $cache = Get-Content -LiteralPath $cachePath -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($pair in $cache.paragraphs) {
      if ($pair.de -and $pair.zh) { $translationMap[(Normalize $pair.de)] = [string]$pair.zh }
    }
  }
  $paragraphs = if ($book.sourceFile) { Read-PlainTextParagraphs $sourcePath $book } else { Read-BookParagraphs $sourcePath $book.germanTitle }
  if ($paragraphs.Count -eq 0) { throw "Empty book: $($book.id)" }
  $content = foreach ($paragraph in $paragraphs) {
    [ordered]@{
      de = $paragraph
      zh = if ($translationMap.ContainsKey((Normalize $paragraph))) { $translationMap[(Normalize $paragraph)] } else { $null }
    }
  }
  [ordered]@{
    id = [string]$book.id
    title = $book.title
    germanTitle = $book.germanTitle
    author = $book.author
    level = $book.level
    study = $book.study
    source = if ($book.sourceFile) { $book.sourceFile } else { $book.pdf }
    sourceUrl = $book.sourceUrl
    licenseUrl = $book.licenseUrl
    downloadUrl = if ($book.downloadUrl) { $book.sourceFile } else { $null }
    difficulty = $book.difficulty
    length = $book.length
    genre = $book.genre
    chapterCount = $book.chapterCount
    translationStatus = if (@($content | Where-Object { $_.zh }).Count -eq @($content).Count) { 'complete' } elseif (@($content | Where-Object { $_.zh }).Count -gt 0) { 'partial-local' } else { 'not-imported' }
    paragraphs = @($content)
  }
}

foreach ($item in $result) {
  $wordCount = 0
  foreach ($paragraph in $item.paragraphs) {
    $wordCount += [regex]::Matches([string]$paragraph.de, "\p{L}+(?:[-'’]\p{L}+)*").Count
  }
  if ($item -is [System.Collections.IDictionary]) { $item.wordCount = $wordCount }
  else { $item | Add-Member -NotePropertyName wordCount -NotePropertyValue $wordCount -Force }
}
$json = @($result) | ConvertTo-Json -Depth 6 -Compress
Set-Content -LiteralPath (Join-Path $OutputDirectory 'books.js') -Encoding UTF8 -Value ('window.GUTENBERG_BOOKS = ' + $json + ';')
$summary = $result | ForEach-Object { '{0}: {1} paragraphs, {2}' -f $_.id, $_.paragraphs.Count, $_.translationStatus }
Set-Content -LiteralPath (Join-Path $OutputDirectory 'BUILD-SUMMARY.txt') -Encoding UTF8 -Value $summary
Write-Output $summary
