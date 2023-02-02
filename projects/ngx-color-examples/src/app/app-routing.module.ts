import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ApiComponent } from "./views/api/api.component";
import { ChangelogComponent } from "./views/changelog/changelog.component";
import { ExamplesComponent } from "./views/examples/examples.component";
import { OverviewComponent } from "./views/overview/overview.component";

const routes: Routes = [
  {
    path: "overview",
    component: OverviewComponent,
    data: { tabIndex: 1 },
  },
  {
    path: "api",
    component: ApiComponent,
    data: { tabIndex: 2 },
  },
  {
    path: "examples",
    component: ExamplesComponent,
    data: { tabIndex: 3 },
  },
  {
    path: "changelog",
    component: ChangelogComponent,
    data: { tabIndex: 4 },
  },

  { path: "", redirectTo: "overview", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
