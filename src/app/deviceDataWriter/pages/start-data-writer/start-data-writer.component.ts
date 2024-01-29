import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'device-data-writer-start-data-writer',
  templateUrl: './start-data-writer.component.html',
  styleUrls: ['./start-data-writer.component.css']
})
export class StartDataWriterComponent implements OnInit {

  constructor() { }
  startValue=1;


  ngOnInit(): void {
  }
  onChangeStart(radioChange: MatRadioChange) {
    if(radioChange.value==2){
      this.startValue=2
    }
    else{
      this.startValue=1
    }
   } 
   

}
