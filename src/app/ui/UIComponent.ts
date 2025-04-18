import { EventBus } from '../singletons/EventBus';

/**
 * Abstract base class for UI components that manages DOM interactions and event handling.
 *
 * This class provides common functionality for UI component classes, including:
 * - Centralized event listener management with automatic cleanup
 * - Input validation and constraint handling
 * - Standardized event bus communication
 *
 * All UI components should extend this class to maintain consistent behavior
 * and resource management across the application UI system.
 *
 * @example
 * ```typescript
 * class MyUIComponent extends UIComponent {
 *   constructor() {
 *     super();
 *
 *     const button = document.querySelector('#my-button');
 *     this.addEventListenerWithCleanup(button, 'click', this.handleClick.bind(this));
 *
 *     this.eventBus.on('some.event', this.handleEvent.bind(this));
 *   }
 *
 *   private handleClick(event: Event): void {
 *     // Handle click event
 *   }
 *
 *   private handleEvent(data: any): void {
 *     // Handle application event
 *   }
 *
 *   protected removeEventBusListeners(): void {
 *     this.eventBus.off('some.event', this.handleEvent.bind(this));
 *   }
 * }
 * ```
 */
export abstract class UIComponent {
  protected eventBus: EventBus;

  /**
   * Two-level map that stores references to event listeners for automatic cleanup.
   * The outer map keys are DOM elements, and the inner map keys are event types.
   * This structure enables proper removal of all event listeners during component disposal.
   *
   * @private
   */
  private eventListeners: Map<HTMLElement, Map<string, EventListener>> = new Map();

  constructor() {
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Adds an event listener to a DOM element and tracks it for automatic cleanup.
   * This method ensures that all event listeners are properly removed when the component is disposed,
   * helping prevent memory leaks from lingering event listeners.
   *
   * @param element - The DOM element to attach the event listener to
   * @param eventType - The type of event to listen for (e.g., 'click', 'input')
   * @param listener - The event handler function
   */
  protected addEventListenerWithCleanup(
    element: HTMLElement | null,
    eventType: string,
    listener: EventListener
  ): void {
    if (!element) return;

    // Create entry for this element if it doesn't exist
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, new Map());
    }

    // Store the bound listener
    const listenerMap = this.eventListeners.get(element)!;
    listenerMap.set(eventType, listener);

    // Add the actual event listener
    element.addEventListener(eventType, listener);
  }

  /**
   * Validates and constrains numeric input values based on min/max attributes.
   * This method handles:
   * - Converting input string to number
   * - Handling NaN values and replacing with defaults
   * - Enforcing min/max constraints from input attributes
   * - Updating the input field value when constraints are applied
   *
   * @param input - The input element containing a numeric value
   * @param defaultValue - Value to use if input is empty or not a number
   * @returns The validated and constrained numeric value
   */
  protected validateNumericInput(input: HTMLInputElement, defaultValue: number = 0): number {
    let value = parseFloat(input.value);

    if (isNaN(value)) {
      value = defaultValue;
      input.value = defaultValue.toString();
    }

    const min = parseFloat(input.min || '-Infinity');
    const max = parseFloat(input.max || 'Infinity');

    const clampedValue = Math.max(Math.min(value, max), min);

    if (clampedValue !== value) {
      input.value = clampedValue.toString();
    }

    return clampedValue;
  }

  /**
   * Cleans up all resources used by this component.
   * This includes:
   * - Removing all DOM event listeners
   * - Clearing internal listener references
   * - Removing event bus subscriptions
   *
   * This method should be called when the component is no longer needed
   * to prevent memory leaks from lingering event listeners.
   */
  public dispose(): void {
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach((listener, eventType) => {
        element.removeEventListener(eventType, listener);
      });
    });

    this.eventListeners.clear();
    this.removeEventBusListeners();
  }

  /**
   * Removes all event bus subscriptions made by this component.
   * Each derived class must implement this method to properly clean up
   * any event bus listeners it has registered using eventBus.on() methods.
   *
   * @protected
   * @abstract
   */
  protected abstract removeEventBusListeners(): void;
}
