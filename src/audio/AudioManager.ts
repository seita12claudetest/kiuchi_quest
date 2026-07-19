export type UISound = 'select' | 'confirm' | 'cancel' | 'promotion'

export class AudioManager {
  private readonly sounds = new Map<UISound, HTMLAudioElement>()

  constructor() {
    for (const name of ['select', 'confirm', 'cancel', 'promotion'] as const) {
      const audio = new Audio(`${import.meta.env.BASE_URL}assets/audio/ui/${name}.ogg`)
      audio.preload = 'auto'
      audio.volume = 0.28
      this.sounds.set(name, audio)
    }
  }

  play(name: UISound): void {
    const source = this.sounds.get(name)
    if (!source) return
    const audio = source.cloneNode() as HTMLAudioElement
    audio.volume = source.volume
    void audio.play().catch(() => undefined)
  }
}
