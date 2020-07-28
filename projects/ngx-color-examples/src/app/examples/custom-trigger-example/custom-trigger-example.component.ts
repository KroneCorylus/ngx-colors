import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-trigger-example',
  templateUrl: './custom-trigger-example.component.html',
  styleUrls: ['./custom-trigger-example.component.scss']
})
export class CustomTriggerExampleComponent{

  constructor() { }

  selectedColor:string = '#c32af3';

}
