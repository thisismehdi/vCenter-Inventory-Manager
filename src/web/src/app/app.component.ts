import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";

import {AuthService} from "../service/auth.service";
import {HttpClient} from "@angular/common/http";
import {SearchService} from "../service/SearchService.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  clickedElement: string='';
  pageTitle!: string;
  title = 'Inventaire vCenter';

  /*isOpen = false;
  sideBarre(sidenav: MatSidenav) {
    this.isOpen = !this.isOpen;
    sidenav.toggle();
  }*/



  changeStyle(element: string) {
    this.clickedElement = element;
  }



  constructor(private searchService: SearchService,private router: Router, private authService: MsalService, private msalBroadcastService: MsalBroadcastService,private authService1 :AuthService,private http: HttpClient ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setPageTitle(event.url);
        this.selectedElement(event.url);
      }
    });

  }
  selectedElement(url: string){

    if (url === '/conf-client'){
      this.clickedElement = 'button2';
    }
    else  if (url === '/Historique-logs'){
      this.clickedElement = 'button3';
    }
    else{
      this.clickedElement = 'button1';
    }

  }


  setPageTitle(url: string) {

    if (url === '/client'|| url === '/' || url === '/conf-client' ) {
      this.pageTitle = 'Rechercher un client';
    } else if (url === '/role') {
      this.pageTitle = 'Rechercher un role';
    }
    else{
      this.pageTitle = 'Rechercher';
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
  onSearchInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const query = inputElement.value;
      this.searchService.setSearchQuery(query);
      //console.log(query)
    }
  }
  ngOnInit(): void {
    console.log(this.authService1.isLoggedIn()+" hereeeeee");
  }


  diconnexion() {
    this.authService1.logout();
  }
}
