import { ICodeName, Vehicle } from "./vehicle";

// export class LogHistories {
//   City!: string;
//   CoDriverId!: string;
//   Comment!: string;
//   CountryCode!: string;
//   DataDiagnosticEvent!: boolean;
//   DateBgn!: string;
//   DateEnd!: string;
//   DistanceSince!: number;
//   DriverId!: string;
//   ELDId!: string;
//   EngineHours!: number;
//   EventDataCheck!: string;
//   EventRecordOriginCode!: string;
//   EventRecordOriginName!: string;
//   EventRecordStatusCode!: string;
//   EventRecordStatusName!: string;
//   EventSequenceNumber!: number;
//   EventTypeCode!: string;
//   EventTypeName!: string;
//   EventTypeType!: string;
//   Latitude!: number;
//   LocationDescription!: string;
//   LocationDescriptionManual!: string;
//   LocationSourceCode!: string;
//   LocationSourceName!: string;
//   LogDailiesId!: string;
//   LogHistoriesId!: string;
//   Longitude!: number;
//   Malfunction!: boolean;
//   Odometer!: number;
//   PositioningCode!: string;
//   PositioningName!: string;
//   SendLogToInspector!: boolean;
//   StateProvinceCode!: string;
//   VehicleId!: string;
// }

export interface LogEvents {
  logEventId: string;
  companyId: string;
  driverId: string;
  eventTime: IEventTime;
  vehicle: Partial<Vehicle>;
  eld?: IEld;
  location: ILocation;
  sequenceNumber: number;
  type: ICodeName;
  recordStatus: ICodeName;
  recordOrigin: ICodeName;
  odometer: number;
  engineHours: number;
  malfunction: boolean;
  dataDiagnosticEvent: boolean;
  certificationDate: string;
  comment: string;
  eventDataCheck: string;
  inspection: boolean;
  checkbox?: number; //
  status?: number; //
}

interface IEventTime {
  logDate: string;
  timeStamp: number;
  timeStampEnd: number;
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
