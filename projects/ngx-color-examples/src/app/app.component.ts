import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  APP_ID,
  AfterViewInit,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { examples } from "./const/examples";
import { snippets } from "./const/snippets";
import { api } from "./const/api";
import {
  UntypedFormGroup,
  UntypedFormControl,
  FormControl,
} from "@angular/forms";
import { NgxColorsColor } from "projects/ngx-colors/src/public-api";
import { validColorValidator } from "projects/ngx-colors/src/public-api";
import {
  ChildrenOutletContexts,
  Router,
  RoutesRecognized,
} from "@angular/router";
import { slideInAnimation } from "./const/router.animations";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  title = "ngx-color-examples";
  rightColor = "#42A5F5";
  leftColor = "#C0CA33";
  gradient;

  @ViewChild("tabmenu") menuView: ElementRef;

  constructor(
    public domSanitizer: DomSanitizer,
    public http: HttpClient,
    private contexts: ChildrenOutletContexts,
    private router: Router
  ) {}

  getRouteAnimationData() {
    return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
      "tabIndex"
    ];
  }

  links = [
    { text: "OVERVIEW", url: "/overview" },
    { text: "API", url: "/api" },
    { text: "EXAMPLES", url: "/examples" },
    { text: "CHANGELOG", url: "/changelog" },
  ];
  activeLink = undefined;

  testForm = new UntypedFormGroup({
    testCtrl: new UntypedFormControl(""),
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
  colorFormControl = new UntypedFormControl("#c2185b");

  navbar = false;
  versions: Array<any>;

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.activeLink = event.url;
      }
    });
    this.randomBrackground();
    this.updateGradient();
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

  log(event) {
    console.log(event);
  }
}
