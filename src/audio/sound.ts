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
  private audioContext?: AudioContext;
  private buffers = new Map<SoundName, AudioBuffer>();
  private fallback = new Map<SoundName, HTMLAudioElement>();

  warmup(): void {
    if (this.unlocked) return;
    this.unlocked = true;

    const AudioContextCtor =
      window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextCtor) {
      this.audioContext = new AudioContextCtor();
      void this.audioContext.resume().catch(() => undefined);
      void this.loadBuffers();
    }

    for (const [name, src] of Object.entries(soundFiles) as [SoundName, string][]) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      this.fallback.set(name, audio);
    }
  }

  play(name: SoundName): void {
    if (!this.unlocked) return;
    const buffer = this.buffers.get(name);
    if (this.audioContext && buffer) {
      if (this.audioContext.state === 'suspended') {
        void this.audioContext.resume().catch(() => undefined);
      }
      const source = this.audioContext.createBufferSource();
      const gain = this.audioContext.createGain();
      source.buffer = buffer;
      gain.gain.value = 0.5;
      source.connect(gain);
      gain.connect(this.audioContext.destination);
      source.start();
      return;
    }

    if (this.audioContext) return;

    const base = this.fallback.get(name);
    if (!base) return;
    const audio = base.cloneNode(true) as HTMLAudioElement;
    audio.volume = 0.55;
    void audio.play().catch(() => undefined);
  }

  private async loadBuffers(): Promise<void> {
    if (!this.audioContext) return;
    await Promise.all(
      (Object.entries(soundFiles) as [SoundName, string][]).map(async ([name, src]) => {
        const response = await fetch(src);
        const data = await response.arrayBuffer();
        const buffer = await this.audioContext?.decodeAudioData(data);
        if (buffer) this.buffers.set(name, buffer);
      }),
    ).catch(() => undefined);
  }
}
