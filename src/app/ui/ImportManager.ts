import { UIComponent } from './UIComponent';

/**
 * Manages the import model UI, handling the import button and file input.
 */
export class ImportManager extends UIComponent {
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
    // Import button
    this.addEventListenerWithCleanup(
      this.importControls.importButton,
      'click',
      this.handleImportButtonClick.bind(this)
    );
  }

  private handleImportButtonClick(): void {
    this.importControls.fileInput.click();
    this.importControls.fileInput.addEventListener(
      'change',
      () => {
        const files = this.importControls.fileInput.files;
        if (files && files.length > 0) {
          this.eventBus.emit('ui.model.import', files[0]);
        }
      },
      { once: true }
    );
  }

  protected removeEventBusListeners(): void {}
}
