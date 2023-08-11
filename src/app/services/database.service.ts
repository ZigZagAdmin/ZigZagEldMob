import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  Observable,
  from,
  throwError,
  Subscription,
  BehaviorSubject,
} from 'rxjs';
import { Driver } from '../models/driver';
import { Company } from '../models/company';
import { Vehicle } from '../models/vehicle';
import { Terminal } from '../models/terminal';
import { ELD } from '../models/eld';
import { LogDailies } from '../models/log-dailies';
import { LogHistories } from '../models/log-histories';
import { User } from '../models/user';
import { AuthUser } from '../models/auth-user';
import { DVIRs } from '../models/dvirs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private databaseReady: boolean = false;
  databaseReadySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  databaseReadySubscription: Subscription | undefined;
  constructor(private storage: Storage) {
    this.create();
  }

  async create(): Promise<void> {
    try {
      await this.storage.create();
      this.databaseReady = true;
      this.databaseReadySubject.next(true);

      const offlineArray = await this.storage.get('offlineArray');
      console.log('offlineArray ', offlineArray);
      if (!offlineArray) {
        await this.storage.set('offlineArray', []);
        console.log('offlineArrayCreated');
      }
    } catch (error) {
      console.error('Error creating offlineArray  :', error);
    }
  }

  isDatabaseReady(): Observable<boolean> {
    return this.databaseReadySubject.asObservable();
  }

  saveDrivers(drivers: Driver): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('drivers', drivers));
  }

  getDrivers(): Observable<Driver> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('drivers'));
  }

  saveAuthUser(user: AuthUser): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('user', user));
  }

  getUser(): Observable<User> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('user'));
  }

  saveCompany(company: Company): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('company', company));
  }

  getCompany(): Observable<Company> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('company'));
  }

  saveVehicles(vehicles: Vehicle[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('vehicles', vehicles));
  }

  getVehicles(): Observable<Vehicle[]> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('vehicles'));
  }

  saveTerminals(terminals: Terminal[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('terminals', terminals));
  }

  getTerminals(): Observable<Terminal[]> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('terminals'));
  }

  saveELDs(elds: ELD[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('elds', elds));
  }

  getELDs(): Observable<ELD[]> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('elds'));
  }

  saveLogDailies(logDailies: LogDailies[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('logDailies', logDailies));
  }

  getLogDailies(): Observable<LogDailies[]> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('logDailies'));
  }

  saveLogHistories(logHistories: LogHistories[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('logHistories', logHistories));
  }

  getLogHistories(): Observable<LogHistories[]> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('logHistories'));
  }

  saveDvirs(dvirs: DVIRs[]): Observable<void> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.set('dvirs', dvirs));
  }

  getDvirs(): Observable<DVIRs[]> {
    if (!this.databaseReady) {
      return throwError(
        'База данных не создана. Сначала вызовите метод create()'
      );
    }
    return from(this.storage.get('dvirs'));
  }
}

// async saveDriverData(driverData: any) {
//   try {
//     const db: SQLiteObject = await this.sqlite.create({
//       name: 'zigzag.db3',
//       location: 'default',
//     });

//     const cv: any = {
//       driver_id: driverData.DriverId,
//       company_id: driverData.CompanyId,
//       name: driverData.Name,
//       email: driverData.Email,
//       user_name: driverData.UserName,
//       driver_identifier: driverData.DriverIdentifier,
//       phone_number: driverData.PhoneNumber,
//       state_province_code: driverData.StateProvinceCode,
//       license_number: driverData.LicenseNumber,
//       home_terminal_id: driverData.HomeTerminalId,
//       assigned_vehicles_id: driverData.AssignedVehiclesId,
//       hours_of_service_rule: driverData.HoursOfServiceRuleName,
//       hours_of_service_rule_days: driverData.HoursOfServiceRuleDays,
//       hours_of_service_rule_hours: driverData.HoursOfServiceRuleHours,
//       cargo_type: driverData.CargoTypeName,
//       restart_hours: driverData.RestartHoursName,
//       rest_break: driverData.RestBreakName,
//       short_haul_exception: driverData.ShortHaulException,
//       allow_yard_moves: driverData.AllowYardMoves,
//       allow_personal_use: driverData.AllowPersonalUse,
//       unlimited_trailers: 0,
//       unlimited_ship_doc: 0,
//     };

