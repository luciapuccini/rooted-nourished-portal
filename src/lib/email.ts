import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendMessageNotificationToCoach(opts: {
  clientName: string
  clientEmail: string
  message: string
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.COACH_EMAIL,
    subject: `New message from ${opts.clientName} — Rooted & Nourished Portal`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#faf7f2;">
        <h2 style="color:#3d6b4f;margin-bottom:8px;">New Message from ${opts.clientName}</h2>
        <p style="color:#8a8a7a;font-size:14px;margin-bottom:24px;">${opts.clientEmail}</p>
        <div style="background:#fff;border-radius:8px;padding:20px;border-left:4px solid #3d6b4f;">
          <p style="color:#2c2c2c;line-height:1.6;">${opts.message}</p>
        </div>
        <p style="color:#8a8a7a;font-size:12px;margin-top:24px;">Log in to reply at the Rooted & Nourished portal.</p>
      </div>
    `,
  })
}

export async function sendReplyNotificationToClient(opts: {
  clientName: string
  clientEmail: string
  message: string
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: opts.clientEmail,
    subject: `Sophia replied to your message — Rooted & Nourished`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#faf7f2;">
        <h2 style="color:#3d6b4f;margin-bottom:8px;">Hi ${opts.clientName},</h2>
        <p style="color:#2c2c2c;margin-bottom:24px;">Sophia has replied to your message in the Rooted & Nourished portal.</p>
        <div style="background:#fff;border-radius:8px;padding:20px;border-left:4px solid #c17a4a;">
          <p style="color:#2c2c2c;line-height:1.6;">${opts.message}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/chat"
           style="display:inline-block;margin-top:24px;padding:12px 24px;background:#3d6b4f;color:#fff;text-decoration:none;border-radius:6px;font-family:Georgia,serif;">
          View in Portal
        </a>
      </div>
    `,
  })
}

export async function sendAppointmentConfirmation(opts: {
  clientName: string
  clientEmail: string
  title: string
  date: string
  time: string
  zoomLink?: string
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: opts.clientEmail,
    subject: `Appointment Confirmed — ${opts.title}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#faf7f2;">
        <h2 style="color:#3d6b4f;">Your appointment is confirmed!</h2>
        <p style="color:#2c2c2c;">Hi ${opts.clientName},</p>
        <div style="background:#fff;border-radius:8px;padding:20px;margin:20px 0;">
          <p><strong>${opts.title}</strong></p>
          <p>📅 ${opts.date} at ${opts.time}</p>
          ${opts.zoomLink ? `<p>🔗 <a href="${opts.zoomLink}" style="color:#3d6b4f;">Join Zoom Meeting</a></p>` : ''}
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#3d6b4f;color:#fff;text-decoration:none;border-radius:6px;">
          View Appointments
        </a>
      </div>
    `,
  })
}
