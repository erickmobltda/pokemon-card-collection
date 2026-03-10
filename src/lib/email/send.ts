interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, unknown>;
}

export async function sendEmail(options: SendEmailOptions) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Secret": import.meta.env.VITE_INTERNAL_SECRET ?? "",
    },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error("Falha ao enviar e-mail");
  return res.json();
}
