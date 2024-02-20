import { ISettings } from "./company";
import { ICodeName, ILicensePlate } from "./vehicle";

export class Driver {
  driverId!: string;
  companyId!: string;
  name!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  emailConfirmed!: string;
  userName!: string;
  driverIdentifier!: string;
  phoneNumber!: string;
  driverInfo: IDriverInfo;
  simCard!: string;
  deviceModel!: string;
  operatingSystem!: string;
  appVersion!: string;
  status!: boolean;
}

export interface IDriverInfo {
  companyDriverId: string;
  licenseNumber: string;
  licenseState: string;
  licenseCountry: string;
  homeTerminalId: string;
  assignedVehicles: IAssignedVehicle[];
  settings: ISettings;
}

export interface IAssignedVehicle {
  vehicleId: string;
  companyId: string;
  vehicleUnit: string;
  vin: string;
  make?: string;
  model?: string;
  year?: string;
  fuel?: ICodeName;
  licensePlate?: ILicensePlate;
  status?: boolean;
}
