import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-onModelChange-example",
  templateUrl: "./onModelChange-example.component.html",
  styleUrls: ["./onModelChange-example.style.scss"],
})
export class onModelChangeComponent {
  constructor() {}

  style = {
    color: "black",
    "background-color": "#0070f3",
    width: "30px",
    height: "30px",
  };

  bColor = "#0070f3";
  fColor = "#000000";

  onChangeBackground(event) {
    console.log("onChangeBackground", event);
    this.style["background-color"] = event;
  }

  onChangeFontColor(event) {
    console.log("onChangeFontColor", event);
    this.style.color = event;
  }
}
