import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ShareModue } from "../shared/share.module";
import { AuthComponent } from "./auth.component";

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {path: '', component: AuthComponent}
        ]),
        ShareModue
    ]
})
export class AuthModule {}