import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { DeviceDataWriter } from '../../model/deviceDataWriter';
import { GateWayTemplate } from '../../model/gate-way-template';
import { DeviceDataWriterService } from '../../services/device-data-writer.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

interface Unit {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-device-data-writer-view',
  templateUrl: './device-data-writer-view.component.html',
  styleUrls: ['./device-data-writer-view.component.css']
})


export class DeviceDataWriterViewComponent implements OnInit, OnDestroy {
  deviceDataWriterForm: FormGroup;
  @ViewChild(UIModalNotificationPage) modelNotification;
  gatewayTemplateList: GateWayTemplate[];
  gateWayList: any[];
  communicationProtocolList: any[];
  dataHandlerList: any[];
  dataHandlerForMultiSelect: any[];
  isSelected = false;
  showLoaderImage: boolean;
  dataHandlerTagsList: any[];
  private deviceDataWriter: DeviceDataWriter = new DeviceDataWriter();
  settings = {};
  selecteDataHandlerItems: any[] = [];
  //enableViewButton: boolean = true;
  dataHandlerIds: any[] = [];
  dataTypes: any[];
  inter: NodeJS.Timeout;
  dataHandlerTagsListForOperationModeWrite: any[] = [];
  selectedGateWayItems: any[] = [];
  gateWayForMultiSelect: any[] = [];
  childDataHandlerTagsList: any[];
  isChecked: boolean;
  units: Unit[] = [
    { value: 'Seconds', viewValue: 'Seconds' },
    { value: 'Minutes', viewValue: 'Minutes' },
    { value: 'Hours', viewValue: 'Hours' }
  ];
  myCheckBox = false;
  commProtocolMap = new Map();


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
    this.filterData(e, this.gatewayTemplateList);
  }
  public onFilteringDataHandler: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.dataHandlerList);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown: string = 'Ascending';
  gateWayTemplateId: any;
  dataHandlerId: any;
  // set the placeholder to DropDownList input element

  public dataHandlerWaterMark: string = 'Select Data Handler';
  public gatewayTemplateWaterMark: string = 'Select Gateway Template';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '220px';
  public locale: string;


  constructor(private formBuilder: FormBuilder, private deviceDataWriterService: DeviceDataWriterService, private globalService: globalSharedService) { }




  ngOnInit(): void {
    this.getCommProtocol();


    this.registerForm();
    this.getDataTypes();
    this.gatewayTemplates();

  }
  ngOnDestroy(): void {
    clearInterval(this.inter);
  }

  registerForm() {
    this.deviceDataWriterForm = this.formBuilder.group({
      gateWayTemplateId: [null, [Validators.required]],
      gateways: [[], Validators.required],
      communicationProtocolId: [null, [Validators.required]],
      dataHandlerId: [null, [Validators.required]],
      dhCode: [null],
      dhTags: this.formBuilder.array([]),
      interval: [null],
      timeUnit: [null],
      check: false

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
      const control = <FormArray>this.deviceDataWriterForm.controls['dhTags'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i)
      }
      /*  for (let gatewayTemplate of this.gatewayTemplateList) {
         if (gatewayTemplate.id == gateWayTemplateId) {
           this.communicationProtocolList = gatewayTemplate.gatewayCommProtocols;
         }
       }
       this.communicationProtocolList.forEach(obj => {
         if (obj.commProtocol == null || obj.commProtocol == undefined) {
           if (this.commProtocolMap.has(obj.commProtocolId)) {
             obj.commProtocol = this.commProtocolMap.get(obj.commProtocolId);
           }
         }
       }) */
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
  gateWayChange(event: any) {
    let gateWayId = event.target.value;
    this.gateWayList
  }

  commProtocolChange(event: any) {
    let commId = event.target.value;
    this.dataHandlerList = [];
    this.dataHandlerTagsList = [];
    const control = <FormArray>this.deviceDataWriterForm.controls['dhTags'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    for (let comm of this.communicationProtocolList) {
      if (commId == comm.id) {
        this.getDataHandler(commId)

      }
    }
  }

  dHChange($event) {
    let dhId = $event.target.value;
    for (let dh of this.dataHandlerList) {
      if (dhId == dh.id) {
        this.deviceDataWriterForm.controls['dhCode'].setValue(dh.dhCode);
        this.getDhTags(dhId)
      }
    }

  }
  getDhTags(dhId: any) {
    this.deviceDataWriterService.getAllDHTags(dhId).subscribe(res => {
      // this.dataHandlerTagsList = res;
      var map = new Map();
      res.forEach(obj => {
        map.set(obj.id, obj);
      });

      this.childDataHandlerTagsList = res.filter(function (obj) {
        return obj.parentNodeIoDhTagId;
      });
      this.childDataHandlerTagsList.forEach(element => {
        if (map.has(element.parentNodeIoDhTagId)) {
          map.delete(element.parentNodeIoDhTagId)
        }
      });

      this.dataHandlerTagsList = Array.from(map.values());
      const control = <FormArray>this.deviceDataWriterForm.controls['dhTags'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i)
      }
      if (this.dataHandlerTagsList != null) {
        this.deviceDataWriterForm.setControl('dhTags', this.patchFormArray());
        //  let dataHandlers=this.dataHandlerTagsList[0]
        //this.deviceDataWriterForm.setValue({dhCode:dataHandlers.nodeIoDh.dhCode})
        //  this.deviceDataWriterForm.controls['dhCode'].setValue(dataHandlers.nodeIoDh.dhCode);
        this.isSelected = true;
      }
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );

  }


  patchFormArray(): FormArray {
    const formArray = new FormArray([]);
    this.dataHandlerTagsList.forEach(dhTag => {
      this.dataTypes.forEach(type => {
        if (type.id == dhTag.nodeIoTag.dataTypeId) {
          dhTag.dataTypeName = type.name;
        }
      })
      formArray.push(this.formBuilder.group({
        id: [null],
        // nodeIoDhId: [null],
        gatewayIoDhTagId: [null],
        gatewayIoTagId: [null],
        value: ['',
          [Validators.required,
          Validators.pattern(this.checkDataTypeName(dhTag))]]
      }))
    })
    return formArray;
  }

  checkDataTypeName(dhTag) {
    if (dhTag.hasOwnProperty("dataTypeName"))
      return this.globalService.getPatternForCommunication(dhTag.dataTypeName);

  }
  getDataTypes(): void {
    this.deviceDataWriterService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
        },
        error => {
          //
          console.log("service not avaialble");

          // this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  public addDhTags(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      value: [null],
      gatewayIoDhTagId: [null],
      gatewayIoTagId: [null]
    })
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
    this.isSelected = true;
    this.dataHandlerTagsList = [];
    this.registerForm();
    this.gatewayTemplates();
    this.getDataTypes();
    this.myCheckBox = false;
    this.isChecked = false


  }
  sendForm() {
    this.showLoaderImage = true;
    this.deviceDataWriter = <DeviceDataWriter>this.deviceDataWriterForm.value;
    this.deviceDataWriterService.sendDeviceDataWriterForm(this.deviceDataWriter).subscribe(res => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage('Success', 'Device Data Writer activated successfully');
      this.redirect();
    },
      (error: any) => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

      }
    );
    // console.log(this.deviceDataWriter);
    //  console.log(JSON.stringify(this.deviceDataWriter));
  }
  redirect() {
    this.deviceDataWriterForm.reset;
    this.registerForm();
    this.dataHandlerList = [];
    this.myCheckBox = false;
    this.isChecked = false
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
  setNullforGateways() {
    if (this.selectedGateWayItems.length == 0) {
      this.deviceDataWriterForm.controls['gateways'].setValue([]);

    }
  }

  enableTextBox() {
    if (this.isChecked == true) {
      this.isChecked = false;
      this.deviceDataWriterForm.controls['interval'].reset();
      this.deviceDataWriterForm.controls['interval'].reset();
      this.deviceDataWriterForm.controls["timeUnit"].setValidators(null);
      this.deviceDataWriterForm.get('timeUnit').updateValueAndValidity();
      this.deviceDataWriterForm.controls["interval"].setValidators(null);
      this.deviceDataWriterForm.get('interval').updateValueAndValidity();

    }
    else {
      this.isChecked = true;
      this.deviceDataWriterForm.controls["interval"].setValidators([Validators.required, Validators.pattern("^[1-9][0-9]*$")]);
      this.deviceDataWriterForm.controls["timeUnit"].setValidators(Validators.required);
    }
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
