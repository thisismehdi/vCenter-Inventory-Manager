import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MsalService} from "@azure/msal-angular";
import {AuthenticationResult, InteractionType, PublicClientApplication} from "@azure/msal-browser";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //isLoggedIn: boolean = false;
  private pca: PublicClientApplication;
  constructor(private route: ActivatedRoute,private authService: MsalService,private router : Router) {
    this.pca = this.authService.instance as PublicClientApplication;
  }

  login() {
    //this.authService.loginRedirect();
    this.authService.initialize().subscribe(() => {
      this.pca.handleRedirectPromise(InteractionType.Popup)
        .then(() => {
          this.authService.loginPopup()
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
              this.router.navigate(['/']);
            });
        });
    });
  }
  /*login() {
    this.authService.initialize().subscribe(() => {
      // Check if there is an interaction in progress
      if (this.pca.getAllAccounts().length > 0) {
        // If there are active accounts, navigate to home page
        this.router.navigate(['/']);
      } else {
        // If no active accounts, handle redirect promise
        this.pca.handleRedirectPromise().then(() => {
          // Check if user is logged in after handling redirect promise
          if (this.pca.getAllAccounts().length > 0) {
            // User is logged in, navigate to home page
            this.router.navigate(['/']);
          } else {
            // If user is not logged in, initiate login redirect
            this.authService.loginRedirect();
          }
        }).catch(error => {
          console.error('Handle redirect promise failed', error);
        });
      }
    });
  }*/
  /*login() {
    this.authService.initialize().subscribe(() => {
      // Initiate the login redirect
      this.authService.loginRedirect({
        scopes: ['user.read', 'openid', 'profile'],
        redirectUri: window.location.origin +'/login'// Replace with your actual redirect URI
      });
      // Handle the redirect response
      this.authService.handleRedirectObservable().subscribe({
        next: (response) => {
          if (response) {
            // If the response is truthy, it means the user has been redirected back from the Microsoft login page
            this.authService.instance.setActiveAccount(response.account);
            this.router.navigate(['/']);
          }
        },
        error: (error) => console.error(error)
      });
    });
  }*/

  logout() {
    this.authService.initialize().subscribe(() => {
      this.authService.loginRedirect(); // Redirects the user to the Microsoft login page
    });
  }
  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() != null
  }
}
