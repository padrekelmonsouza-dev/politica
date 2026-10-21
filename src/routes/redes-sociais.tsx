import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/redes-sociais")({
  beforeLoad: () => {
    throw redirect({ to: "/links" });
  },
});
