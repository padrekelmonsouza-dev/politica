import { useEffect, useState } from "react";

import { subscribeJungle, toggleJungle } from "@/lib/jungle-player";

export function useJunglePlayer() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => subscribeJungle(setPlaying), []);

  return {
    playing,
    toggle: () => {
      void toggleJungle();
    },
  };
}
