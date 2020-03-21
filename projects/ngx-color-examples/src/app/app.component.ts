import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http'

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
    public domSanitizer:DomSanitizer,
    public http:HttpClient
  ){

  }


  colors = ['#C0CA33','#42A5F5','#455a64','#c2185b','#ab47bc','#26a69a']

  navbar = false;
  test = `<ngx-colors [colorsAnimationEffect]="'popup'"> </ngx-colors>`;
  versions:Array<any>;
  ngOnInit(){


    
    this.randomBrackground();
    this.updateGradient();
    this.http.get('/assets/changelog.json').subscribe(
        (data:Array<any>) => {
          this.versions = Array.from(data);
          this.versions = this.versions.sort(
            (a,b) => {
              let diff;
              var segmentsA:Array<string> = a.version.split('.')
              var segmentsB:Array<string> = b.version.split('.')
              for (let index = 0; index < segmentsA.length; index++) {
                if(segmentsA[index].includes('x')){
                  return 1;
                }
                diff =  Number.parseInt(segmentsA[index]) - Number.parseInt(segmentsB[index])
                if(diff != 0){
                  return -diff;
                }
              }
            return 0;
            }
          );
        });
  }


  randomBrackground(){
    console.log('asd');
    let index = this.randomInt(0,this.colors.length - 1);
    this.leftColor = this.colors[index];
    this.colors.splice(index,1);
    index = this.randomInt(0,this.colors.length - 1);
    this.rightColor = this.colors[index];
  }

  randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }

  updateGradient(){
    this.gradient = this.domSanitizer.bypassSecurityTrustStyle('linear-gradient(45deg, ' + this.leftColor + ' 0%,' + this.rightColor + ' 100%)');
  }

}
