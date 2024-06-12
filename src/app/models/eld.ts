export interface ELD {
  eldId: string;
  companyId: string;
  name: string;
  macAddress: string;
  type: string;
  vehicleId: string;
  vehicleUnit: string;
  malfunctions: string;
  fwVersion: string;
  status: string;

  sent?: boolean;
}
