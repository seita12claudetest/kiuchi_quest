type Handler = (data: any) => void

export class EventBus {
  private listeners = new Map<string, Set<Handler>>()

  on(event: string, handler: Handler): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(handler)
  }

  off(event: string, handler: Handler): void {
    this.listeners.get(event)?.delete(handler)
  }

  once(event: string, handler: Handler): void {
    const wrapper: Handler = (data) => {
      handler(data)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(h => h(data))
  }

  clear(): void {
    this.listeners.clear()
  }
}
