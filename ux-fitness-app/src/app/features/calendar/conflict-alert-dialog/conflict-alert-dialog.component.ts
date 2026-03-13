import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResolveConflictDialogComponent } from '../resolve-conflict-dialog/resolve-conflict-dialog.component';

export interface ConflictData {
  sessionType: string;
  time: string;
  duration: number;
  distance: number;
}

@Component({
  selector: 'app-conflict-alert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './conflict-alert-dialog.component.html',
  styleUrls: ['./conflict-alert-dialog.component.scss'],
})
export class ConflictAlertDialogComponent {
  private dialogRef = inject(MatDialogRef<ConflictAlertDialogComponent>);
  private dialog = inject(MatDialog);
  data = inject<ConflictData>(MAT_DIALOG_DATA);

  onMove(): void {
    // Cerrar el diálogo de alerta
    this.dialogRef.close();
    
    // Abrir el diálogo de resolución de conflictos
    const resolveDialogRef = this.dialog.open(ResolveConflictDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      data: this.data,
    });

    resolveDialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'save') {
        console.log('Conflicto resuelto:', result);
        // TODO: Guardar la sesión con la nueva fecha/hora
      }
    });
  }

  onMaintain(): void {
    this.dialogRef.close({ action: 'maintain', data: this.data });
    // TODO: Mantener ambas sesiones
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}
