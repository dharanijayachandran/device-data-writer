import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDataWriterViewComponent } from './device-data-writer-view.component';

describe('DeviceDataWriterViewComponent', () => {
  let component: DeviceDataWriterViewComponent;
  let fixture: ComponentFixture<DeviceDataWriterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDataWriterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDataWriterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
