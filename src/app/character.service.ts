import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character, CharacterDetail, CharacterDetailResponse, CharacterResponse, CharacterResponseData } from './characterResponse';
import { map, Observable, of } from 'rxjs';
import { Md5 } from 'md5-typescript';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private charactersUrl = 'https://gateway.marvel.com:443/v1/public/characters';
  private characterDetailUrl = 'https://gateway.marvel.com:443/v1/public/characters/';
  private lsCharactersFavoriteList = 'lsCharactersFavoriteList';
  private lsCharactersFavoriteListObjects = 'lsCharactersFavoriteListObjects';

  constructor(private http: HttpClient) { }

  prepareMarvelApiUrlAuth() {
    var timeStamp = Date.now();

    var privateKey = 'b878d6792f9ecaf3812b2db5df51f0177832c7c0';
    var publicKey = '467906de5c9c450adf87b71939165622';

    var hash = Md5.init(timeStamp + privateKey + publicKey);

    //TODO: colocar essas infos de chave privada e publica em um arquivo de configuração
    //TODO: passar para um http interceptor

    var apikeyParam = 'apikey=' + publicKey;
    var hashParam = '&hash=' + hash;
    var timeStampParam = '&ts=' + timeStamp;

    return apikeyParam + hashParam + timeStampParam;
  }

  getCharacters(
    page: number,
    pageSize: number,
    name: string,
    nameStartsWith: string): Observable<CharacterResponseData> {

    var limit = pageSize;
    var offset = page * pageSize;

    var listOfFavoriteCharacters = localStorage.getItem(this.lsCharactersFavoriteList);

    if (page > 0 &&
      listOfFavoriteCharacters &&
      listOfFavoriteCharacters.length > 0) {
      var splited = listOfFavoriteCharacters.split('|');
      offset -= splited.length;
      limit += splited.length;
    }

    var orderByParam = '&orderBy=name';
    var limitParam = '&limit=' + limit;
    var offsetParam = '&offset=' + offset;
    var nameParam = '&name=' + name;
    var nameStartsWithParam = '&nameStartsWith=' + nameStartsWith;

    var urlParams = this.prepareMarvelApiUrlAuth() + orderByParam + limitParam + offsetParam;

    if (name.length > 0) {
      urlParams += nameParam;
    }

    if (nameStartsWith.length > 0) {
      urlParams += nameStartsWithParam;
    }

    return this.http.get<CharacterResponse>(this.charactersUrl + '?' + urlParams)
      .pipe(
        map(characterResponse => {

          this.prepareCharacterResponse(
            characterResponse.data,
            page,
            limit,
            name,
            nameStartsWith);

          return characterResponse.data;
        })
      );
  }

  getCharacterDetail(characterId: number) {
    return this.http.get<CharacterDetailResponse>(this.characterDetailUrl + characterId.toString() + '?' + this.prepareMarvelApiUrlAuth())
      .pipe(
        map(characterDetailResponse => {
          return characterDetailResponse.data.results[0];
        })
      );
  }

  setCharacterFavorite(character: Character): boolean {
    var listOfFavoriteCharacters = localStorage.getItem(this.lsCharactersFavoriteList);

    if (!listOfFavoriteCharacters ||
      listOfFavoriteCharacters?.length == 0 ||
      !listOfFavoriteCharacters?.split('|').find(x => x == character.id.toString())
    ) {
      this.addCharacterToFavoriteList(listOfFavoriteCharacters, character);
    } else if (listOfFavoriteCharacters?.split('|').find(x => x == character.id.toString())) {
      this.removeCharacterToFavoriteList(listOfFavoriteCharacters, character);
    }

    listOfFavoriteCharacters = localStorage.getItem(this.lsCharactersFavoriteList);

    return !this.isFavoriteListFull();
  }

  isFavoriteListFull(): boolean {
    var listOfFavoriteCharacters = localStorage.getItem(this.lsCharactersFavoriteList);

    return listOfFavoriteCharacters != undefined && listOfFavoriteCharacters.length > 0 && listOfFavoriteCharacters.split('|').length >= 5;
  }

  private addCharacterToFavoriteList(listOfFavoriteCharacters: string | null, character: Character) {

    character.favorite = true;

    if (!listOfFavoriteCharacters || listOfFavoriteCharacters.length == 0) {
      localStorage.setItem(this.lsCharactersFavoriteList, character.id.toString());
      let arrayFavoriteCharacters = [character];
      localStorage.setItem(this.lsCharactersFavoriteListObjects, JSON.stringify(arrayFavoriteCharacters));
    } else {
      localStorage.setItem(this.lsCharactersFavoriteList, listOfFavoriteCharacters + '|' + character.id.toString());
      let stringCharactersFavoriteListObjects = localStorage.getItem(this.lsCharactersFavoriteListObjects);
      if (stringCharactersFavoriteListObjects) {
        let arrayFavoriteCharacters: Character[] = JSON.parse(stringCharactersFavoriteListObjects);
        arrayFavoriteCharacters.push(character);
        localStorage.setItem(this.lsCharactersFavoriteListObjects, JSON.stringify(arrayFavoriteCharacters));
      }
    }
  }

  private removeCharacterToFavoriteList(listOfFavoriteCharacters: string, character: Character) {

    character.favorite = false;

    let splitedList = listOfFavoriteCharacters.split('|');

    if (splitedList.length < 1) {
      localStorage.setItem(this.lsCharactersFavoriteList, '');
      localStorage.setItem(this.lsCharactersFavoriteListObjects, '');
    } else {
      splitedList.splice(splitedList.indexOf(character.id.toString()), 1);
      localStorage.setItem(this.lsCharactersFavoriteList, splitedList.join('|'));

      let stringCharactersFavoriteListObjects = localStorage.getItem(this.lsCharactersFavoriteListObjects);

      if (stringCharactersFavoriteListObjects) {
        let arrayFavoriteCharacters: Character[] = JSON.parse(stringCharactersFavoriteListObjects);

        var removeObjectIndex = 0;

        for (var x = 0; x < arrayFavoriteCharacters.length; x++) {
          if (arrayFavoriteCharacters[x].id == character.id) {
            removeObjectIndex = x;
            break;
          }
        }

        arrayFavoriteCharacters.splice(removeObjectIndex, 1);

        localStorage.setItem(this.lsCharactersFavoriteListObjects, JSON.stringify(arrayFavoriteCharacters));
      }
    }
  }

  private prepareCharacterResponse(
    characterResponseData: CharacterResponseData,
    page: number,
    limit: number,
    name: string,
    nameStartsWith: string) {
    var listOfFavoriteCharacters = localStorage.getItem(this.lsCharactersFavoriteList);

    if (listOfFavoriteCharacters &&
      listOfFavoriteCharacters.length > 0 &&
      characterResponseData &&
      characterResponseData.results.length > 0) {

      let stringCharactersFavoriteListObjects = localStorage.getItem(this.lsCharactersFavoriteListObjects);

      if (stringCharactersFavoriteListObjects && stringCharactersFavoriteListObjects.length > 0) {
        let arrayFavoriteCharacters: Character[] = JSON.parse(stringCharactersFavoriteListObjects);
        let newCharactersList: Character[] = [];
        let splitedList = listOfFavoriteCharacters.split('|');

        if (page == 0) {
          console.log('a');
          newCharactersList.push(...arrayFavoriteCharacters);

          if (name.length > 0) {
            newCharactersList = newCharactersList.filter(element => {
              return element.name == name;
            });
          }

          if (nameStartsWith.length > 0) {
            newCharactersList = newCharactersList.filter(element => {
              return element.name.toLowerCase().indexOf(nameStartsWith.toLowerCase()) == 0;
            });
          }

          newCharactersList = newCharactersList.sort((obj1, obj2) => {
            if (obj1.name > obj2.name) {
              return 1;
            }

            if (obj1.name < obj2.name) {
              return -1;
            }

            return 0;
          });

          characterResponseData.results.forEach(character => {
            var exists = false;
            splitedList.forEach(favoriteCharacter => {
              if (character.id.toString() == favoriteCharacter) {
                exists = true;
              }
            });

            if (!exists) {
              newCharactersList.push(character);
            }

          });
        } else {
          characterResponseData.results.forEach(character => {
            var exists = false;
            splitedList.forEach(favoriteCharacter => {
              if (character.id.toString() == favoriteCharacter) {
                exists = true;
              }
            });

            if (!exists) {
              newCharactersList.push(character);
            }

          });

          limit -= splitedList.length;
        }

        if (newCharactersList.length > limit) {
          newCharactersList.splice(newCharactersList.length - (newCharactersList.length - limit));
        }

        characterResponseData.results = newCharactersList;
      }
    }
  }
}