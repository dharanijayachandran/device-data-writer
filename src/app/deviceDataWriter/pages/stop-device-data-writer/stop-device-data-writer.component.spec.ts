import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopDeviceDataWriterComponent } from './stop-device-data-writer.component';

describe('StopDeviceDataWriterComponent', () => {
  let component: StopDeviceDataWriterComponent;
  let fixture: ComponentFixture<StopDeviceDataWriterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopDeviceDataWriterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopDeviceDataWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
