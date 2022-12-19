export interface CharacterResponse {
    data: CharacterResponseData;
}

export interface CharacterResponseData {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: Character[];
}

export interface Character {
    id: number;
    name: string;
    description: string;
    favorite: boolean;
    thumbnail: CharacterThumbnail;
}

export interface CharacterThumbnail {
    path: string;
    extension: string;
}

export interface CharacterDetailResponse {
    data: CharacterDetailResponseData;
}

export interface CharacterDetailResponseData {
    results: CharacterDetail[];
}

export interface CharacterDetail {
    id: number;
    name: string;
    description: string;
    favorite: boolean;
    thumbnail: CharacterThumbnail;
    comics: CharacterItemResponse;
    series: CharacterItemResponse;
    stories: CharacterItemResponse;
    urls: MarvelUrl[];
}

export interface CharacterItemResponse {
    available: number;
    collectionURI: string;
    items: CharacterItem[];
}

export interface CharacterItem {
    resourceURI: string;
    name: string;
    type: string;
}

export interface MarvelUrl {
    type: string;
    url: string;
}