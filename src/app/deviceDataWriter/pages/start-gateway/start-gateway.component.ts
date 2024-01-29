import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { DeviceDataWriterService } from '../../services/device-data-writer.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

interface Unit {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'device-data-writer-start-gateway',
  templateUrl: './start-gateway.component.html',
  styleUrls: ['./start-gateway.component.css']
})

export class StartGatewayComponent implements OnInit {
  gatewayForm: FormGroup;
  settings = {};
  gatewaysList: any[];
  @ViewChild(UIModalNotificationPage) modelNotification;
  communicationProtocolList: any[];
  dataHandlerList: any[];
  isChecked: boolean;
  myCheckBox = false;
  showLoaderImage:boolean;
  units: Unit[] = [
    { value: 'Seconds', viewValue: 'Seconds' },
    { value: 'Minutes', viewValue: 'Minutes' },
    { value: 'Hours', viewValue: 'Hours' }
  ];
  childDataHandlerTagsList: any[];
  dataHandlerTagsList: any[];
  isSelected: boolean;
  dataTypes: any[];
  framedDataEnable = true;
  enableTags: boolean;
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
  public filterPlaceholder:string='Search';
 // set the height of the popup element
 public height: string = '220px';
 public locale: string;

  constructor(private formBuilder: FormBuilder, private deviceDataWriterService: DeviceDataWriterService, private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.getCommProtocol()
    this.registerForm();
    this.getDataTypes();
    this.loadGateways();
  }
  /**
   * FormBuilder
   */
  registerForm() {
    this.gatewayForm = this.formBuilder.group({
      gatewayId: [null, Validators.required],
      communicationProtocolId: [null, [Validators.required]],
      dataHandlerId: [null, [Validators.required]],
      dhTags: this.formBuilder.array([]),
      interval: [null],
      timeUnit: [null],
      framedData: [null, [Validators.required]],
      isFramed: ['Yes'],
      check: false

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
   * This method will get DataTypes
   */
  getDataTypes(): void {
    this.deviceDataWriterService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  /**
   * This methos will load gateways based on the business entity id
   */
  loadGateways() {
    let beId = sessionStorage.getItem('beId');
    this.deviceDataWriterService.loadGateways(beId).subscribe(res => {
      this.gatewaysList = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  /**
   * This,method will call when we change the Gateway in the dropdown
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
    /* for (let gateWay of this.gatewaysList) {
      if (gateWayId == gateWay.id) {
        this.communicationProtocolList = gateWay.gatewayCommProtocols;
      }
    }
    this.communicationProtocolList.forEach(obj => {
      if (obj.commProtocol == null || obj.commProtocol == undefined) {
        if (this.commProtocolMap.has(obj.commProtocolId)) {
          obj.commProtocol = this.commProtocolMap.get(obj.commProtocolId);
        }
      }
    }) */

  }
  /**
   * This method will call when we change Communication protocol
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
   * It will load Data handler whose operation mode is write based on Communication protocol id.
   *
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
   * This method will call when change data handler
   * it will load DH tags based on the DH id
   * @param event
   */
  dHChange($event) {
    if (this.enableTags == true) {
      let dhId = $event.target.value;
      for (let dh of this.dataHandlerList) {
        if (dhId == dh.id) {
          // this.deviceDataWriterForm.controls['dhCode'].setValue(dh.dhCode);
          this.getDhTags(dhId)
        }
      }
    }


  }

  /**
   * Load DH Tags Based on the DH id
   * @param dhId
   */
  getDhTags(dhId: any) {
    this.deviceDataWriterService.getAllDHTags(dhId).subscribe(res => {
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
      const control = <FormArray>this.gatewayForm.controls['dhTags'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i)
      }
      if (this.dataHandlerTagsList != null) {
        this.gatewayForm.setControl('dhTags', this.patchFormArray());
        this.isSelected = true;
      }
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );

  }
  /**
   * It will validate the Data type entered in UI
   * @param dhTag
   * @returns
   */
  checkDataTypeName(dhTag) {
    if (dhTag.hasOwnProperty("dataTypeName"))
      return this.globalService.getPatternForCommunication(dhTag.dataTypeName);

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
  /**
   * It will  show the  text box and dropdown based on the checkbox selection
   */
  enableTextBox() {
    if (this.isChecked == true) {
      this.isChecked = false;
      this.gatewayForm.controls['interval'].reset();
      this.gatewayForm.controls['interval'].reset();
      this.gatewayForm.controls["timeUnit"].setValidators(null);
      this.gatewayForm.get('timeUnit').updateValueAndValidity();
      this.gatewayForm.controls["interval"].setValidators(null);
      this.gatewayForm.get('interval').updateValueAndValidity();

    }
    else {
      this.isChecked = true;
      this.gatewayForm.controls["interval"].setValidators([Validators.required, Validators.pattern("^[1-9][0-9]*$")]);
      this.gatewayForm.controls["timeUnit"].setValidators(Validators.required);
    }
  }

  /**
   * It will call when change the radio button button
   * @param radioChange
   */
  onChangeRadioInGateway(radioChange: any) {
    if (radioChange.value == 'No') {
      this.resetForm();
      this.gatewayForm.controls["isFramed"].setValue('No')
      this.enableTags = true;
      this.framedDataEnable = false;
      this.gatewayForm.controls['framedData'].reset();
      this.gatewayForm.controls["framedData"].setValidators(null);
      this.gatewayForm.get('framedData').updateValueAndValidity();
    }
    else {
      this.resetForm();
      this.enableTags = false;
      this.framedDataEnable = true;
      this.gatewayForm.controls["framedData"].setValidators(Validators.required);


    }

  }

  /**
   * It will Reset the form
   */
  resetForm() {
    this.gatewaysList = [];
    this.communicationProtocolList = [];
    this.dataHandlerList = [];
    this.dataHandlerTagsList = [];
    this.registerForm();
    this.getDataTypes();
    this.loadGateways();
    this.gatewayForm.controls["framedData"].setValidators(Validators.required);
    this.myCheckBox = false;
    this.isChecked = false;
    this.framedDataEnable = true;
    this.enableTags = false;

  }

  /**
   * It will Send form Data to Controller
   */
  sendForm() {
    this.showLoaderImage=true;
    let startGatewayWriter = <any>this.gatewayForm.value;
    this.deviceDataWriterService.sendStartGatewayData(startGatewayWriter).subscribe(res => {
      this.showLoaderImage=false;
      this.modelNotification.alertMessage('Success', 'Device Data Writer activated successfully');
      this.resetForm();
      this.framedDataEnable = true;
      this.enableTags = false;
      this.isChecked = false
      this.gatewayForm.controls["framedData"].setValidators(Validators.required);
    },
      (error: any) => {
        this.showLoaderImage=false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        this.resetForm();
        this.framedDataEnable = true;
        this.enableTags = false;
        this.isChecked = false
        this.gatewayForm.controls["framedData"].setValidators(Validators.required);

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
