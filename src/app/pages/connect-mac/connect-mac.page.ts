import { Component, OnInit } from '@angular/core';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';

@Component({
  selector: 'app-connect-mac',
  templateUrl: './connect-mac.page.html',
  styleUrls: ['./connect-mac.page.scss'],
})
export class ConnectMacPage implements OnInit {
  macAddress: string = '';
  constructor(private bluetoothLE: BluetoothLE) {}

  ngOnInit() {}

  connectToDevice() {
    const params = {
      address: this.macAddress,
    };

    this.bluetoothLE.connect(params).subscribe(
      (success) => {
        console.log(params);
        console.log('Connected to PT-30U', success);
        // Дальнейшая обработка успешного подключения
      },
      (error) => {
        console.log('Failed to connect to PT-30U', error);
        // Обработка ошибки подключения
      }
    );
  }
}
