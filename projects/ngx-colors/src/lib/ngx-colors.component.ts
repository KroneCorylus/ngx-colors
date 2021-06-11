import { Component, ViewEncapsulation, Host, OnInit } from '@angular/core';
import { NgxColorsTriggerDirective } from './directives/ngx-colors-trigger.directive';

@Component({
  selector: 'ngx-colors',
  templateUrl: './ngx-colors.component.html',
  styleUrls: ['./ngx-colors.component.scss'],
})
export class NgxColorsComponent implements OnInit{

  constructor(
    @Host() private triggerDirective: NgxColorsTriggerDirective,
  )
  {
  }

  // @ViewChild(NgxColorsTriggerDirective) triggerDirective;
  ngOnInit(): void {
    this.triggerDirective.change.subscribe(
      color => {this.color = color;}
    );
  }
  //IO color
  color: string = this.triggerDirective.color;
}
