function errorDocument({
  status,
  title,
  heading,
  message,
}: {
  status: number;
  title: string;
  heading: string;
  message: string;
}) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="robots" content="noindex, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fff; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      p.kicker { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #c9a227; margin: 0 0 0.75rem; }
      h1 { font-size: 1.5rem; margin: 0 0 0.75rem; color: #003d82; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.55rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; font-weight: 700; }
      .primary { background: #003d82; color: #fff; }
      .secondary { background: #fff; color: #003d82; border-color: #003d82; }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="kicker">Erro ${status}</p>
      <h1>${heading}</h1>
      <p>${message}</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Ir para o início</a>
      </div>
    </div>
  </body>
</html>`;
}

export function renderHttpErrorPage(status: 401 | 403 | 500 | 503): string {
  if (status === 401) {
    return errorDocument({
      status: 401,
      title: "Acesso não autorizado | Padre Kelmon",
      heading: "Acesso não autorizado",
      message: "Você precisa de permissão para ver esta área. Volte ao site oficial.",
    });
  }
  if (status === 403) {
    return errorDocument({
      status: 403,
      title: "Acesso não permitido | Padre Kelmon",
      heading: "Acesso não permitido",
      message: "Esta área não está disponível para o seu acesso. Volte ao início do site oficial.",
    });
  }
  if (status === 503) {
    return errorDocument({
      status: 503,
      title: "Site em manutenção | Padre Kelmon",
      heading: "Serviço temporariamente indisponível",
      message: "Estamos enfrentando um problema temporário. Tente novamente em instantes.",
    });
  }
  return errorDocument({
    status: 500,
    title: "Problema temporário | Padre Kelmon",
    heading: "Estamos enfrentando um problema temporário.",
    message: "Ocorreu um erro inesperado. Atualize a página ou volte ao início do site oficial.",
  });
}

export function renderErrorPage(): string {
  return renderHttpErrorPage(500);
}
