/** O usuário inicia a conversa. Não há disparo automático para listas. */
export const WHATSAPP_SHARE_TEXT =
  "Estou organizando minha cola eleitoral de 2026 no Minha Cola. As escolhas são só minhas.";

export function buildWhatsAppUrl(text = WHATSAPP_SHARE_TEXT) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(text = WHATSAPP_SHARE_TEXT) {
  window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
}
