import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-hide-elements-example",
  templateUrl: "./hide-elements-example.component.html",
  styleUrls: ["./hide-elements-example.component.scss"],
})
export class HideElementsExampleComponent {
  constructor() {}

  colorPickerControls: "default" | "only-alpha" | "no-alpha" = "default";
  hideColorPicker: boolean = true;
  hideTextInput: boolean = true;
  color: string = "#EC407A";
}
