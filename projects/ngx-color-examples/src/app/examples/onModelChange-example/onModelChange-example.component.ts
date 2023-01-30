import { animate, style, transition, trigger } from "@angular/animations";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-onModelChange-example",
  templateUrl: "./onModelChange-example.component.html",
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ background: "red" }),
        animate("1s ease-out", style({})),
      ]),
    ]),
  ],
  styleUrls: ["./onModelChange-example.style.scss"],
})
export class onModelChangeComponent {
  constructor() {}

  color = "#0070f3";
  colorIndex = 0;
  colors = ["#0070f3", "#00796B", "#D81B60", "#7986CB"];

  logs = [];

  public rotateColor(): void {
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    this.color = this.colors[this.colorIndex];
  }

  public eventAlert(event, trigger) {
    this.logs.unshift([this.logs.length + 1, trigger, event]);
  }
}
