import { Component, Inject, Input, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/character.service';
import { Character, CharacterDetail } from 'src/app/characterResponse';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {

  isLoading = false;
  @Input() character: Character | undefined;
  characterDetail: CharacterDetail | undefined;

  constructor(private characterService: CharacterService) {
    this.character = undefined;
   }
  
  ngOnInit(): void {
    console.log(this.character);
    if (this.character) {
      this.isLoading = true;
      this.characterService.getCharacterDetail(this.character.id).subscribe(
        characterDetail => { 
          this.characterDetail = characterDetail;
          this.isLoading = false;
        }
      );
    }
  }

  hasDetailUrl() {
    return this.getUrl('detail').length > 0;
  }

  hasDetailWiki() {
    return this.getUrl('wiki').length > 0;
  }

  showDetail() {
    let url = this.getUrl('detail');
    if (url.length > 0) {
      window.open(url, "_blank");
    }
  }

  showWiki() {
    let url = this.getUrl('wiki');
    if (url.length > 0) {
      window.open(url, "_blank");
    }
  }

  getUrl(type: string) {
    if (this.characterDetail) {
      var detailUrl = this.characterDetail.urls.find(x => x.type == type);
      if (detailUrl) {
        return detailUrl.url;
      }
    }
    return '';
  }
}
