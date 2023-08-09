import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogItemPage } from './log-item.page';

describe('LogItemPage', () => {
  let component: LogItemPage;
  let fixture: ComponentFixture<LogItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
