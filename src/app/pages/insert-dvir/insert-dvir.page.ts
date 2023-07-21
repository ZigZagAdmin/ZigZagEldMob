import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/models/company';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-insert-dvir',
  templateUrl: './insert-dvir.page.html',
  styleUrls: ['./insert-dvir.page.scss'],
})
export class InsertDvirPage implements OnInit {
  company: Company | undefined;
  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.databaseService.isDatabaseReady().subscribe((ready: boolean) => {
      if (ready) {
        this.databaseService.getCompany().subscribe((company) => {
          this.company = company;
          console.log(this.company);
        });
      }
    });
  }
}
