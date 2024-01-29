export class Gateway {
    id: any;
    businessEntityId: number;
    name: string;
    created_by: string;
    createdOn: any;
    updated_by: number;
    gatewayModelId: number
    gatewayTypeId: number;
    timeZoneId: string;
    dataProtocolId: number;
    status: string;
}
export class ContinuousForm{
    Id: number;
      startDate: string;
      endDate: string;
      startTime: string
      endTime: string
  }

  export class ReportTagData{
    ReadingDate :string
    DateAndTime : string
  }

  export class InstanceDateTimeForm{
    Id: number;
      startDate: string;
      endDate: string;
      startTime: string
      endTime: string
  }

