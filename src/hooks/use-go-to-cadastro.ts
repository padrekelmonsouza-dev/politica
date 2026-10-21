import { useNavigate } from "@tanstack/react-router";

import { scrollToSection } from "@/lib/scroll-to-section";

export function useGoToCadastro() {
  const navigate = useNavigate();

  return (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    if (typeof document !== "undefined" && document.getElementById("cadastro")) {
      scrollToSection("cadastro");
      return;
    }
    void navigate({ to: "/", hash: "cadastro" });
  };
}
