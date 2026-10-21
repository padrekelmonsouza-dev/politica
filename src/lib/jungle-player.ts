const JUNGLE_SRC = "/radio/jungles-padre-kelmon.mp4";

let audio: HTMLAudioElement | null = null;
const listeners = new Set<(playing: boolean) => void>();

function emit(playing: boolean) {
  listeners.forEach((listener) => listener(playing));
}

function getAudio() {
  if (typeof document === "undefined") return null;
  if (!audio) {
    audio = new Audio(JUNGLE_SRC);
    audio.loop = true;
    audio.preload = "none";
    audio.setAttribute("playsinline", "");
    audio.addEventListener("play", () => emit(true));
    audio.addEventListener("ended", () => emit(false));
    audio.addEventListener("pause", () => {
      if (!audio || audio.currentTime === 0) emit(false);
    });
  }
  return audio;
}

export function subscribeJungle(listener: (playing: boolean) => void) {
  listeners.add(listener);
  listener(Boolean(audio && !audio.paused));
  return () => {
    listeners.delete(listener);
  };
}

export async function toggleJungle() {
  const el = getAudio();
  if (!el) return;

  if (!el.paused) {
    el.pause();
    el.currentTime = 0;
    emit(false);
    return;
  }

  try {
    await el.play();
    emit(true);
  } catch {
    emit(false);
  }
}
