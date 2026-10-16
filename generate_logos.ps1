Add-Type -AssemblyName System.Drawing
$sourcePath = "e:\AnoraBags\WhatsApp Image 2026-10-16 at 5.09.08 PM.jpeg"
$destOriginal = "e:\AnoraBags\public\images\logo.jpeg"

# Copy original to public
Copy-Item $sourcePath $destOriginal -Force
Write-Host "Copied original to $destOriginal"

$img = [System.Drawing.Bitmap]::FromFile($sourcePath)
$width = $img.Width
$height = $img.Height

# 1. Create transparent version (where background light skin ~ #ECE2D8 is transparent, brown ~ #462F1D is kept)
$transparentImg = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
# Also create a light/white/skin-colored logo for dark backgrounds
$lightImg = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background color target: R=236, G=226, B=216
# Let's compute color distance or luminance for smooth anti-aliased transparency
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $p = $img.GetPixel($x, $y)
        
        # Calculate how "dark" the pixel is compared to the light background
        # Light skin background is around luminance 0.85 - 0.93
        # Dark brown is around luminance 0.15 - 0.25
        # Let's compute distance from background color (236, 226, 216)
        $diffR = 236 - $p.R
        $diffG = 226 - $p.G
        $diffB = 216 - $p.B
        $diff = [Math]::Sqrt($diffR*$diffR + $diffG*$diffG + $diffB*$diffB)
        
        # If difference is very small, it's background -> alpha = 0
        if ($diff -lt 15) {
            $transparentImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 70, 47, 29))
            $lightImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 236, 226, 216))
        } elseif ($diff -ge 15 -and $diff -lt 55) {
            # Smooth blend edge
            $alpha = [int](($diff - 15) / 40.0 * 255)
            if ($alpha -gt 255) { $alpha = 255 }
            $transparentImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 70, 47, 29))
            $lightImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 236, 226, 216))
        } else {
            # Logo foreground
            $transparentImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
            # For dark mode: convert dark brown to light skin/cream #ECE2D8
            $lightImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 236, 226, 216))
        }
    }
}

$transparentPath = "e:\AnoraBags\public\images\logo-transparent.png"
$lightPath = "e:\AnoraBags\public\images\logo-light.png"

$transparentImg.Save($transparentPath, [System.Drawing.Imaging.ImageFormat]::Png)
$lightImg.Save($lightPath, [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
$transparentImg.Dispose()
$lightImg.Dispose()

Write-Host "Generated transparent and light logo PNGs successfully!"
