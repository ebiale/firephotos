import {
  Directive,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]',
})
export class NgDropFilesDirective {
  @Input() files: FileItem[] = [];
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  @HostListener('dragover', ['$event'])
  public onDragOver(event: any) {
    this.mouseOver.emit(true);
    this.preventAndStop(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    const transfer = this.getTransfer(event);

    if (!transfer) {
      return;
    }

    this.getFiles(transfer.files);

    this.preventAndStop(event);
    this.mouseOver.emit(false);
  }

  private getFiles(fileList: FileList) {
    console.log(fileList);

    // tslint:disable-next-line: forin
    for (const property in Object.getOwnPropertyNames(fileList)) {
      const tempFile = fileList[property];
      if (this.canUpload(tempFile)) {
        const newFile = new FileItem(tempFile);
        this.files.push(newFile);
      }
    }

    console.log(this.files);
  }

  private getTransfer(event: any) {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  // Validations

  private canUpload(file: File): boolean {
    if (!this.alreadyDroppedFile(file.name) && this.isImage(file.type)) {
      return true;
    }

    return false;
  }

  private preventAndStop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private alreadyDroppedFile(fileName: string): boolean {
    for (const file of this.files) {
      if (file.fileName === fileName) {
        console.log(`File ${fileName} already exists`);
        return true;
      }
    }
    return false;
  }

  private isImage(fileType: string): boolean {
    return fileType === '' || fileType === undefined
      ? false
      : fileType.startsWith('image');
  }
}
