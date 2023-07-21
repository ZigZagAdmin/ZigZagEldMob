import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDvirPage } from './edit-dvir.page';

describe('EditDvirPage', () => {
  let component: EditDvirPage;
  let fixture: ComponentFixture<EditDvirPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditDvirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