//     const existingDriver = await db.executeSql(
//       `SELECT * FROM driver WHERE driver_id = ?`,
//       [driverData.DriverId]
//     );

//     if (existingDriver.rows.length > 0) {
//       const updateResult = await db.executeSql(
//         `UPDATE driver SET company_id = ?, name = ?, email = ?, user_name = ?, driver_identifier = ?, phone_number = ?, state_province_code = ?, license_number = ?, home_terminal_id = ?, assigned_vehicles_id = ?, hours_of_service_rule = ?, hours_of_service_rule_days = ?, hours_of_service_rule_hours = ?, cargo_type = ?, restart_hours = ?, rest_break = ?, short_haul_exception = ?, allow_yard_moves = ?, allow_personal_use = ?, unlimited_trailers = ?, unlimited_ship_doc = ? WHERE driver_id = ?`,
//         [
//           cv.company_id,
//           cv.name,
//           cv.email,
//           cv.user_name,
//           cv.driver_identifier,
//           cv.phone_number,
//           cv.state_province_code,
//           cv.license_number,
//           cv.home_terminal_id,
//           cv.assigned_vehicles_id,
//           cv.hours_of_service_rule,
//           cv.hours_of_service_rule_days,
//           cv.hours_of_service_rule_hours,
//           cv.cargo_type,
//           cv.restart_hours,
//           cv.rest_break,
//           cv.short_haul_exception,
//           cv.allow_yard_moves,
//           cv.allow_personal_use,
//           cv.unlimited_trailers,
//           cv.unlimited_ship_doc,
//           cv.driver_id,
//         ]
//       );

//       console.log('Driver updated:', updateResult);
//     } else {
//       const insertResult = await db.executeSql(
//         `INSERT INTO driver (driver_id, company_id, name, email, user_name, driver_identifier, phone_number, state_province_code, license_number, home_terminal_id, assigned_vehicles_id, hours_of_service_rule, hours_of_service_rule_days, hours_of_service_rule_hours, cargo_type, restart_hours, rest_break, short_haul_exception, allow_yard_moves, allow_personal_use, unlimited_trailers, unlimited_ship_doc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           cv.driver_id,
//           cv.company_id,
//           cv.name,
//           cv.email,
//           cv.user_name,
//           cv.driver_identifier,
//           cv.phone_number,
//           cv.state_province_code,
//           cv.license_number,
//           cv.home_terminal_id,
//           cv.assigned_vehicles_id,
//           cv.hours_of_service_rule,
//           cv.hours_of_service_rule_days,
//           cv.hours_of_service_rule_hours,
//           cv.cargo_type,
//           cv.restart_hours,
//           cv.rest_break,
//           cv.short_haul_exception,
//           cv.allow_yard_moves,
//           cv.allow_personal_use,
//           cv.unlimited_trailers,
//           cv.unlimited_ship_doc,
//         ]
//       );

//       console.log('Driver inserted:', insertResult);
//     }

//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }

// async saveCompanyData(companyData: any) {
//   try {
//     const db = await this.sqlite.create({
//       name: 'zigzag.db3',
//       location: 'default',
//       createFromLocation: 1,
//     });

//     const cv = {
//       company_id: companyData.CompanyId,
//       name: companyData.Name,
//       dot_number: companyData.DotNumber,
//       street: companyData.Street,
//       city: companyData.City,
//       country_code: companyData.CountryCode,
//       state_province_code: companyData.StateProvinceCode,
//       zip_code: companyData.ZipCode,
//       time_zone_code: companyData.TimeZoneCode,
//       time_zone_city: companyData.TimeZoneCity,
//     };

//     const existingCompany = await db.executeSql(
//       `SELECT * FROM company WHERE company_id = ?`,
//       [companyData.CompanyId]
//     );

