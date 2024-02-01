import { Driver } from "./driver";

export interface LogDailies {
  logDailyId: string;
  companyId: string;
  driverId: string;
  driverName: string;
  logDate: string;
  timeOffDuty: number;
  timeSleeper: number;
  timeDriving: number;
  timeOnDuty: number;
  timeWorked: number;
  violations: string[];
  formManner: boolean;
  certified: boolean;
  form: IForm;

  sent?: boolean;
}

export interface IForm {
  trailers: string;
  shippingDoc: string;
  fromAddress: string;
  toAddress: string;
  signatureId: string;
  signature?: string;
  signatureLink?: string;
  coDriver?: Driver;
}

export interface ICoDriver {
  driverId: string;
  companyId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: string;
  userName: string;
  driverIdentifier: string;
  phoneNumber: string;
  driverInfo: string;
  simCard: string;
  deviceModel: string;
  operatingSystem: string;
  appVersion: string;
  status: boolean;
}
