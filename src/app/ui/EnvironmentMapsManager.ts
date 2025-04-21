import { UIComponent } from './UIComponent';
import { EnvironmentMapEvent } from './events';

/**
 * Manages the environment map UI, handling the environment map buttons and selection.
 */
export class EnvironmentMapsManager extends UIComponent {
  private envMapButtons: NodeListOf<HTMLElement>;
  private envBackgroundToggle: HTMLInputElement;

  private isBackgroundVisible: boolean = false;

  constructor() {
    super();

    // Get environment DOM elements
    this.envMapButtons = document.querySelectorAll('.env-map-thumbnail');
    this.envBackgroundToggle = document.getElementById('env-background-toggle') as HTMLInputElement;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Environment map buttons
    this.envMapButtons.forEach(button => {
      this.addEventListenerWithCleanup(button, 'click', this.handleEnvironmentMapClick.bind(this));
    });

    // Environment background toggle
    this.addEventListenerWithCleanup(
      this.envBackgroundToggle,
      'change',
      this.handleEnvironmentBackgroundToggle.bind(this)
    );
  }

  private handleEnvironmentMapClick(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const name = button.dataset.envName;

    // Remove active class from all env map buttons
    this.envMapButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Add active class to clicked button
    button.classList.add('active');

    // Emit event with environment map data
    const envMapEvent: EnvironmentMapEvent = {
      name,
      isBackgroundVisible: this.isBackgroundVisible,
    };
    this.eventBus.emit('ui.environment.map.selected', envMapEvent);
  }

  private handleEnvironmentBackgroundToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    const visible = input.checked;

    this.isBackgroundVisible = visible;
    this.eventBus.emit('ui.environment.map.background.toggle', visible);
  }

  protected removeEventBusListeners(): void {}
}
