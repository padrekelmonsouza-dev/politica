import { useEffect, useState } from "react";

export type UserLocation = {
  lat: number;
  lon: number;
  source: "ip" | "gps";
};

const FALLBACK: UserLocation = { lat: -23.5505, lon: -46.6333, source: "ip" };

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fromIp(): Promise<UserLocation> {
      try {
        const res = await fetch("https://ipwho.is/");
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as {
          success?: boolean;
          latitude?: number;
          longitude?: number;
        };
        if (data.success === false || data.latitude == null || data.longitude == null) {
          return FALLBACK;
        }
        return { lat: data.latitude, lon: data.longitude, source: "ip" };
      } catch {
        return FALLBACK;
      }
    }

    async function detect() {
      const ipLocation = await fromIp();
      if (!cancelled) setLocation(ipLocation);

      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            source: "gps",
          });
        },
        () => undefined,
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
      );
    }

    void detect();
    return () => {
      cancelled = true;
    };
  }, []);

  return location;
}
