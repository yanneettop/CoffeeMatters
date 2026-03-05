Get-ChildItem -Path public -Recurse -File | Where-Object { $_.Extension -match '\.(jpg|png|webp|avif)$' } | Sort-Object Length -Descending | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 1)
    Write-Host "$sizeKB KB - $($_.FullName)"
}
