export type EventCallback = (...args: any[]) => void;

/**
 * EventBus - Singleton class for event-based communication between components
 */
export class EventBus {
  private static instance: EventBus | null = null;
  private events: Map<string, EventCallback[]>;

  private constructor() {
    this.events = new Map();
  }

  /**
   * Get the singleton instance of EventBus
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event
   * @param eventName Name of the event to subscribe to
   * @param callback Function to call when the event is emitted
   */
  public on(eventName: string, callback: EventCallback): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.push(callback);
    }
  }

  /**
   * Emit an event with optional arguments
   * @param eventName Name of the event to emit
   * @param args Arguments to pass to the event handlers
   */
  public emit(eventName: string, ...args: any[]): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  /**
   * Unsubscribe from an event
   * @param eventName Name of the event to unsubscribe from
   * @param callback Function to remove from event handlers
   */
  public off(eventName: string, callback: EventCallback): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }

      // Remove the event entirely if no callbacks remain
      if (callbacks.length === 0) {
        this.events.delete(eventName);
      }
    }
  }
}
