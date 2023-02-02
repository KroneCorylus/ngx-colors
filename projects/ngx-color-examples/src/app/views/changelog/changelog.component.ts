import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-changelog-example",
  templateUrl: "./changelog.component.html",
  styleUrls: ["./changelog.component.scss"],
})
export class ChangelogComponent implements OnInit {
  constructor(private http: HttpClient) {}
  versions: Array<any>;
  ngOnInit() {
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
}
