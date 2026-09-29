import { expect, Locator, Page } from '@playwright/test';
import { attachmentCategory } from '../../test-data/constants';

/** Interactions for an existing bond's detail page (/bonds/<id>). */
export class BondDetailPage {
  readonly page: Page;
  readonly addAttachmentButton: Locator;
  readonly attachmentModal: Locator;
  readonly dropzone: Locator;
  readonly categorySelect: Locator;
  readonly saveAttachmentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAttachmentButton = page.getByTestId('bond-attachments-add-button');
    this.attachmentModal = page.getByTestId('add-attachment-modal-root-modal');
    this.dropzone = page.getByTestId('add-attachment-modal-dropzone-input');
    this.categorySelect = page.getByTestId('add-attachment-modal-category-select');
    this.saveAttachmentButton = page.getByTestId('add-attachment-modal-save-button');
  }

  async openAddAttachment(): Promise<void> {
    await this.addAttachmentButton.click();
    await expect(this.dropzone).toBeVisible();
  }

  /**
   * Drags a text file onto the dropzone with real dragenter, dragover, and drop events.
   * The file is created in the browser, so no local file path is needed.
   */
  async dropFile(fileName: string, content: string): Promise<void> {
    const dataTransfer = await this.page.evaluateHandle(
      ({ name, text }) => {
        const transfer = new DataTransfer();
        transfer.items.add(new File([text], name, { type: 'text/plain' }));
        return transfer;
      },
      { name: fileName, text: content },
    );
    for (const type of ['dragenter', 'dragover', 'drop']) {
      await this.dropzone.dispatchEvent(type, { dataTransfer });
    }
    await expect(this.dropzone.getByText(fileName, { exact: true })).toBeVisible();
  }

  /** Chooses the category, saves, and checks the attachment API accepted the file. */
  async saveAttachment(category: string = attachmentCategory): Promise<void> {
    await this.categorySelect.click();
    await this.page.getByRole('option', { name: category, exact: true }).click();
    const saved = this.page.waitForResponse(
      (r) => /\/bonds\/\d+\/attachments$/.test(new URL(r.url()).pathname) && r.request().method() === 'POST',
    );
    await this.saveAttachmentButton.click();
    const response = await saved;
    expect(response.status(), 'Attachment upload should return 201 Created').toBe(201);
    await expect(this.attachmentModal).toBeHidden();
  }

  /** Reloads the bond so the check proves the attachment was stored, not only shown in the dialog. */
  async assertAttachmentListed(fileName: string): Promise<void> {
    await this.page.reload();
    await expect(this.addAttachmentButton).toBeVisible();
    await expect(this.page.getByText(fileName, { exact: true })).toBeVisible();
  }
}
