import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root',
})
export class UploadImagesService {
  private IMAGES_FOLDER = 'img';

  constructor(private db: AngularFirestore) {}

  private saveImg(img: { name: string; url: string }) {
    this.db.collection(`/${this.IMAGES_FOLDER}`).add(img);
  }

  uploadImagesFirebase(images: FileItem[]) {
    const storageRef = firebase.storage().ref();

    for (const item of images) {
      item.loading = true;
      if (item.progress >= 100) {
        continue;
      }

      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(`${this.IMAGES_FOLDER}/${item.fileName}`)
        .put(item.file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>
          (item.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => console.error('Error on upload file', error),
        () => {
          console.log('File uploaded');
          uploadTask.snapshot.ref.getDownloadURL().then((res) => {
            item.url = res;
            item.loading = false;
            this.saveImg({
              name: item.fileName,
              url: item.url,
            });
          });
        }
      );
    }
  }
}