//     if (existingCompany.rows.length > 0) {
//       const updateResult = await db.executeSql(
//         `UPDATE company SET name = ?, dot_number = ?, street = ?, city = ?, country_code = ?, state_province_code = ?, zip_code = ?, time_zone_code = ?, time_zone_city = ? WHERE company_id = ?`,
//         [
//           cv.name,
//           cv.dot_number,
//           cv.street,
//           cv.city,
//           cv.country_code,
//           cv.state_province_code,
//           cv.zip_code,
//           cv.time_zone_code,
//           cv.time_zone_city,
//           companyData.CompanyId,
//         ]
//       );

//       console.log('Company updated:', updateResult);
//     } else {
//       const insertResult = await db.executeSql(
//         `INSERT INTO company (company_id, name, dot_number, street, city, country_code, state_province_code, zip_code, time_zone_code, time_zone_city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           cv.company_id,
//           cv.name,
//           cv.dot_number,
//           cv.street,
//           cv.city,
//           cv.country_code,
//           cv.state_province_code,
//           cv.zip_code,
//           cv.time_zone_code,
//           cv.time_zone_city,
//         ]
//       );

//       console.log('Company inserted:', insertResult);
//     }

//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }

// async saveVehicleData(assignedVehiclesId: any, vehiclesData: any) {
//   try {
//     const db = await this.sqlite.create({
//       name: 'zigzag.db3',
//       location: 'default',
//       createFromLocation: 1,
//     });

//     const cv = {
//       vehicle_id: vehiclesData.VehicleId,
//       company_id: vehiclesData.CompanyId,
//       vehicle_unit: vehiclesData.VehicleUnit,
//       vin: vehiclesData.VIN,
//       make: vehiclesData.Make,
//       model: vehiclesData.Model,
//       year: vehiclesData.Year,
//     };

//     if (assignedVehiclesId === vehiclesData.VehicleId) {
//       const existingVehicle = await db.executeSql(
//         `SELECT * FROM vehicles WHERE vehicle_id = ?`,
//         [vehiclesData.VehicleId]
//       );

//       if (existingVehicle.rows.length > 0) {
//         const updateResult = await db.executeSql(
//           `UPDATE vehicles SET company_id = ?, vehicle_unit = ?, vin = ?, make = ?, model = ?, year = ? WHERE vehicle_id = ?`,
//           [
//             cv.company_id,
//             cv.vehicle_unit,
//             cv.vin,
//             cv.make,
//             cv.model,
//             cv.year,
//             cv.vehicle_id,
//           ]
//         );

//         console.log('Vehicle updated:', updateResult);
//       } else {
//         const insertResult = await db.executeSql(
//           `INSERT INTO vehicles (vehicle_id, company_id, vehicle_unit, vin, make, model, year) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//           [
//             cv.vehicle_id,
//             cv.company_id,
//             cv.vehicle_unit,
//             cv.vin,
//             cv.make,
//             cv.model,
//             cv.year,
//           ]
//         );

//         console.log('Vehicle inserted:', insertResult);
//       }
//     }

//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }

// async saveTerminalData(terminalsData: any) {
//   try {
//     const db = await this.sqlite.create({
//       name: 'zigzag.db3',
//       location: 'default',
//       createFromLocation: 1,
//     });

//     for (let i = 0; i < terminalsData.length; i++) {
//       const obj = terminalsData[i];
//       const terminalId = obj.TerminalId;

//       const cv = {
//         terminal_id: obj.TerminalId,
//         company_id: obj.CompanyId,
//         time_zone_code: obj.TimeZoneCode,
//         street: obj.Street,
//         city: obj.City,
//         country_code: obj.CountryCode,
//         state_province_code: obj.StateProvinceCode,
//         zip_code: obj.ZipCode,
//       };

//       const existingTerminal = await db.executeSql(
//         `SELECT * FROM terminal WHERE terminal_id = ?`,
//         [terminalId]
//       );

//       if (existingTerminal.rows.length > 0) {
//         const updateResult = await db.executeSql(
//           `UPDATE terminal SET company_id = ?, time_zone_code = ?, street = ?, city = ?, country_code = ?, state_province_code = ?, zip_code = ? WHERE terminal_id = ?`,
//           [
//             cv.company_id,
//             cv.time_zone_code,
//             cv.street,
//             cv.city,
//             cv.country_code,
//             cv.state_province_code,
//             cv.zip_code,
//             cv.terminal_id,
//           ]
//         );

