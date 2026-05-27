import { EMLActivityEvent } from "./eventTypes";

type Listener = (event: EMLActivityEvent) => void;

class LiveEventBus {
  private listeners: Listener[] = [];

  emit(event: EMLActivityEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const liveEventBus = new LiveEventBus();