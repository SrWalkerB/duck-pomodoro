import { useRef, useEffect, useState, useCallback } from "react";
import { getBuiltInSoundUrl, getUserSoundUrl } from "../lib/sounds";
import type { TimerState, SessionType, Settings } from "../lib/types";

interface UseAmbientSoundOptions {
  timerState: TimerState;
  sessionType: SessionType;
  settings: Settings;
  userSoundFilenames: Map<number, string>;
}

export function useAmbientSound({
  timerState,
  sessionType,
  settings,
  userSoundFilenames,
}: UseAmbientSoundOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const currentSourceRef = useRef<string>("");

  // Resolve the audio URL for the current sound_source
  const resolveUrl = useCallback(
    async (source: string): Promise<string | null> => {
      if (source.startsWith("custom:")) {
        const id = parseInt(source.replace("custom:", ""), 10);
        const filename = userSoundFilenames.get(id);
        if (!filename) return null;
        return getUserSoundUrl(filename);
      }
      return getBuiltInSoundUrl(source);
    },
    [userSoundFilenames]
  );

  // Create or get the Audio element
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    return audioRef.current;
  }, []);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : settings.sound_volume;
    }
  }, [settings.sound_volume, isMuted]);

  // Update audio source when sound_source changes
  useEffect(() => {
    if (!settings.sound_enabled) return;

    let cancelled = false;
    resolveUrl(settings.sound_source).then((url) => {
      if (cancelled || !url) return;
      if (currentSourceRef.current === url) return;

      const audio = getAudio();
      const wasPlaying = !audio.paused;
      audio.src = url;
      currentSourceRef.current = url;
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    });

    return () => {
      cancelled = true;
    };
  }, [settings.sound_source, settings.sound_enabled, resolveUrl, getAudio]);

  // Control playback based on timer state and session type
  useEffect(() => {
    if (!settings.sound_enabled) {
      // Sound disabled — make sure audio is stopped
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      return;
    }

    const shouldPlay = timerState === "running" && sessionType === "work";

    if (shouldPlay) {
      let cancelled = false;
      resolveUrl(settings.sound_source).then((url) => {
        if (cancelled || !url) return;
        const audio = getAudio();
        if (audio.src !== url && currentSourceRef.current !== url) {
          audio.src = url;
          currentSourceRef.current = url;
        }
        audio.volume = isMuted ? 0 : settings.sound_volume;
        audio.play().catch(() => {});
      });
      return () => {
        cancelled = true;
      };
    } else if (timerState === "paused" && sessionType === "work") {
      audioRef.current?.pause();
    } else {
      // idle or break — stop
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [
    timerState,
    sessionType,
    settings.sound_enabled,
    settings.sound_source,
    settings.sound_volume,
    isMuted,
    resolveUrl,
    getAudio,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { isMuted, toggleMute };
}
