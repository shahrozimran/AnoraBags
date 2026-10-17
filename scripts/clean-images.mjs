import sharp from "sharp"
import fs from "fs"

async function cleanInterior() {
  const inputBuffer = fs.readFileSync("public/images/products/bordeaux-crossbody-interior.jpeg")
  const meta = await sharp(inputBuffer).metadata()
  
  // Chinese text is in top-right between x: 320..660, y: 80..240
  // Background color is #EDEAEC
  const overlaySvg = `
    <svg width="${meta.width}" height="${meta.height}">
      <rect x="320" y="80" width="340" height="160" fill="#EDEAEC" />
    </svg>
  `
  const outputBuffer = await sharp(inputBuffer)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toBuffer()
  
  fs.writeFileSync("public/images/products/bordeaux-crossbody-interior.jpeg", outputBuffer)
  console.log("Interior cleaned!")
}

cleanInterior().catch(console.error)
