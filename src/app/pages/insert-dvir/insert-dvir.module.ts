import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InsertDvirPageRoutingModule } from './insert-dvir-routing.module';

import { InsertDvirPage } from './insert-dvir.page';

import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { StatusRadioButtonComponentModule } from 'src/app/components/status-radio-button/status-radio-button.module';
import { InputComponentModule } from 'src/app/components/input/input.module';
import { SelectComponentModule } from 'src/app/components/select/select.module';
import { TextareaComponentModule } from 'src/app/components/textarea/textarea.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InsertDvirPageRoutingModule,
    HeaderComponentModule,
    StatusRadioButtonComponentModule,
    InputComponentModule,
    SelectComponentModule,
    TextareaComponentModule,
  ],
  declarations: [InsertDvirPage],
})
export class InsertDvirPageModule {}

// const dvirId = this.navParams.get('dvirId');
// if (dvirId) {
//   this.databaseSubscription = this.databaseService
//     .getDvirById(dvirId)
//     .subscribe((dvir) => {
//       if (dvir) {
//         this.dvir = dvir;
//         this.fillFormWithDvirData();
//       } else {
//         // Handle the case if DVIR not found.
//       }
//     });
// }
// }

// fillFormWithDvirData() {
// if (this.dvir) {
//   this.form.patchValue({
//     Date: this.dvir.CreateDate,
//     Time: this.dvir.CreateDate,
//     LocationDescription: this.dvir.LocationDescription,
//     VehicleUnit: this.dvir.VehicleUnit,
//     Trailers: this.dvir.Trailers,
//     Odometer: this.dvir.Odometer,
//     DefectsVehicle: this.dvir.DefectsVehicle,
//     DefectsTrailers: this.dvir.DefectsTrailers,
//     Remarks: this.dvir.Remarks,
//     StatusName: this.dvir.StatusName,
//     StatusCode: this.dvir.StatusCode,
//     Signature: this.dvir.Signature,
//   });
// }
// }

// updateDvirStatusCode() {
// const defectsVehicle = this.form.value.DefectsVehicle || [];
// const defectsTrailers = this.form.value.DefectsTrailers || [];
// const hasDefects = defectsVehicle.length > 0 || defectsTrailers.length > 0;
// this.form.patchValue({ StatusCode: hasDefects ? 'D' : 'VCS' });
// }

// isStatusDisabled(statusToDisable: string): boolean {
// const defectsVehicle = this.form.value.DefectsVehicle || [];
// const defectsTrailers = this.form.value.DefectsTrailers || [];
// const hasDefects = defectsVehicle.length > 0 || defectsTrailers.length > 0;
// if (hasDefects) {
//   return statusToDisable === 'VCS';
// }
// return statusToDisable === 'D';
// }

// initSignaturePad() {
// // Your code for initializing the signature pad (similar to insert-dvir.page.ts).
// }

// clearSignature() {
// // Your code for clearing the signature (similar to insert-dvir.page.ts).
// }

// async onSubmit() {
// if (this.form.valid && this.dvir) {
//   // Your code to update the DVIR record in the database.
//   // Once the update is successful, you can navigate back to the "DvirPage".
//   this.navCtrl.navigateBack('/unitab/dvir');
// }
// }

// ionViewWillLeave() {
// if (this.databaseSubscription) {
//   this.databaseSubscription.unsubscribe();
// }
// }
