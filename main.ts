// main.js
import { Plugin, TFile, Notice } from 'obsidian';

export default class MoveMarkdownToFolderPlugin extends Plugin {
  async onload() {

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file: TFile) => {
        if (file.extension === 'md') {
          menu.addItem((item) => {
            item.setTitle('Move to Folder')
              .setIcon('folder')
              .onClick(() => this.moveMarkdownToFolder(file));
          });
        }
      })
    );
  }

  async moveMarkdownToFolder(file: TFile) {
    const { vault } = this.app;
    const fileName = file.basename;
    if (!file.parent) {
      new Notice(`Failed to move ${file.name}: selected file has no parent folder`)
      return
    }
    const folderPath = `${file.parent.path}/${fileName}`;

    try {
      // Erstellen des Ordners
      await vault.createFolder(folderPath);

      // Verschieben der Datei in den neuen Ordner
      const newFilePath = `${folderPath}/${file.name}`;
      await vault.rename(file, newFilePath);

      new Notice(`Moved ${file.name} to ${folderPath}`);
    } catch (error) {
      new Notice(`Failed to move ${file.name}: ${error.message}`);
    }
  }
}