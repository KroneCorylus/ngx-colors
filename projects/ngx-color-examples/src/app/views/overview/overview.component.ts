import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { examples } from "../../const/examples";
import { snippets } from "../../const/snippets";

@Component({
  selector: "app-overview-example",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent {
  constructor() {}
  snippets = snippets;
  examples = examples;
  color = "#42A5F5";
  colorFormControl = new FormControl<string>("#c2185b");

  public updateGradient() {
    console.log("updateGradient");
  }
}