//         console.log('Terminal updated:', updateResult);
//       } else {
//         const insertResult = await db.executeSql(
//           `INSERT INTO terminal (terminal_id, company_id, time_zone_code, street, city, country_code, state_province_code, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//           [
//             cv.terminal_id,
//             cv.company_id,
//             cv.time_zone_code,
//             cv.street,
//             cv.city,
//             cv.country_code,
//             cv.state_province_code,
//             cv.zip_code,
//           ]
//         );

//         console.log('Terminal inserted:', insertResult);
//       }
//     }

//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }

// async saveELDData(ELDData: any) {
//   try {
//     const db = await this.sqlite.create({
//       name: 'zigzag.db3',
//       location: 'default',
//       createFromLocation: 1,
//     });

//     for (let i = 0; i < ELDData.length; i++) {
//       const obj = ELDData[i];
//       const ELDId = obj.ELDId;

//       const cv = {
//         eld_name: '',
//         eld_id: obj.ELDId,
//         company_id: obj.CompanyId,
//         mac_address: obj.MACAddress,
//         type: obj.Type,
//         vehicle_id: obj.VehicleId,
//         fw_version: obj.FWVersion,
//         uuid: '',
//         upload: 1,
//       };

//       const existingELD = await db.executeSql(
//         `SELECT * FROM eld WHERE eld_id = ?`,
//         [ELDId]
//       );

//       if (existingELD.rows.length > 0) {
//         const updateResult = await db.executeSql(
//           `UPDATE eld SET eld_name = ?, company_id = ?, mac_address = ?, type = ?, vehicle_id = ?, fw_version = ?, uuid = ?, upload = ? WHERE eld_id = ?`,
//           [
//             cv.eld_name,
//             cv.company_id,
//             cv.mac_address,
//             cv.type,
//             cv.vehicle_id,
//             cv.fw_version,
//             cv.uuid,
//             cv.upload,
//             cv.eld_id,
//           ]
//         );

//         console.log('ELD updated:', updateResult);
//       } else {
//         const insertResult = await db.executeSql(
//           `INSERT INTO eld (eld_name, eld_id, company_id, mac_address, type, vehicle_id, fw_version, uuid, upload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//           [
//             cv.eld_name,
//             cv.eld_id,
//             cv.company_id,
//             cv.mac_address,
//             cv.type,
//             cv.vehicle_id,
//             cv.fw_version,
//             cv.uuid,
//             cv.upload,
//           ]
//         );

//         console.log('ELD inserted:', insertResult);
//       }
//     }
//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }

// async getLogDailesData(LogDailesData: any) {
//   try {
//     const db = await this.sqlite.create({
//       name: 'zigzag.db3',
//       location: 'default',
//       createFromLocation: 1,
//     });

//     for (let i = 0; i < LogDailesData.length; i++) {
//       const obj = LogDailesData[i];
//       const logDailiesId = obj.LogDailiesId;

//       const data = {
//         company_id: obj.CompanyId,
//         driver_id: obj.DriverId,
//         vehicle_id: obj.VehicleId,
//         log_dailies_id: obj.LogDailiesId,
//         day: obj.Day,
//         hours_off_duty: obj.HoursOffDuty,
//         hours_sleeper: obj.HoursSleeper,
//         hours_driving: obj.HoursDriving,
//         hours_on_duty: obj.HoursOnDuty,
//         hours_worked: obj.HoursWorked,
//         violations: obj.Violations,
//         form_manner: obj.FormManner,
//         trailers: obj.Trailers,
//         shipping_doc: obj.ShippingDoc,
//         from_address: obj.FromAddress,
//         to_address: obj.ToAddress,
//         certified: obj.Certified,
//         certify_timestamp:
//           obj.CertifyTimestamp === '0001-01-01T00:00:00'
//             ? null
//             : obj.CertifyTimestamp,
//         signature: obj.Signature,
//         upload: 1,
//       };

//       console.log('load Day:', obj.Day);

