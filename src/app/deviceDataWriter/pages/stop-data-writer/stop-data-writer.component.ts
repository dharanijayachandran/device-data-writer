import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'device-data-writer-stop-data-writer',
  templateUrl: './stop-data-writer.component.html',
  styleUrls: ['./stop-data-writer.component.css']
})
export class StopDataWriterComponent implements OnInit {

  stopValue=1;

  ngOnInit(): void {
  }
  
  
   onChangeStop(radioChange: MatRadioChange) {
    if(radioChange.value==2){
      this.stopValue=2
    }
    else{
      this.stopValue=1
    }
   } 
}
