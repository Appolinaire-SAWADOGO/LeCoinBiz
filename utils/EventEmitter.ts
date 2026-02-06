type Listener = () => void;

class EventEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((cb) => cb());
  }

  remove(event: string, callback: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback,
    );
  }
}

export const authEvents = new EventEmitter();
