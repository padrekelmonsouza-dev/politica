import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CONTACT_TO = "padrekelmonmare.luis@gmail.com";
const CONTACT_SUBJECT = "formulario do site";

const contactSchema = z.object({
  nome: z.string().trim().min(3).max(100),
  telefone: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(255),
  cidade: z.string().trim().min(2).max(80),
  estado: z.string().trim().min(2).max(2),
  voluntario: z.boolean(),
  novidades: z.boolean(),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const body = {
      _subject: CONTACT_SUBJECT,
      _template: "table",
      _captcha: "false",
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
      cidade: data.cidade,
      estado: data.estado,
      voluntario: data.voluntario ? "Sim" : "Não",
      novidades: data.novidades ? "Sim" : "Não",
      _replyto: data.email,
      message: [
        `Nome: ${data.nome}`,
        `Telefone: ${data.telefone}`,
        `E-mail: ${data.email}`,
        `Cidade: ${data.cidade}/${data.estado}`,
        `Voluntário: ${data.voluntario ? "Sim" : "Não"}`,
        `Novidades: ${data.novidades ? "Sim" : "Não"}`,
      ].join("\n"),
    };

    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_TO}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Falha ao enviar o formulário (${res.status}). ${text.slice(0, 120)}`);
    }

    const json = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
    if (json && json.success === false) {
      throw new Error("Não foi possível enviar o formulário. Tente novamente.");
    }

    return { ok: true as const, to: CONTACT_TO, subject: CONTACT_SUBJECT };
  });
