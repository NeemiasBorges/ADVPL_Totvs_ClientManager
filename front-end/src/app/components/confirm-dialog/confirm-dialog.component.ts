import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface ConfirmDialogData {
  codigo: string;
  loading: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true, // Se seu componente for standalone
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule // Adicione esta importação
  ],
  template: `
  <div mat-dialog-content>
    <div *ngIf="!data.loading">
      <p>Deseja realmente excluir o cliente {{data.codigo}}?</p>
      <div mat-dialog-actions>
        <button mat-button [mat-dialog-close]="'cancel'">Cancelar</button>
        <button mat-button [mat-dialog-close]="'confirm'" color="warn">Excluir</button>
      </div>
    </div>
    <div *ngIf="data.loading" class="loading-container">
      <mat-spinner diameter="50"></mat-spinner>
    </div>
  </div>
`,
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
