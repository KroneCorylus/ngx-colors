import { animate, style, transition, trigger } from "@angular/animations";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-detect-change-example",
  templateUrl: "./detect-change-example.component.html",
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ background: "red" }),
        animate("1s ease-out", style({})),
      ]),
    ]),
  ],
  styleUrls: ["./detect-change-example.style.scss"],
})
export class DetectChangeExampleComponent {
  constructor() {}

  color = "#0070f3";
  colorIndex = 0;
  colors = ["#0070f3", "#00796B", "#D81B60", "#7986CB"];

  logs: Array<Array<any>> = [];

  public rotateColor(): void {
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    this.color = this.colors[this.colorIndex];
  }

  public logEvent(event, trigger) {
    this.logs.unshift([this.logs.length + 1, trigger, event]);
  }
}
