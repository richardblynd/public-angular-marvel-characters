import { Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Character } from 'src/app/characterResponse';
import { CharacterDetailComponent } from '../character-detail/character-detail.component';

@Component({
  selector: 'app-character-detail-dialog',
  templateUrl: './character-detail-dialog.component.html',
  styleUrls: ['./character-detail-dialog.component.scss']
})
export class CharacterDetailDialogComponent implements OnInit {
  
  @ViewChild('characterDetailTemplate', { read: ViewContainerRef }) view!: ViewContainerRef;

  constructor(
    public dialogRef: MatDialogRef<CharacterDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Character
  ) { }
  
  ngOnInit(): void {
    this.createCharacterDetail();
  }
  
  createCharacterDetail() {
    setTimeout(() => {
      const componentRef = this.view.createComponent(CharacterDetailComponent);
      componentRef.instance.character = this.data;
    }, 1);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}

