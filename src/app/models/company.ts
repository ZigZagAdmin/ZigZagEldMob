import { ICodeName } from './vehicle';

export class Company {
  companyId!: string;
  name!: string;
  dotNumber!: number;
  mainOffice!: IMainOffice;
  settings!: ISettings;
  terminals!: ITerminal[];
  status!: boolean;
}

export interface IMainOffice {
  timeZoneCode: string;
  timeZoneName: string;
  street: string;
  city: string;
  countryCode: string;
  stateProvinceCode: string;
  zipCode: string;
  fullAddress: string;
}

export interface ISettings {
  complianceMode: ICodeName;
  vehicleMotionThreshold: ICodeName;
  hoursOfService: IHoursOfService;
  cargoType: ICodeName;
  restartHours: ICodeName;
  restBreak: ICodeName;
  exemptDriver: boolean;
  allowYardMoves: boolean;
  allowPersonalUse: boolean;
  waitingTimeException: boolean;
  shortHaulException: boolean;
}

export interface IHoursOfService {
  code: string;
  name: string;
  days: string;
  hours: string;
  odometerUnit: string;
}

export interface ITerminal {
  terminalId: string;
  timeZoneCode: string;
  timeZoneName: string;
  street: string;
  city: string;
  countryCode: string;
  stateProvinceCode: string;
  zipCode: string;
}
