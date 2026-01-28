import { scryptSync, randomBytes } from 'crypto'

// Hash the password "Anthai@88" using scrypt
const password = 'Anthai@88'
const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')
const passwordHash = `${salt}.${hash}`

console.log('Password hash for "Anthai@88":')
console.log(passwordHash)
console.log('\nSQL to insert client:')
console.log(`
INSERT INTO clients (email, password_hash, company_name, contact_name, phone, address, is_active)
VALUES (
  'phamgiavietnamjsc@gmail.com',
  '${passwordHash}',
  'PHAM GIA VIET NAM JOINT STOCK COMPANY',
  'Dao Do Thi',
  '0987755357',
  'No. 25, Alley 299/56 Hoang Mai Street, To 65, Tuong Mai Ward',
  true
);
`)
