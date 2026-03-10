import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-internal-secret"];
  if (secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { to, subject, template, data } = req.body as {
    to: string;
    subject: string;
    template: string;
    data?: Record<string, unknown>;
  };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    console.log("[send-email] No RESEND_API_KEY — logging email:", {
      to,
      subject,
      template,
      data,
    });
    return res.json({ success: true });
  }

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html: `<p>Template: ${template}</p><pre>${JSON.stringify(data, null, 2)}</pre>`,
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.text();
    return res.status(500).json({ error: err });
  }

  return res.json({ success: true });
}
