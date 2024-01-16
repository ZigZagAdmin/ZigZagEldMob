import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogCertifyPage } from './log-certify.page';

describe('LogCertifyPage', () => {
  let component: LogCertifyPage;
  let fixture: ComponentFixture<LogCertifyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogCertifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
