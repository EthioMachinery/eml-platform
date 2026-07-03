import { TMActivityEvent } from "./eventTypes";

type Listener = (event: TMActivityEvent) => void;

class LiveEventBus {
  private listeners: Listener[] = [];

  emit(event: TMActivityEvent) {
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