//       const existingLogDailies = await db.executeSql(
//         'SELECT * FROM log_dailies WHERE log_dailies_id = ?',
//         [logDailiesId]
//       );

//       if (existingLogDailies.rows.length > 0) {
//         const updateResult = await db.executeSql(
//           'UPDATE log_dailies SET company_id = ?, driver_id = ?, vehicle_id = ?, day = ?, hours_off_duty = ?, hours_sleeper = ?, hours_driving = ?, hours_on_duty = ?, hours_worked = ?, violations = ?, form_manner = ?, trailers = ?, shipping_doc = ?, from_address = ?, to_address = ?, certified = ?, certify_timestamp = ?, signature = ?, upload = ? WHERE log_dailies_id = ?',
//           [
//             data.company_id,
//             data.driver_id,
//             data.vehicle_id,
//             data.day,
//             data.hours_off_duty,
//             data.hours_sleeper,
//             data.hours_driving,
//             data.hours_on_duty,
//             data.hours_worked,
//             data.violations,
//             data.form_manner,
//             data.trailers,
//             data.shipping_doc,
//             data.from_address,
//             data.to_address,
//             data.certified,
//             data.certify_timestamp,
//             data.signature,
//             data.upload,
//             data.log_dailies_id,
//           ]
//         );

//         console.log('Log Dailies updated:', updateResult);
//       } else {
//         const insertResult = await db.executeSql(
//           'INSERT INTO log_dailies (company_id, driver_id, vehicle_id, log_dailies_id, day, hours_off_duty, hours_sleeper, hours_driving, hours_on_duty, hours_worked, violations, form_manner, trailers, shipping_doc, from_address, to_address, certified, certify_timestamp, signature, upload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//           [
//             data.company_id,
//             data.driver_id,
//             data.vehicle_id,
//             data.log_dailies_id,
//             data.day,
//             data.hours_off_duty,
//             data.hours_sleeper,
//             data.hours_driving,
//             data.hours_on_duty,
//             data.hours_worked,
//             data.violations,
//             data.form_manner,
//             data.trailers,
//             data.shipping_doc,
//             data.from_address,
//             data.to_address,
//             data.certified,
//             data.certify_timestamp,
//             data.signature,
//             data.upload,
//           ]
//         );

//         console.log('Log Dailies inserted:', insertResult);
//       }
//     }
//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }

// async getLogHistoriesData(LogHistoriesData: any) {
//   try {
//     const db = await this.sqlite.create({
//       name: 'zigzag.db3',
//       location: 'default',
//       createFromLocation: 1,
//     });

//     for (let i = 0; i < LogHistoriesData.length; i++) {
//       const obj = LogHistoriesData[i];
//       const logDailiesId = obj.LogDailiesId;

//       const cv = {
//         company_id: obj.CompanyId,
//         driver_id: obj.DriverId,
//         vehicle_id: obj.VehicleId,
//         log_dailies_id: obj.LogDailiesId,
//         day: obj.Day,
//         hours_off_duty: obj.HoursOffDuty,
//         hours_sleeper: obj.HoursSleeper,
//         hours_driving: obj.HoursDriving,
//         hours_on_duty: obj.HoursOnDuty,
//         hours_worked: obj.HoursWorked,
//         violations: obj.Violations,
//         form_manner: obj.FormManner,
//         trailers: obj.Trailers,
//         shipping_doc: obj.ShippingDoc,
//         from_address: obj.FromAddress,
//         to_address: obj.ToAddress,
//         certified: obj.Certified,
//         certify_timestamp:
//           obj.CertifyTimestamp === '0001-01-01T00:00:00'
//             ? null
//             : obj.CertifyTimestamp,
//         signature: obj.Signature,
//         upload: 1,
//       };

//       console.log('load Day:', obj.Day);

//       const existingLogDailies = await db.executeSql(
//         'SELECT * FROM log_dailies WHERE log_dailies_id = ?',
//         [logDailiesId]
//       );

