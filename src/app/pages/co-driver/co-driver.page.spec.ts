import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoDriverPage } from './co-driver.page';

describe('CoDriverPage', () => {
  let component: CoDriverPage;
  let fixture: ComponentFixture<CoDriverPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CoDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
