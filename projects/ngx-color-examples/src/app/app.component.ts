import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  APP_ID,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { examples } from "./const/examples";
import { snippets } from "./const/snippets";
import { api } from "./const/api";
import { FormGroup, FormControl } from "@angular/forms";
import { NgxColor } from "projects/ngx-colors/src/public-api";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "ngx-color-examples";
  rightColor = "#42A5F5";
  leftColor = "#C0CA33";
  gradient;

  @ViewChild("tabmenu") menuView: ElementRef;

  constructor(public domSanitizer: DomSanitizer, public http: HttpClient) {}

  testForm = new FormGroup({
    testCtrl: new FormControl(""),
  });

  customPalette = [
    "#C0CA33",
    "#42A5F5",
    "#455a64",
    "#c2185b",
    "#ab47bc",
    "#26a69a",
    "#00acc1",
  ];
  colors = [
    "#C0CA33",
    "#42A5F5",
    "#455a64",
    "#c2185b",
    "#ab47bc",
    "#26a69a",
    "#00acc1",
  ];

  snippets = snippets;
  examples = examples;
  api = api;
  colorFormControl = new FormControl("#c2185b");
  navbar = false;
  versions: Array<any>;

  ngOnInit() {
    this.randomBrackground();
    this.updateGradient();
    this.http.get("/assets/changelog.json").subscribe((data: Array<any>) => {
      this.versions = Array.from(data);
      this.versions = this.versions.sort((a, b) => {
        let diff;
        var segmentsA: Array<string> = a.version.split(".");
        var segmentsB: Array<string> = b.version.split(".");
        for (let index = 0; index < segmentsA.length; index++) {
          if (segmentsA[index].includes("x")) {
            return 1;
          }
          diff =
            Number.parseInt(segmentsA[index]) -
            Number.parseInt(segmentsB[index]);
          if (diff != 0) {
            return -diff;
          }
        }
        return 0;
      });
    });
  }

  randomBrackground() {
    let index = this.randomInt(0, this.colors.length - 1);
    this.leftColor = this.colors[index];
    this.colors.splice(index, 1);
    index = this.randomInt(0, this.colors.length - 1);
    this.rightColor = this.colors[index];
  }

  randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }

  updateGradient() {
    this.gradient = this.domSanitizer.bypassSecurityTrustStyle(
      "linear-gradient(45deg, " +
        this.leftColor +
        " 0%," +
        this.rightColor +
        " 100%)"
    );
  }

  scrollIntoView() {
    this.menuView.nativeElement.scrollIntoView({ behavior: "smooth" });
  }
}
