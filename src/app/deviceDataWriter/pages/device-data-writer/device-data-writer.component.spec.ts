import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDataWriterComponent } from './device-data-writer.component';

describe('DeviceDataWriterComponent', () => {
  let component: DeviceDataWriterComponent;
  let fixture: ComponentFixture<DeviceDataWriterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDataWriterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDataWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
