import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { GateWayTemplate } from '../../model/gate-way-template';
import { DeviceDataWriterService } from '../../services/device-data-writer.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'app-stop-device-data-writer',
  templateUrl: './stop-device-data-writer.component.html',
  styleUrls: ['./stop-device-data-writer.component.css']
})
export class StopDeviceDataWriterComponent implements OnInit {

  stopDataWriterForm: FormGroup;
  settings = {};
  gatewayTemplateList: GateWayTemplate[];
  @ViewChild(UIModalNotificationPage) modelNotification;
  gateWayList: any[];
  communicationProtocolList: any[];
  dataHandlerList: any[];
  dataHandlerForMultiSelect: any[];
  dataHandlerTagsList: any[];
  selectedGateWayItems: any[] = [];
  gateWayForMultiSelect: any[] = [];
  commProtocolMap=new Map();

  public gatewayTemplateFields: Object = {
    text: 'name',
    value: 'id'
  };
  public dataHandlerFields: Object = {
    text: 'name',
    value: 'id'
  };
 // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGatewayTemplates: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewayTemplateList);
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
  gateWayTemplateId:any;
  dhCode:any;
  // set the placeholder to DropDownList input element
  showLoaderImage:boolean;


  public dataHandlerWaterMark: string = 'SelectGateway Template DH';
  public gatewayTemplateWaterMark: string = 'Select Gateway Template';
  public filterPlaceholder:string='Search';
 // set the height of the popup element
 public height: string = '220px';
 public locale: string;

  constructor(private formBuilder: FormBuilder, private deviceDataWriterService: DeviceDataWriterService, private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.getCommProtocol();
    this.registerForm();
    this.gatewayTemplates();

  }
  registerForm() {
    this.stopDataWriterForm = this.formBuilder.group({
      gateWayTemplateId: [null, [Validators.required]],
      gateways: [[], Validators.required],
      communicationProtocolId: [null, [Validators.required]],
      dhCode: [null, [Validators.required]]

      // timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    this.settings = {
      enableSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      badgeShowLimit: 0,
      text: $localize`:@@multiSelectDropdown.select:--Select--`,
      noDataLabel: $localize`:@@multiSelectDropdown.noDataLabel:No Data Available`
    };
  }
  gatewayTemplates() {
    let beId = sessionStorage.getItem('beId');
    this.deviceDataWriterService.getGateWayTemplate(beId).subscribe(res => {
      this.gatewayTemplateList = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  gateWayTemplateChange(gateWayTemplateId) {
    if (isNaN(gateWayTemplateId)) {
      this.communicationProtocolList = [];

    } else {
      this.communicationProtocolList = [];
      this.gateWayList = [];
      this.dataHandlerList = [];
      this.dataHandlerTagsList = [];
      const control = <FormArray>this.stopDataWriterForm.controls['dhTags'];
      // for (let i = control.length - 1; i >= 0; i--) {
      //   control.removeAt(i)
      // }
      this.deviceDataWriterService.getCommProtocolsByGatewayId(gateWayTemplateId).subscribe(res => {
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
      this.gatewayTemplateList.forEach(obj => {
        if (obj.id == gateWayTemplateId) {
          this.getGateway(obj.id);
        }
      });
    }
  }
  requiredFormat(items) {
    const that = this;
    return items && items.length ? items.map(function (o) {
      var returnObj = {
        "id": o.id,
        "itemName": o.name
      }
      return returnObj;
    }) : [];
  }
  getDataHandler(id: any) {
    this.deviceDataWriterService.getDataHandler(id).subscribe(res => {
      let filterdResponse = [];

      res.forEach(element => {
        if (element.status === "Active") {
          filterdResponse.push(element);
        }
      });
      this.dataHandlerList = filterdResponse;
      this.dataHandlerForMultiSelect = this.requiredFormat(filterdResponse);

    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );

  }
  commProtocolChange(event: any) {
    let commId = event.target.value;
    this.dataHandlerList = [];
    this.dataHandlerTagsList = [];
    const control = <FormArray>this.stopDataWriterForm.controls['dhTags'];
    // for (let i = control.length - 1; i >= 0; i--) {
    //   control.removeAt(i)
    // }
    for (let comm of this.communicationProtocolList) {
      if (commId == comm.id) {
        this.getDataHandler(commId)

      }
    }
  }

  OnselectedGateWayItems(item: any) {
    this.selectedGateWayItems.push(item);
  }

  OnItemDeSelectGateWay(item: any) {
    this.selectedGateWayItems = this.selectedGateWayItems.filter(obj => obj !== item);
    this.setNullforGateways();

  }
  onSelectAllGateWay(items: any) {
    this.selectedGateWayItems = items;
  }
  onDeSelectAllGateWay(items: any) {
    this.selectedGateWayItems = [];
    this.setNullforGateways();
  }
  setNullforGateways(){
    if(this.selectedGateWayItems.length==0)
    {this.stopDataWriterForm.controls['gateways'].setValue([]);

    }
  }
  getGateway(id: any) {
    this.deviceDataWriterService.getGateWays(id).subscribe(res => {
      this.gateWayList = res;
      this.gateWayForMultiSelect = this.requiredFormat(res);
    },
      (error: any) => {
        // If the service is not available

        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  resetForm() {

    this.gatewayTemplateList = [];

    this.gateWayList = [];

    this.communicationProtocolList = [];
    this.dataHandlerList = [];

    this.dataHandlerTagsList = [];
    this.registerForm();
    this.gatewayTemplates();



  }
  sendForm() {
    this.showLoaderImage=true;
    let dataWriter = this.stopDataWriterForm.value;
    this.deviceDataWriterService.stopDeviceDataWriter(dataWriter).subscribe(res => {
      this.showLoaderImage=false;
      this.modelNotification.alertMessage('Success', 'Device Data Writer stopped successfully');
      this.resetForm();
    },
      (error: any) => {
        this.showLoaderImage=false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

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
