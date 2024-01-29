import { TestBed } from '@angular/core/testing';

import { DeviceDataWriterService } from './device-data-writer.service';

describe('DeviceDataWriterService', () => {
  let service: DeviceDataWriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceDataWriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
