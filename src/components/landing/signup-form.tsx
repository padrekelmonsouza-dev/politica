import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContactForm } from "@/lib/contact-form";
import sobreImg from "@/assets/Sobre-Padre-Kelmon.webp";
import { PageShell, Reveal } from "./primitives";

const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const schema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo").max(100),
  telefone: z
    .string()
    .trim()
    .min(10, "Informe um telefone válido com DDD")
    .max(20, "Telefone muito longo"),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(80),
  estado: z.string().trim().min(2, "Selecione seu estado"),
  lgpd: z.literal(true, { errorMap: () => ({ message: "É necessário aceitar os termos" }) }),
});

type Errors = Partial<Record<string, string>>;

export function SignupForm() {
  const [estado, setEstado] = useState("SP");
  const [voluntario, setVoluntario] = useState(false);
  const [novidades, setNovidades] = useState(true);
  const [lgpd, setLgpd] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      nome: String(form.get("nome") ?? ""),
      telefone: String(form.get("telefone") ?? ""),
      email: String(form.get("email") ?? ""),
      cidade: String(form.get("cidade") ?? ""),
      estado,
      lgpd,
    };

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Confira os campos destacados.");
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await submitContactForm({
        data: {
          nome: parsed.data.nome,
          telefone: parsed.data.telefone,
          email: parsed.data.email,
          cidade: parsed.data.cidade,
          estado: parsed.data.estado,
          voluntario,
          novidades,
        },
      });
      toast.success("Cadastro enviado! Em breve entraremos em contato.");
      formEl.reset();
      setEstado("SP");
      setVoluntario(false);
      setNovidades(true);
      setLgpd(false);
    } catch {
      toast.error("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  const err = (field: string) =>
    errors[field] ? (
      <p id={`${field}-error`} role="alert" className="mt-1 text-xs text-destructive">
        {errors[field]}
      </p>
    ) : null;

  return (
    <section
      id="cadastro"
      className="section-pad relative overflow-hidden border-t border-border/50"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f4f7fc 45%, #ffffff 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--yellow-primary)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 size-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--blue-primary)" }}
      />

      <PageShell className="relative">
          <div className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
            <Reveal className="h-full min-h-0">
              <div className="flex h-full flex-col">
                <div className="shrink-0">
                  <p
                    className="mb-3 text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--yellow-primary)" }}
                  >
                    Faça parte
                  </p>
                  <h2
                    className="display-heading font-black leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--blue-primary)",
                      fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
                    }}
                  >
                    Junte-se a essa missão
                  </h2>
                  <div className="gold-rule mt-4" />
                  <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                    Deixe seus dados para receber a agenda da campanha ou se tornar voluntário ao
                    lado do Padre Kelmon por São Paulo e pelo Brasil.
                  </p>
                </div>

                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="mt-5 flex min-h-0 flex-1 flex-col rounded-2xl border-2 bg-white p-5 shadow-lg sm:p-6"
                  style={{ borderColor: "rgba(0, 102, 204, 0.15)" }}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="nome" className="font-semibold text-gray-800">
                        Nome completo
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        autoComplete="name"
                        maxLength={100}
                        aria-invalid={!!errors["nome"]}
                        aria-describedby={errors["nome"] ? "nome-error" : undefined}
                        className="mt-1.5"
                        placeholder="Seu nome"
                      />
                      {err("nome")}
                    </div>

                    <div>
                      <Label htmlFor="telefone" className="font-semibold text-gray-800">
                        Telefone (WhatsApp)
                      </Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={20}
                        aria-invalid={!!errors["telefone"]}
                        aria-describedby={errors["telefone"] ? "telefone-error" : undefined}
                        className="mt-1.5"
                        placeholder="(11) 90000-0000"
                      />
                      {err("telefone")}
                    </div>

                    <div>
                      <Label htmlFor="email" className="font-semibold text-gray-800">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={255}
                        aria-invalid={!!errors["email"]}
                        aria-describedby={errors["email"] ? "email-error" : undefined}
                        className="mt-1.5"
                        placeholder="voce@email.com"
                      />
                      {err("email")}
                    </div>

                    <div>
                      <Label htmlFor="cidade" className="font-semibold text-gray-800">
                        Cidade
                      </Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        autoComplete="address-level2"
                        maxLength={80}
                        aria-invalid={!!errors["cidade"]}
                        aria-describedby={errors["cidade"] ? "cidade-error" : undefined}
                        className="mt-1.5"
                        placeholder="São Paulo"
                      />
                      {err("cidade")}
                    </div>

                    <div>
                      <Label htmlFor="estado" className="font-semibold text-gray-800">
                        Estado
                      </Label>
                      <Select value={estado} onValueChange={setEstado}>
                        <SelectTrigger id="estado" className="mt-1.5" aria-label="Estado">
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {UFS.map((uf) => (
                            <SelectItem key={uf} value={uf}>
                              {uf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {err("estado")}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5 rounded-xl bg-[#f4f7fc] p-3.5">
                    <label className="flex items-start gap-3 text-sm text-gray-800">
                      <Checkbox
                        checked={voluntario}
                        onCheckedChange={(v) => setVoluntario(v === true)}
                        aria-label="Quero ser voluntário"
                        className="mt-0.5"
                      />
                      <span>Quero ser voluntário da campanha</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm text-gray-800">
                      <Checkbox
                        checked={novidades}
                        onCheckedChange={(v) => setNovidades(v === true)}
                        aria-label="Quero receber novidades"
                        className="mt-0.5"
                      />
                      <span>Quero receber novidades e a agenda de eventos</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox
                        checked={lgpd}
                        onCheckedChange={(v) => setLgpd(v === true)}
                        aria-label="Aceito a política de privacidade"
                        aria-invalid={!!errors["lgpd"]}
                        className="mt-0.5"
                      />
                      <span className="text-gray-600">
                        Autorizo o uso dos meus dados conforme a{" "}
                        <Link
                          to="/politica-de-privacidade"
                          className="font-semibold underline underline-offset-4"
                          style={{ color: "var(--blue-primary)" }}
                        >
                          Política de Privacidade
                        </Link>{" "}
                        e a LGPD.
                      </span>
                    </label>
                    {err("lgpd")}
                  </div>

                  <Button
                    type="submit"
                    variant="yellow"
                    size="xl"
                    className="mt-4 h-auto min-h-12 w-full whitespace-normal text-base font-bold"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                    Quero fazer parte dessa missão
                  </Button>

                  <p className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheck
                      className="size-3.5"
                      style={{ color: "var(--blue-primary)" }}
                      aria-hidden="true"
                    />
                    Seus dados não são compartilhados com terceiros.
                  </p>
                </form>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="hidden h-full min-h-0 lg:block">
              <div className="relative h-full min-h-[480px] w-full overflow-hidden rounded-2xl shadow-2xl lg:min-h-full">
                <img
                  src={sobreImg}
                  alt="Padre Kelmon, cadastre-se para apoiar a campanha"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-white/10" />
                <div
                  className="absolute inset-x-0 bottom-0 h-2/5"
                  style={{
                    background: "linear-gradient(to top, rgba(0, 60, 140, 0.72), transparent)",
                  }}
                />
                <div className="absolute bottom-5 left-5 right-5">
                  <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--yellow-primary)" }}
                  >
                    Sobre Padre Kelmon
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                    Candidato a Deputado Federal por São Paulo · PL
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
      </PageShell>
    </section>
  );
}
