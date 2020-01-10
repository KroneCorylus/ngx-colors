import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit {
  title = 'ngx-color-examples';
  rightColor = '#42A5F5';
  leftColor = '#C0CA33';
  gradient;



  constructor(
    public domSanitizer:DomSanitizer
  ){

  }

  navbar = false;
  test = `<ngx-colors [colorsAnimationEffect]="'popup'"> </ngx-colors>`;

  ngOnInit(){
    this.updateGradient();
  }



  updateGradient(){
    this.gradient = this.domSanitizer.bypassSecurityTrustStyle('linear-gradient(45deg, ' + this.leftColor + ' 0%,' + this.rightColor + ' 100%)');
  }

}
