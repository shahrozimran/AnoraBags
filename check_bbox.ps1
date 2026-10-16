Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("e:\AnoraBags\public\images\logo-transparent.png")
$minX = $img.Width; $minY = $img.Height; $maxX = 0; $maxY = 0

for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $p = $img.GetPixel($x, $y)
        if ($p.A -gt 30) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Bounding box: X=$minX..$maxX (Width=$($maxX-$minX)), Y=$minY..$maxY (Height=$($maxY-$minY))"
$img.Dispose()
