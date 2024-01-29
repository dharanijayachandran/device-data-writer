import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceDataWriterViewComponent } from './deviceDataWriter/pages/device-data-writer-view/device-data-writer-view.component';
import { DeviceDataWriterComponent } from './deviceDataWriter/pages/device-data-writer/device-data-writer.component';
import { APP_BASE_HREF } from '@angular/common';


const routes: Routes = [
  {
    path:'',
    component:DeviceDataWriterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/deviceDataWriter' },
  ],
})
export class AppRoutingModule { }
export const deviceDataWriterDeclaration=[
  DeviceDataWriterComponent,
  DeviceDataWriterViewComponent
]
