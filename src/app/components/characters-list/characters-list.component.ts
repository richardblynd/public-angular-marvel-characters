import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CharacterService } from '../../character.service';
import { Character, CharacterResponseData } from '../../characterResponse';
import { CharacterDetailDialogComponent } from '../character-detail-dialog/character-detail-dialog.component';
import { SeachParams } from '../character-filter/character-filter.component';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
  
  characters: Character[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  charactersListLength = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = true;
  filterName = '';
  filterNameStartsWith = '';
  favoriteListFull = false;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private characterService: CharacterService,
    public dialog: MatDialog
    ) {
      this.favoriteListFull = characterService.isFavoriteListFull();
    }
  
  ngOnInit(): void {
    this.getCharacters();
  }
  
  getCharacters() {
    this.isLoading = true;
    this.characterService.getCharacters(
      this.pageIndex,
      this.pageSize,
      this.filterName,
      this.filterNameStartsWith)
      .subscribe(charactersResponseData => {
        this.isLoading = false;
        this.charactersListLength = charactersResponseData.total;
        this.characters = charactersResponseData.results;
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getCharacters();
  }

  favorite(character: Character) {
    this.favoriteListFull = !this.characterService.setCharacterFavorite(character);
  }

  searchCharacters(searchParams: SeachParams) {
    this.filterName = searchParams.name;
    this.filterNameStartsWith = searchParams.nameStartsWith;
    this.pageIndex = 0;
    this.getCharacters();
  }

  details(character: Character) {
    const dialogRef = this.dialog.open(CharacterDetailDialogComponent, {
      data: character,
    });
  }
}