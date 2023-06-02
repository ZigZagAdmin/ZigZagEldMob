import { Component, OnInit } from '@angular/core';
import { AuthUser } from 'src/app/models/auth-user';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private route: Router) {}

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
    this.authService.login(username, password).subscribe(
      (res) => {
        this.authUser = res;
        console.log(JSON.stringify(res));
        this.route.navigate(['/select-vehicle']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
