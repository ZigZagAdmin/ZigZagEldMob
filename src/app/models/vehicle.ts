export class Vehicle {
  vehicleId!: string;
  companyId!: string;
  vehicleUnit!: string;
  vin!: string;
  make!: string;
  model!: string;
  year!: string;
  fuel!: ICodeName;
  licensePlate!: ILicensePlate;
  status!: boolean;
}

export interface ICodeName {
  code: string;
  name: string;
}

export interface ILicensePlate {
  plateNumber: string;
  country: string;
  state: string;
  expirationDate: string;
}