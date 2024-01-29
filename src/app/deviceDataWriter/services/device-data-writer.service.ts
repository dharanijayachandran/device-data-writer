import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeviceDataWriter } from '../model/deviceDataWriter';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DeviceDataWriterService {
  gateWayApiurl = environment.baseUrl_gatewayManagement;
  deviceDataWriterApiUrl = environment.baseUrl_deviceDataWriter;
  constructor(private http: HttpClient) { }


  getGateWayTemplate(beId) {
    return this.http.get<any[]>(this.gateWayApiurl + 'gatewayTemplatesByBusinessEntityId/' + beId

    )
  }
  getGateWays(gatewayTemplateId) {
    let organizationId = sessionStorage.getItem("beId");
    return this.http.get<any[]>(this.deviceDataWriterApiUrl + 'organization/' + organizationId + '/gateways?gateway-template-id=' + gatewayTemplateId)
  }

  getDataHandler(commProtocolId) {
    return this.http.get<any[]>(this.deviceDataWriterApiUrl + 'getDataHandlerByCommonProtocolId/' + commProtocolId)

  }

  getAllDHTags(iOdHId) {
    return this.http.get<any[]>(this.deviceDataWriterApiUrl + 'getAllIODHTagByIODHId/' + iOdHId)

  }
  getDataTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.gateWayApiurl + 'getDataTypes');
  }

  getAllDHTagsByGateWayTemplateId(gateWayTemplateId) {
    return this.http.get<any[]>(this.deviceDataWriterApiUrl + 'getAllGatewayIOTagByGatewayId/' + gateWayTemplateId)

  }

  sendDeviceDataWriterForm(deviceDataWriter: DeviceDataWriter): Observable<DeviceDataWriter> {
    return this.http.post<DeviceDataWriter>(`${this.deviceDataWriterApiUrl + 'saveDeviceData'}`, deviceDataWriter, httpOptions);
  }
  stopDeviceDataWriter(deviceDataWriter: any): Observable<any> {
    return this.http.post<any>(`${this.deviceDataWriterApiUrl + 'stopDeviceData'}`, deviceDataWriter, httpOptions);
  }
  loadGateways(organizationId) {
    return this.http.get<any[]>(this.deviceDataWriterApiUrl + 'organization/' + organizationId + '/gateways')
  }
  sendStartGatewayData(deviceDataWriter: any): Observable<any> {
    return this.http.post<any>(`${this.deviceDataWriterApiUrl + 'sendGatewayData'}`, deviceDataWriter, httpOptions);
  }
  stopGatewayDataWriter(gatewayDataWriter: any): Observable<any> {
    return this.http.post<any>(`${this.deviceDataWriterApiUrl + 'stopGatewayData'}`, gatewayDataWriter, httpOptions);
  }
  getAllCommProtocol(): Observable<any[]> {
    return this.http.get<any[]>(this.gateWayApiurl + 'getAllProtocol');
  }

  getCommProtocolsByGatewayId(gatewayId): Observable<any[]> {
    return this.http.get<any[]>(this.deviceDataWriterApiUrl + 'gateway-CommProtocols/' + gatewayId);
  }
}
