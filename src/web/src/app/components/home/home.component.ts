import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  clickedElement: string='';
  pageTitle!: string;
  title = 'Inventaire vCenter';
  isOpen = false;
  /*sideBarre(sidenav: MatSidenav) {
    this.isOpen = !this.isOpen;
    sidenav.toggle();
  }*/



  changeStyle(element: string) {
    this.clickedElement = element;
  }



  constructor(private router: Router) {
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

}
