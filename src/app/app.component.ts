import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef  } from '@angular/core';

import { CharactersListComponent } from '../app/components/characters-list/characters-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'marvel-characters';
  
  //@ViewChild('charactersTemplate', { read: ViewContainerRef }) view!: ViewContainerRef;
  
  ngOnInit(): void {
    this.createCharactersList();
  }
  
  createCharactersList() {
    //this.view.createComponent(CharactersComponent);
  }
}