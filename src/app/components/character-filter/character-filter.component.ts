import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-character-filter',
  templateUrl: './character-filter.component.html',
  styleUrls: ['./character-filter.component.scss']
})
export class CharacterFilterComponent {
  
  @Output() onSearch: EventEmitter<SeachParams> = new EventEmitter();
  
  searchAction(name: string, nameStartsWith: string) {
    const searchParams: SeachParams = { name, nameStartsWith };
    this.onSearch.emit(searchParams);
  }
}

export interface SeachParams {
  name: string;
  nameStartsWith: string;
}