export async function limitedJson(request: Request, maxBytes = 2048): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("Invalid request.")
  const reader = request.body?.getReader()
  if (!reader) throw new Error("Invalid request.")
  const chunks: Uint8Array[] = []
  let length = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    length += value.byteLength
    if (length > maxBytes) { await reader.cancel(); throw new Error("Request too large.") }
    chunks.push(value)
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"))
}
