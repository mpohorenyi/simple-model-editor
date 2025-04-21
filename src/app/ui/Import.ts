import { UIComponent } from './UIComponent';

/**
 * Manages the import model UI, handling the import button and file input.
 */
export class Import extends UIComponent {
  private importControls: {
    importButton: HTMLButtonElement;
    fileInput: HTMLInputElement;
  };

  constructor() {
    super();

    // Get import controls
    this.importControls = {
      importButton: document.querySelector('#model-import-button') as HTMLButtonElement,
      fileInput: document.querySelector('#model-import-input') as HTMLInputElement,
    };

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.addEventListenerWithCleanup(
      this.importControls.importButton,
      'click',
      this.handleImportButtonClick.bind(this)
    );

    this.addEventListenerWithCleanup(
      this.importControls.fileInput,
      'change',
      this.handleFileInputChange.bind(this)
    );
  }

  private handleImportButtonClick(): void {
    this.importControls.fileInput.click();
  }

  private handleFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.eventBus.emit('ui.model.import', files[0]);
      input.value = '';
    }
  }

  protected removeEventBusListeners(): void {}
}
