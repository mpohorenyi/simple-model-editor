import * as THREE from 'three';

import { UIComponent } from './UIComponent';

/**
 * Manages the tab navigation and content display for the object and material tabs.
 */
export class Tabs extends UIComponent {
  private objectTab: HTMLElement;
  private materialTab: HTMLElement;
  private tabButtons: NodeListOf<HTMLButtonElement>;
  private objectPropertiesSection: HTMLElement;
  private tabContents: NodeListOf<HTMLElement>;

  constructor() {
    super();

    // Get tab elements
    this.objectPropertiesSection = document.querySelector('#object-properties') as HTMLElement;
    this.objectTab = document.querySelector('#object-tab') as HTMLElement;
    this.materialTab = document.querySelector('#material-tab') as HTMLElement;
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabContents = document.querySelectorAll('.tab-content');

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Tab buttons
    this.tabButtons.forEach(button => {
      this.addEventListenerWithCleanup(button, 'click', this.handleTabClick.bind(this));
    });

    // Listen for object selection/deselection events
    this.eventBus.on('object.selected', this.handleObjectSelected.bind(this));
    this.eventBus.on('object.deselected', this.handleObjectDeselected.bind(this));
  }

  private handleTabClick(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    const tabId = button.dataset.tab;

    // Remove active class from all tabs and buttons
    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabContents.forEach(tab => tab.classList.remove('active'));

    // Add active class to clicked button and its tab
    button.classList.add('active');
    const tabContent = Array.from(this.tabContents).find(tab => tab.id === tabId);
    if (tabContent) {
      tabContent.classList.add('active');
    }
  }

  private handleObjectSelected(object: THREE.Object3D): void {
    this.objectPropertiesSection.style.display = 'block';

    // Activate object tab by default
    this.tabButtons[0].classList.add('active');
    this.objectTab.classList.add('active');
  }

  private handleObjectDeselected(): void {
    this.objectPropertiesSection.style.display = 'none';

    // Deactivate all tabs
    this.tabButtons.forEach(button => button.classList.remove('active'));
    this.objectTab.classList.remove('active');
    this.materialTab.classList.remove('active');
  }

  protected removeEventBusListeners(): void {
    this.eventBus.off('object.selected', this.handleObjectSelected.bind(this));
    this.eventBus.off('object.deselected', this.handleObjectDeselected.bind(this));
  }
}
