import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bio")({
  beforeLoad: () => {
    throw redirect({ to: "/links" });
  },
});
