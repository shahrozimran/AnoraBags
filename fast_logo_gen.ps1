$sourcePath = "e:\AnoraBags\WhatsApp Image 2026-10-16 at 5.09.08 PM.jpeg"
$destOriginal = "e:\AnoraBags\public\images\logo.jpeg"
Copy-Item $sourcePath $destOriginal -Force
Write-Host "Copied original to $destOriginal"

$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class LogoProcessor {
    public static void ProcessLogo(string sourcePath, string transparentPath, string lightPath) {
        using (Bitmap src = new Bitmap(sourcePath)) {
            int width = src.Width;
            int height = src.Height;

            Bitmap transparentBmp = new Bitmap(width, height, PixelFormat.Format32bppArgb);
            Bitmap lightBmp = new Bitmap(width, height, PixelFormat.Format32bppArgb);

            BitmapData srcData = src.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            BitmapData transData = transparentBmp.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            BitmapData lightData = lightBmp.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

            int bytes = Math.Abs(srcData.Stride) * height;
            byte[] srcRgb = new byte[bytes];
            byte[] transRgb = new byte[bytes];
            byte[] lightRgb = new byte[bytes];

            Marshal.Copy(srcData.Scan0, srcRgb, 0, bytes);

            // Background is around R=236, G=226, B=216. Logo is around R=70, G=47, B=29
            // Format32bppArgb is stored as BGRA in memory: [i]=B, [i+1]=G, [i+2]=R, [i+3]=A
            for (int i = 0; i < bytes; i += 4) {
                int b = srcRgb[i];
                int g = srcRgb[i+1];
                int r = srcRgb[i+2];

                // Calculate distance from background (236, 226, 216)
                double diffR = 236 - r;
                double diffG = 226 - g;
                double diffB = 216 - b;
                double diff = Math.Sqrt(diffR * diffR + diffG * diffG + diffB * diffB);

                if (diff < 15) {
                    // Transparent
                    transRgb[i] = 29;
                    transRgb[i+1] = 47;
                    transRgb[i+2] = 70;
                    transRgb[i+3] = 0;

                    lightRgb[i] = 216;
                    lightRgb[i+1] = 226;
                    lightRgb[i+2] = 236;
                    lightRgb[i+3] = 0;
                } else if (diff < 60) {
                    // Smooth transition
                    double t = (diff - 15) / 45.0;
                    byte alpha = (byte)(t * 255);

                    transRgb[i] = (byte)b;
                    transRgb[i+1] = (byte)g;
                    transRgb[i+2] = (byte)r;
                    transRgb[i+3] = alpha;

                    lightRgb[i] = 216;
                    lightRgb[i+1] = 226;
                    lightRgb[i+2] = 236;
                    lightRgb[i+3] = alpha;
                } else {
                    // Solid logo text/mark
                    transRgb[i] = (byte)b;
                    transRgb[i+1] = (byte)g;
                    transRgb[i+2] = (byte)r;
                    transRgb[i+3] = 255;

                    // Light logo for dark footer / dark backgrounds
                    lightRgb[i] = 216;
                    lightRgb[i+1] = 226;
                    lightRgb[i+2] = 236;
                    lightRgb[i+3] = 255;
                }
            }

            Marshal.Copy(transRgb, 0, transData.Scan0, bytes);
            Marshal.Copy(lightRgb, 0, lightData.Scan0, bytes);

            src.UnlockBits(srcData);
            transparentBmp.UnlockBits(transData);
            lightBmp.UnlockBits(lightData);

            transparentBmp.Save(transparentPath, ImageFormat.Png);
            lightBmp.Save(lightPath, ImageFormat.Png);

            transparentBmp.Dispose();
            lightBmp.Dispose();
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing.dll"
[LogoProcessor]::ProcessLogo($sourcePath, "e:\AnoraBags\public\images\logo-transparent.png", "e:\AnoraBags\public\images\logo-light.png")
Write-Host "Processed logos successfully!"
