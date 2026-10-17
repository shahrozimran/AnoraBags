"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { addSubscriber } from "@/lib/db"
import { clientKey, consumeLimit } from "@/lib/security/rate-limit"

export async function subscribeAction(formData: FormData) {
  if (!consumeLimit("newsletter:" + clientKey(await headers()), 5, 15 * 60 * 1000)) {
    return { success: false, message: "Too many attempts. Please try again later." }
  }
  const email = z.string().trim().email().max(254).safeParse(formData.get("email"))
  if (!email.success) return { success: false, message: "Please enter a valid email address." }
  try {
    await addSubscriber(email.data.toLowerCase())
    return { success: true, message: "Thank you. You’re on the Anora list." }
  } catch {
    return { success: false, message: "We could not subscribe you. Please try again later." }
  }
}
