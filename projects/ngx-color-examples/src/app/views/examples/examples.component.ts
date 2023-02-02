import { Component } from "@angular/core";
import { examples } from "../../const/examples";

@Component({
  selector: "app-examples-example",
  templateUrl: "./examples.component.html",
  styleUrls: ["./examples.component.scss"],
})
export class ExamplesComponent {
  constructor() {}
  examples = examples;
}
