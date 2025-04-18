import { UIComponent } from './UIComponent';
import { EnvironmentMapEvent } from './events';

/**
 * Manages the environment map UI, handling the environment map buttons and selection.
 */
export class EnvironmentMapsManager extends UIComponent {
  private envMapButtons: NodeListOf<HTMLElement>;

  constructor() {
    super();

    // Get environment map buttons
    this.envMapButtons = document.querySelectorAll('.env-map-thumbnail');

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Environment map buttons
    this.envMapButtons.forEach(button => {
      this.addEventListenerWithCleanup(button, 'click', this.handleEnvironmentMapClick.bind(this));
    });
  }

  private handleEnvironmentMapClick(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const name = button.dataset.envName;
    const src = button.dataset.envSrc;
    const index = Array.from(this.envMapButtons).indexOf(button);

    // Remove active class from all env map buttons
    this.envMapButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Add active class to clicked button
    button.classList.add('active');

    // Emit event with environment map data
    const envMapEvent: EnvironmentMapEvent = { name, src, index };
    this.eventBus.emit('ui.environment.map.selected', envMapEvent);
  }

  protected removeEventBusListeners(): void {}
}
