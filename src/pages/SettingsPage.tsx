import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Save, RotateCcw, Upload, Trash2, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_SETTINGS, type Settings, type UserSound } from "@/lib/types";
import { BUILT_IN_SOUNDS, getBuiltInSoundUrl, getUserSoundUrl } from "@/lib/sounds";

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => Promise<void>;
  userSounds: UserSound[];
  onImportSound: () => Promise<UserSound | null>;
  onDeleteSound: (id: number) => Promise<void>;
}

function DurationInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (seconds: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={120}
          value={Math.round(value / 60)}
          onChange={(e) => onChange(Number(e.target.value) * 60)}
          className="w-20 rounded-lg border border-border bg-card px-3 py-2 text-sm text-center outline-none focus:border-ring"
          style={{ colorScheme: "dark" }}
        />
        <span className="w-14 text-sm text-muted-foreground">minutos</span>
      </div>
    </div>
  );
}

export function SettingsPage({
  settings,
  onSave,
  userSounds,
  onImportSound,
  onDeleteSound,
}: SettingsPageProps) {
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const soundItems = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of BUILT_IN_SOUNDS) {
      map[s.id] = s.name;
    }
    for (const s of userSounds) {
      map[`custom:${s.id}`] = s.name;
    }
    return map;
  }, [userSounds]);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const stopPreview = useCallback(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }
    setPreviewing(false);
  }, []);

  const togglePreview = useCallback(async () => {
    if (previewing) {
      stopPreview();
      return;
    }

    let url: string | null = null;
    const source = form.sound_source;
    if (source.startsWith("custom:")) {
      const id = parseInt(source.replace("custom:", ""), 10);
      const sound = userSounds.find((s) => s.id === id);
      if (sound) url = await getUserSoundUrl(sound.filename);
    } else {
      url = await getBuiltInSoundUrl(source);
    }

    if (!url) return;

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio();
    }
    const audio = previewAudioRef.current;
    audio.src = url;
    audio.volume = form.sound_volume;
    audio.loop = true;
    audio.play().catch(() => {});
    setPreviewing(true);
  }, [previewing, form.sound_source, form.sound_volume, userSounds, stopPreview]);

  // Stop preview when leaving settings or changing sound source
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.src = "";
      }
    };
  }, []);

  // Update preview volume in real-time
  useEffect(() => {
    if (previewAudioRef.current && previewing) {
      previewAudioRef.current.volume = form.sound_volume;
    }
  }, [form.sound_volume, previewing]);

  // Stop preview when sound source changes
  useEffect(() => {
    stopPreview();
  }, [form.sound_source, stopPreview]);

  const handleSave = async () => {
    await onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS);
  };

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-8 text-2xl font-semibold">Configurações</h1>

      <div className="flex max-w-lg flex-col gap-6">
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Durações
          </p>
          <DurationInput
            label="Foco"
            value={form.work_duration}
            onChange={(v) => setForm((f) => ({ ...f, work_duration: v }))}
          />
          <DurationInput
            label="Pausa curta"
            value={form.short_break_duration}
            onChange={(v) => setForm((f) => ({ ...f, short_break_duration: v }))}
          />
          <DurationInput
            label="Pausa longa"
            value={form.long_break_duration}
            onChange={(v) => setForm((f) => ({ ...f, long_break_duration: v }))}
          />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Ciclo
          </p>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Pomodoros antes da pausa longa
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={12}
                value={form.pomodoros_before_long_break}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    pomodoros_before_long_break: Number(e.target.value),
                  }))
                }
                className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm text-center outline-none focus:border-ring"
                style={{ colorScheme: "dark" }}
              />
              <span className="w-14 text-sm text-muted-foreground">sessões</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Música
          </p>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Tocar durante foco
            </label>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  sound_enabled: f.sound_enabled ? 0 : 1,
                }))
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                form.sound_enabled
                  ? "bg-accent-work"
                  : "bg-border"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  form.sound_enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {form.sound_enabled ? (
            <>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Som
                </label>
                <div className="flex items-center gap-2">
                  <Select
                    value={form.sound_source}
                    onValueChange={(val) => {
                      if (val) setForm((f) => ({ ...f, sound_source: val }));
                    }}
                    items={soundItems}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Embutidos</SelectLabel>
                        {BUILT_IN_SOUNDS.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      {userSounds.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Importados</SelectLabel>
                          {userSounds.map((s) => (
                            <SelectItem key={`custom:${s.id}`} value={`custom:${s.id}`}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={togglePreview}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors ${
                      previewing
                        ? "bg-accent-work text-white border-accent-work"
                        : "text-muted-foreground hover:text-foreground hover:border-ring"
                    }`}
                    title={previewing ? "Parar preview" : "Ouvir preview"}
                  >
                    {previewing ? (
                      <Square className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Volume
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={form.sound_volume}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sound_volume: Number(e.target.value),
                      }))
                    }
                    className="w-36 accent-accent-work"
                  />
                  <span className="w-10 text-sm text-muted-foreground text-right">
                    {Math.round(form.sound_volume * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setImportStatus(null);
                      try {
                        const result = await onImportSound();
                        if (result) {
                          setImportStatus(`"${result.name}" importado!`);
                          setTimeout(() => setImportStatus(null), 3000);
                        }
                      } catch (err) {
                        console.error("Erro ao importar:", err);
                        setImportStatus("Erro ao importar arquivo");
                        setTimeout(() => setImportStatus(null), 3000);
                      }
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    Importar Música
                  </Button>
                  {importStatus && (
                    <span className={`text-xs ${importStatus.startsWith("Erro") ? "text-red-400" : "text-green-400"}`}>
                      {importStatus}
                    </span>
                  )}
                </div>

                {userSounds.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {userSounds.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                      >
                        <span className="text-sm text-foreground truncate">
                          {s.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteSound(s.id)}
                          className="text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            size="lg"
            onClick={handleSave}
            className="bg-accent-work text-white hover:bg-accent-work/90"
          >
            <Save className="h-4 w-4" />
            {saved ? "Salvo!" : "Salvar"}
          </Button>

          <Button variant="outline" size="lg" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Restaurar Padrão
          </Button>
        </div>
      </div>
    </div>
  );
}
