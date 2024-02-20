import { ICodeName, Vehicle } from "./vehicle";

export interface LogEvents {
  logEventId: string;
  companyId: string;
  driverId: string;
  eventTime: IEventTime;
  vehicle: Partial<Vehicle>;
  eld?: IEld;
  location?: ILocation;
  sequenceNumber: number;
  type: ICodeName;
  recordStatus: ICodeName;
  recordOrigin?: ICodeName;
  odometer?: number;
  engineHours?: number;
  malfunction?: boolean;
  dataDiagnosticEvent?: boolean;
  certificationDate?: string;
  comment?: string;
  eventDataCheck?: string;
  inspection?: boolean;
  checkbox?: number; //
  status?: number; //

  sent?: boolean; 
}

interface IEventTime {
  logDate: string;
  timeStamp: number;
  timeStampEnd?: number;
  timeZone: string;
}

interface IEld {
  eldId: string;
  macAddress: string;
  serialNumber: string;
}

interface ILocation {
  locationType: string;
  description: string;
  latitude: number;
  longitude: number;
}
