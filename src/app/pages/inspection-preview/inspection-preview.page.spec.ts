import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspectionPreviewPage } from './inspection-preview.page';

describe('InspectionPreviewPage', () => {
  let component: InspectionPreviewPage;
  let fixture: ComponentFixture<InspectionPreviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InspectionPreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
