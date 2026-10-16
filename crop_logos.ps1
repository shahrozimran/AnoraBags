$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class LogoCropper {
    public static void CropAndSave() {
        string transPath = @"e:\AnoraBags\public\images\logo-transparent.png";
        string lightPath = @"e:\AnoraBags\public\images\logo-light.png";

        using (Bitmap trans = new Bitmap(transPath))
        using (Bitmap light = new Bitmap(lightPath)) {
            int width = trans.Width;
            int height = trans.Height;

            BitmapData data = trans.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            int bytes = Math.Abs(data.Stride) * height;
            byte[] rgb = new byte[bytes];
            Marshal.Copy(data.Scan0, rgb, 0, bytes);
            trans.UnlockBits(data);

            int minX = width, minY = height, maxX = 0, maxY = 0;

            for (int y = 0; y < height; y++) {
                int row = y * Math.Abs(data.Stride);
                for (int x = 0; x < width; x++) {
                    byte a = rgb[row + x * 4 + 3];
                    if (a > 30) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            Console.WriteLine(string.Format("Bounding box: X={0}..{1}, Y={2}..{3}", minX, maxX, minY, maxY));

            // Add 3% padding
            int padX = (int)((maxX - minX) * 0.03);
            int padY = (int)((maxY - minY) * 0.03);
            int cropX = Math.Max(0, minX - padX);
            int cropY = Math.Max(0, minY - padY);
            int cropW = Math.Min(width - cropX, (maxX - minX) + 2 * padX);
            int cropH = Math.Min(height - cropY, (maxY - minY) + 2 * padY);

            Rectangle cropRect = new Rectangle(cropX, cropY, cropW, cropH);

            // Crop trans
            using (Bitmap croppedTrans = trans.Clone(cropRect, trans.PixelFormat)) {
                croppedTrans.Save(@"e:\AnoraBags\public\images\logo-tight.png", ImageFormat.Png);
            }

            // Crop light
            using (Bitmap croppedLight = light.Clone(cropRect, light.PixelFormat)) {
                croppedLight.Save(@"e:\AnoraBags\public\images\logo-tight-light.png", ImageFormat.Png);
            }

            // Also crop original with skin background
            using (Bitmap orig = new Bitmap(@"e:\AnoraBags\public\images\logo.jpeg")) {
                using (Bitmap croppedOrig = orig.Clone(cropRect, orig.PixelFormat)) {
                    croppedOrig.Save(@"e:\AnoraBags\public\images\logo-tight-skin.jpeg", ImageFormat.Jpeg);
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing.dll"
[LogoCropper]::CropAndSave()
Write-Host "Tight cropped logos generated successfully!"
