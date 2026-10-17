import sharp from "sharp"
import fs from "fs"

async function patchDots() {
  const inputBuffer = fs.readFileSync("public/images/products/cognac-espresso-satchel.jpeg")
  const meta = await sharp(inputBuffer).metadata()
  
  // Patch dots around y=485..505, x=450..550 and x=650..750
  const patchSvg = `
    <svg width="${meta.width}" height="${meta.height}">
      <rect x="450" y="475" width="80" height="30" fill="#EBDDCD" />
      <rect x="640" y="475" width="80" height="30" fill="#E0D1BE" />
      <rect x="940" y="475" width="80" height="30" fill="#D7C6B1" />
    </svg>
  `
  const output = await sharp(inputBuffer)
    .composite([{ input: Buffer.from(patchSvg), top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toBuffer()
    
  fs.writeFileSync("public/images/products/cognac-espresso-satchel.jpeg", output)
  console.log("Satchel patch applied!")
}

patchDots().catch(console.error)
