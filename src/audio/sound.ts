type SoundName = 'jump' | 'doubleJump' | 'land' | 'die' | 'speedUp';

const soundFiles: Record<SoundName, string> = {
  jump: './sounds/jump.wav',
  doubleJump: './sounds/double-jump.wav',
  land: './sounds/land.wav',
  die: './sounds/die.wav',
  speedUp: './sounds/speed-up.wav',
};

export class SoundPlayer {
  private unlocked = false;
  private cache = new Map<SoundName, HTMLAudioElement>();

  warmup(): void {
    if (this.unlocked) return;
    this.unlocked = true;
    for (const [name, src] of Object.entries(soundFiles) as [SoundName, string][]) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      this.cache.set(name, audio);
    }
  }

  play(name: SoundName): void {
    if (!this.unlocked) return;
    const base = this.cache.get(name);
    if (!base) return;
    const audio = base.cloneNode(true) as HTMLAudioElement;
    audio.volume = 0.55;
    void audio.play().catch(() => undefined);
  }
}
