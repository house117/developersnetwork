import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "dashboard",
		loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardPageModule)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MemberRoutingModule {}
