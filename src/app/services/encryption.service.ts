import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  public encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, 'g8UN77VoLSa91u3').toString();
  }
  
  public decrypt(txt: string) {
    return CryptoJS.AES.decrypt(txt, 'g8UN77VoLSa91u3').toString(CryptoJS.enc.Utf8);
  }
}
