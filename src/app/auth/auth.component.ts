import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error: string = '';
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective | undefined;
    private closeSub: Subscription | undefined;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid)
            return;
        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;
        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
            resData => {
                this.isLoading = false;
                console.log(resData);
                this.router.navigate(['/recipes'])
            },
            errorRes => {
                this.error = errorRes;
                this.isLoading = false;
                this.showErrorAlert(errorRes);
            }
        );

        form.reset();
    }

    onHandleError() {
        this.error = '';
    }

    showErrorAlert(message: string) {
        const alertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const viewContainerRef = this.alertHost?.viewContainerRef;
        viewContainerRef?.clear();
        const componentRef = viewContainerRef?.createComponent(alertFactory);

        if (componentRef) {
            componentRef.instance.message = message;
            this.closeSub = componentRef.instance.close.subscribe(
                () => {
                    this.closeSub?.unsubscribe();
                    viewContainerRef?.clear();
                }
            );
        }
        
    }

    ngOnDestroy() {
        if (this.closeSub)
            this.closeSub.unsubscribe();
    }
}