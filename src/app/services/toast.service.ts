import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private currentToast: HTMLIonToastElement;

  constructor(private toastController: ToastController) {}

  public async showToast(message: string, color: string = 'danger', duration: number = 1000) {
    if (this.currentToast) {
      await this.dismissToast();
    }

    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
    });

    this.currentToast = toast;

    toast.onDidDismiss().then(() => {
      this.currentToast = null;
    });

    toast.present();
  }

  public async dismissToast() {
    if (this.currentToast) {
      await this.toastController.dismiss();
      this.currentToast = null;
    }
  }
}
