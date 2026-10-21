import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/biografia")({
  beforeLoad: () => {
    throw redirect({ to: "/sobre" });
  },
});
