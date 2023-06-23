import { Component, OnInit } from '@angular/core';
import { AuthUser } from 'src/app/models/auth-user';
import { AuthService } from 'src/app/services/auth.service';
import { ManageService } from 'src/app/services/manage.service';
import { FormGroup, FormControl } from '@angular/forms';
import { forkJoin, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private manageService: ManageService,
    private route: Router
  ) {}

  focused = false;
  authUser!: AuthUser;

  ngOnInit() {}

  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }

  login(username: string, password: string) {
    this.authService
      .login(username, password)
      .pipe(
        switchMap((res) => {
          this.authUser = res;
          console.log(JSON.stringify(res));
          const fetchRequests = [
            this.manageService.getDrivers(),
            this.manageService.getCompany(),
            this.manageService.getVehicles(),
            this.manageService.getTerminals(),
            this.manageService.getELDs(),
            this.manageService.getLogDailies(
              res.DriverId,
              formatDate(new Date(), 'yyyy-MM-dd', 'en_US'),
              14
            ),
            this.manageService.getLogHistories14Days(res.DriverId),
          ];

          return forkJoin(fetchRequests).pipe(
            catchError((error) => {
              console.log(error);
              alert('Ошибка при выполнении запросов: ' + error.message);
              return throwError(error);
            })
          );
        })
      )
      .subscribe(
        ([drivers, company, vehicles, terminals, elds]) => {
          console.log('Drivers:', JSON.stringify(drivers));
          console.log('Company:', JSON.stringify(company));
          console.log('Vehicles:', JSON.stringify(vehicles));
          console.log('Terminals:', JSON.stringify(terminals));
          console.log('ELDs:', JSON.stringify(elds));

          // Здесь вы можете записать полученные данные в локальную базу данных
          // Например, используя сервис для работы с базой данных
          // databaseService.saveDrivers(drivers);
          // databaseService.saveCompany(company);
          // и т.д.

          this.route.navigate(['/select-vehicle']);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
