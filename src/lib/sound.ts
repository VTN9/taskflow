export function playBeep(): void {
  if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return

  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.value = 0.05
  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + 0.15)
  oscillator.onended = () => {
    void context.close()
  }
}
