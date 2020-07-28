import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {

  constructor(
    private http:HttpClient
  ) { }

  @Input() documents;

  ngOnInit(): void {
    for (let i = 0; i < this.documents.length; i++) {
      this.http.get(this.documents[i].file,{responseType: 'text'}).subscribe(
        data => {
          this.documents[i]["content"] = data;
          console.log(data);
        });
      // this.documents[i]["content"] = readFileSync(this.documents[i].file, 'utf-8');
    }
  }

}
