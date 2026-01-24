import { scryptSync, randomBytes, timingSafeEqual } from "crypto"

/**
 * Hash a password using scrypt (Node.js native crypto)
 * @param password Plain text password
 * @returns Hashed password in format: salt.hash
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}.${hash}`
}

/**
 * Verify a password against a hash
 * @param password Plain text password
 * @param hashedPassword Hashed password in format: salt.hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(".")
  const hash = scryptSync(password, salt, 64)
  const storedHashBuffer = Buffer.from(storedHash, "hex")
  return timingSafeEqual(hash, storedHashBuffer)
}

/**
 * Generate a random password
 * @param length Password length (default: 12)
 * @returns Random password string
 */
export function generateRandomPassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length]
  }
  
  return password
}
