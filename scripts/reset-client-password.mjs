// Run this once to reset the client password
// Usage: node scripts/reset-client-password.mjs

const response = await fetch('http://localhost:3000/api/client-auth/reset-password-temp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'phamgiavietnamjsc@gmail.com',
    newPassword: 'Anthai@88'
  })
})

const result = await response.json()
console.log('Result:', result)
