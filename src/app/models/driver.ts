export class Driver {
  DriverId!: string;
  CompanyId!: string;
  Name!: string;
  FirstName!: string;
  LastName!: string;
  Email!: string;
  EmailConfirmed!: string;
  UserName!: string;
  DriverIdentifier!: string;
  PhoneNumber!: string;
  CountryCode!: string;
  StateProvinceCode!: string;
  LicenseNumber!: string;
  Password!: string;
  HomeTerminalId!: string;
  AssignedVehiclesId!: string;
  VehicleUnit!: string;

  VehicleMotionThresholdCode!: string;
  HoursOfServiceRuleCode!: string;
  HoursOfServiceRuleName!: string;
  HoursOfServiceRuleDays!: number;
  HoursOfServiceRuleHours!: number;
  CargoTypeCode!: string;
  RestartHoursCode!: string;
  RestBreakCode!: string;
  ExemptDriver!: boolean;
  WaitingTimeException!: boolean;
  ShortHaulException!: boolean;
  AllowYardMoves!: boolean;
  AllowPersonalUse!: boolean;

  SimCard!: string;
  DeviceModel!: string;
  OperatingSystem!: string;
  AppVersion!: string;
  Status!: boolean;
}
