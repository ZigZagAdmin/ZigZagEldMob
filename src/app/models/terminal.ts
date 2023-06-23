import { StateProvince } from './state-province';

export class Terminal {
  TerminalId!: string;
  CompanyId!: string;
  TimeZoneCode!: string;
  TimeZoneName!: string;
  Street!: string;
  City!: string;
  CountryCode!: string;
  StateProvinceCode!: string;
  ZipCode!: string;
  ListStateProvince!: StateProvince[];
}
