import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { DeviceDataWriterService } from '../../services/device-data-writer.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'device-data-writer-stop-gateway',
  templateUrl: './stop-gateway.component.html',
  styleUrls: ['./stop-gateway.component.css']
})
export class StopGatewayComponent implements OnInit {


  stopGatewayForm: FormGroup;
  settings = {};
  @ViewChild(UIModalNotificationPage) modelNotification;
  gatewaysList: any[];

  communicationProtocolList: any[];
  dataHandlerList: any[];
  commProtocolMap=new Map();


  public gatewayFields: Object = {
    text: 'name',
    value: 'id'
  };
  public dataHandlerFields: Object = {
    text: 'name',
    value: 'id'
  };
 // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGateway: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewaysList);
  }
  public onFilteringDataHandler: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataHandlerList);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown:string ='Ascending';
  gatewayId:any;
  gateWayTemplateId:any;
  dataHandlerId:any;
  // set the placeholder to DropDownList input element

  public gatewayWaterMark: string = 'Select Gateway';
  public dataHandlerWaterMark: string = 'Select Data Handler';
  public gatewayTemplateWaterMark: string = 'Select Gateway Template';
  public filterPlaceholder:string='Search';
 // set the height of the popup element
 public height: string = '220px';
 public locale: string;

 showLoaderImage:boolean;
  constructor(private formBuilder: FormBuilder, private deviceDataWriterService: DeviceDataWriterService, private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.getCommProtocol();
    this.registerForm();
    this.loadGateway();

  }
  /**
   * It will Intialize the formBuilder
   */
  registerForm() {
    this.stopGatewayForm = this.formBuilder.group({
      gatewayId: [null, Validators.required],
      communicationProtocolId: [null, [Validators.required]],
      dataHandlerId: [null, [Validators.required]],

      // timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    this.settings = {
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      badgeShowLimit: 0,
      text: $localize`:@@multiSelectDropdown.select:--Select--`,
      noDataLabel: $localize`:@@multiSelectDropdown.noDataLabel:No Data Available`
    };
  }

  /**
   * It will Load Gateways based on the Business entity id
   */
  loadGateway() {
    let beId = sessionStorage.getItem('beId');
    this.deviceDataWriterService.loadGateways(beId).subscribe(res => {
      this.gatewaysList = res;
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  /**
   * It will call when we select Gateway in the Dropdown
   * @param event
   */
  gateWayChange($event) {
    let gateWayId = $event.target.value;
    this.deviceDataWriterService.getCommProtocolsByGatewayId(gateWayId).subscribe(res => {
      this.communicationProtocolList = res;
      this.communicationProtocolList.forEach(obj => {
        if (obj.commProtocol == null || obj.commProtocol == undefined) {
          if (this.commProtocolMap.has(obj.commProtocolId)) {
            obj.commProtocol = this.commProtocolMap.get(obj.commProtocolId);
          }
        }
      })
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );

  }

  /**
   * It will call when select Comm protocol in the dropdown
   * @param event
   */
  commProtocolChange(event: any) {
    let commId = event.target.value;
    for (let comm of this.communicationProtocolList) {
      if (commId == comm.id) {
        this.getDataHandler(commId)

      }
    }
  }

  /**
   * It will load the Data handlers Based on the Comm Id
   * @param id
   */
  getDataHandler(id: any) {
    this.deviceDataWriterService.getDataHandler(id).subscribe(res => {
      let filterdResponse = [];

      res.forEach(element => {
        if (element.status === "Active") {
          filterdResponse.push(element);
        }
      });
      this.dataHandlerList = filterdResponse;

    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );

  }


  /**
   * It will Reset the form
   */
  resetForm() {
    this.stopGatewayForm.reset();
    this.registerForm();
    this.loadGateway();
  }

  /**
   * It will send the Form Data to controller
   */
  sendForm() {
    this.showLoaderImage=true;
    let dataWriter = this.stopGatewayForm.value;
    this.deviceDataWriterService.stopGatewayDataWriter(dataWriter).subscribe(res => {
      this.showLoaderImage=false;
      this.modelNotification.alertMessage('Success', 'Device Data Writer stopped successfully');
      this.resetForm();
    },
      (error: any) => {
        this.showLoaderImage=false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        this.resetForm();

      }
    );

  }
  getCommProtocol() {
    this.deviceDataWriterService.getAllCommProtocol().subscribe(res => {
      res.forEach(obj => {
        this.commProtocolMap.set(obj.id, obj);
      });

    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );

  }

}
