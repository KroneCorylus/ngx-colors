import { Component } from "@angular/core";
import { api } from "../../const/api";
import { snippets } from "../../const/snippets";

@Component({
  selector: "app-api-example",
  templateUrl: "./api.component.html",
  styleUrls: ["./api.component.scss"],
})
export class ApiComponent {
  constructor() {}
  api = api;
  snippets = snippets;
}
