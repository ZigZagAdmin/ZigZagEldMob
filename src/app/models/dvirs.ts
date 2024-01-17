import { Driver } from './driver';
import { ICodeName, Vehicle } from './vehicle';

export interface DVIRs {
  dvirId: string;
  driver: Partial<Driver>;
  vehicle: Partial<Vehicle>;
  odometer: number;
  trailers: string;
  defectsVehicle: string;
  defectsTrailers: string;
  remarks: string;
  status: ICodeName;
  location: Location;
  createDate: number;
  createTimeZone: string;
  repairDate?: number;
  repairTimeZone?: string;

  signatureId: string;
  signatureBase64?: string;
  signatureLink?: string;
  mechanicSignatureId?: string;
  mechanicSignatureBase64?: string;
  mechanicSignatureLink?: string;
}

export interface Location {
  description: string;
  latitude: number;
  longitude: number;
}