//       if (existingLogDailies.rows.length > 0) {
//         const updateResult = await db.executeSql(
//           'UPDATE log_dailies SET company_id = ?, driver_id = ?, vehicle_id = ?, day = ?, hours_off_duty = ?, hours_sleeper = ?, hours_driving = ?, hours_on_duty = ?, hours_worked = ?, violations = ?, form_manner = ?, trailers = ?, shipping_doc = ?, from_address = ?, to_address = ?, certified = ?, certify_timestamp = ?, signature = ?, upload = ? WHERE log_dailies_id = ?',
//           [
//             cv.company_id,
//             cv.driver_id,
//             cv.vehicle_id,
//             cv.day,
//             cv.hours_off_duty,
//             cv.hours_sleeper,
//             cv.hours_driving,
//             cv.hours_on_duty,
//             cv.hours_worked,
//             cv.violations,
//             cv.form_manner,
//             cv.trailers,
//             cv.shipping_doc,
//             cv.from_address,
//             cv.to_address,
//             cv.certified,
//             cv.certify_timestamp,
//             cv.signature,
//             cv.upload,
//             cv.log_dailies_id,
//           ]
//         );

//         console.log('Log Dailies updated:', updateResult);
//       } else {
//         const insertResult = await db.executeSql(
//           'INSERT INTO log_dailies (company_id, driver_id, vehicle_id, log_dailies_id, day, hours_off_duty, hours_sleeper, hours_driving, hours_on_duty, hours_worked, violations, form_manner, trailers, shipping_doc, from_address, to_address, certified, certify_timestamp, signature, upload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//           [
//             cv.company_id,
//             cv.driver_id,
//             cv.vehicle_id,
//             cv.log_dailies_id,
//             cv.day,
//             cv.hours_off_duty,
//             cv.hours_sleeper,
//             cv.hours_driving,
//             cv.hours_on_duty,
//             cv.hours_worked,
//             cv.violations,
//             cv.form_manner,
//             cv.trailers,
//             cv.shipping_doc,
//             cv.from_address,
//             cv.to_address,
//             cv.certified,
//             cv.certify_timestamp,
//             cv.signature,
//             cv.upload,
//           ]
//         );

//         console.log('Log Dailies inserted:', insertResult);
//       }
//     }
//     return true;
//   } catch (error) {
//     console.log('Error:', error);
//     return false;
//   }
// }
// }

// async initializeDatabase() {
//   return this.sqlite
//     .create({
//       name: 'zigzag.db3',
//       location: 'default',
//       createFromLocation: 0,
//     })
//     .then((db: SQLiteObject) => {
//       this.db = db;
//     })
//     .catch((error) => console.error('Error opening database', error));
// }

// saveDriverData(driverData: any) {
//   if (!this.db) {
//     console.error('Database is not initialized');
//     return;
//   }

//   const query = `INSERT OR REPLACE INTO driver (driver_id, company_id, name, email, user_name, driver_identifier, phone_number, state_province_code, license_number, home_terminal_id, assigned_vehicles_id, hours_of_service_rule, hours_of_service_rule_days, hours_of_service_rule_hours, cargo_type, restart_hours, rest_break, short_haul_exception, allow_yard_moves, allow_personal_use, unlimited_trailers, unlimited_ship_doc)
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   const values = [
//     driverData.driver_id,
//     driverData.company_id,
//     driverData.name,
//     driverData.email,
//     driverData.user_name,
//     driverData.driver_identifier,
//     driverData.phone_number,
//     driverData.state_province_code,
//     driverData.license_number,
//     driverData.home_terminal_id,
//     driverData.assigned_vehicles_id,
//     driverData.hours_of_service_rule,
//     driverData.hours_of_service_rule_days,
//     driverData.hours_of_service_rule_hours,
//     driverData.cargo_type,
//     driverData.restart_hours,
//     driverData.rest_break,
//     driverData.short_haul_exception ? 1 : 0,
//     driverData.allow_yard_moves ? 1 : 0,
//     driverData.allow_personal_use ? 1 : 0,
//     driverData.unlimited_trailers ? 1 : 0,
//     driverData.unlimited_ship_doc ? 1 : 0,
//   ];

//   return this.db
//     .executeSql(query, values)
//     .then(() => console.log('Driver data saved successfully'))
//     .catch((error) => console.error('Error saving driver data', error));
// }
