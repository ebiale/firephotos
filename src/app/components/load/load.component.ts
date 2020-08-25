import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { UploadImagesService } from '../../services/upload-images.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styles: [
  ]
})
export class LoadComponent implements OnInit {

  dragOver = false;
  files: FileItem[] = [];

  constructor(public ls: UploadImagesService) { }

  ngOnInit(): void {
  }

  uploadImages() {
    this.ls.uploadImagesFirebase(this.files);
  }

  clearImages() {
    this.files = [];
  }
}
