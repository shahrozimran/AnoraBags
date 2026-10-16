$sourcePath = "e:\AnoraBags\WhatsApp Image 2026-10-16 at 5.09.08 PM.jpeg"

$csharpIconGen = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class IconGenerator {
    public static void GenerateIcons(string sourcePath, string appleIconPath, string icon32Path) {
        using (Bitmap src = new Bitmap(sourcePath)) {
            // Apple icon (180x180)
            using (Bitmap apple = new Bitmap(180, 180)) {
                using (Graphics g = Graphics.FromImage(apple)) {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    // Draw src scaled to 180x180
                    g.DrawImage(src, new Rectangle(0, 0, 180, 180));
                }
                apple.Save(appleIconPath, ImageFormat.Png);
            }

            // 32x32 icon
            using (Bitmap icon32 = new Bitmap(32, 32)) {
                using (Graphics g = Graphics.FromImage(icon32)) {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.DrawImage(src, new Rectangle(0, 0, 32, 32));
                }
                icon32.Save(icon32Path, ImageFormat.Png);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharpIconGen -ReferencedAssemblies "System.Drawing.dll"
[IconGenerator]::GenerateIcons($sourcePath, "e:\AnoraBags\public\apple-icon.png", "e:\AnoraBags\public\icon-light-32x32.png")
Copy-Item "e:\AnoraBags\public\icon-light-32x32.png" "e:\AnoraBags\public\icon-dark-32x32.png" -Force
Write-Host "Icons generated successfully!"
