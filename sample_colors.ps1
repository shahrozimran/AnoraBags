Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("e:\AnoraBags\WhatsApp Image 2026-10-16 at 5.09.08 PM.jpeg")
$counts = @{}
for ($y = 200; $y -lt 1100; $y += 2) {
    for ($x = 200; $x -lt 1100; $x += 2) {
        $p = $img.GetPixel($x, $y)
        if ($p.GetBrightness() -lt 0.35) {
            $hex = "#$($p.R.ToString('X2'))$($p.G.ToString('X2'))$($p.B.ToString('X2'))"
            if ($counts.ContainsKey($hex)) { $counts[$hex]++ } else { $counts[$hex] = 1 }
        }
    }
}
$img.Dispose()
$sorted = $counts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 15
Write-Host "Dark brown colors:"
foreach ($item in $sorted) {
    Write-Host "$($item.Key): $($item.Value)"
}
