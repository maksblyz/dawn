const toAddress = 'contact@seeyouatdawn.com'
const fromAddress = 'Café Dawn <contact@seeyouatdawn.com>'

function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'The note could not be read.' }, { status: 400 })
  }

  if (clean(body.company, 200)) return Response.json({ ok: true })

  const name = clean(body.name, 100)
  const email = clean(body.email, 254)
  const date = clean(body.date, 10)
  const location = clean(body.location, 200)
  const details = clean(body.details, 3000)

  if (!name || !details || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Add your name, email, and a note about the occasion.' }, { status: 400 })
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: 'The date does not look right.' }, { status: 400 })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    return Response.json({ error: 'The mail service is not connected yet.' }, { status: 503 })
  }

  const text = [
    details,
    '',
    'Name: ' + name,
    'Reply to: ' + email,
    'Event date: ' + (date || 'Still deciding'),
    'Location: ' + (location || 'Still deciding'),
  ].join('\n')

  let response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        reply_to: email,
        subject: 'Event inquiry from ' + name,
        text,
      }),
    })
  } catch {
    return Response.json({ error: 'The note could not be sent. Please try again.' }, { status: 502 })
  }

  if (!response.ok) {
    return Response.json({ error: 'The note could not be sent. Please try again.' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
