import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarSimulatorService {
  dataBehSub: BehaviorSubject<{ [key: string]: string }> = new BehaviorSubject<{ [key: string]: string }>(null);
  dataObs: Observable<{ [key: string]: string }> = this.dataBehSub.asObservable();

  engStatus: any;
  drivingStatus: any;

  dataInterval: any;
  odometer = 0;
  engineHours = 0;
  speed = 0;
  rpm = 0;
  data: { [key: string]: string } = { O: this.odometer.toString(), H: this.engineHours.toString(), V: this.speed.toString(), R: this.rpm.toString() };
  constructor() {}

  startSimulation() {
    this.dataInterval = setInterval(() => {
      this.data = { O: this.odometer.toFixed(0), H: this.engineHours.toFixed(4), V: this.speed.toString(), R: this.rpm.toString() };
      console.log('simulated data:', this.data);
      this.dataBehSub.next(this.data);
    }, 10000);
  }

  stopSimulation() {
    clearInterval(this.dataInterval);
  }

  startEngine() {
    this.rpm = 1200;
    this.engStatus = setInterval(() => {
      this.engineHours += 0.0013;
    }, 5000);
  }

  stopEngine() {
    this.rpm = 0;
    this.speed = 0;
    clearInterval(this.engStatus);
    clearInterval(this.drivingStatus);
  }

  driving() {
    this.speed = 55;
    this.drivingStatus = setInterval(() => {
      this.odometer += 0.0764;
    }, 5000);
  }

  stopDriving() {
    this.speed = 0;
    clearInterval(this.drivingStatus);
  }
}
