import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-palette-example',
  templateUrl: './custom-palette-example.component.html',
  styleUrls: ['./custom-palette-example.component.scss']
})
export class CustomPaletteExampleComponent {

  constructor() { }

  selectedColor:string = "#9C27B0";
  colorToAdd:string = '#EC407A';
  colorPalette:Array<string> = ['#9C27B0','#03A9F4','#B2F35C']

  public addToPalette(){
    this.colorPalette.push(this.colorToAdd);
  }

}
