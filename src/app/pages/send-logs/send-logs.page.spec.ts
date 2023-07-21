import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendLogsPage } from './send-logs.page';

describe('SendLogsPage', () => {
  let component: SendLogsPage;
  let fixture: ComponentFixture<SendLogsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SendLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
