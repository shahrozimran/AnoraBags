"use server"

import { addSubscriber } from "@/lib/db"

export async function subscribeAction(formData: FormData) {
  const email = formData.get("email")?.toString() || ""
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." }
  }
  return await addSubscriber(email)
}
