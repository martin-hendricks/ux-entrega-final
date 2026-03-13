import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  Session,
  SessionType,
} from '../../../models/session.model';
import { SessionService } from '../../../core/services/session.service';
import { ConflictAlertDialogComponent } from '../conflict-alert-dialog/conflict-alert-dialog.component';

@Component({
  selector: 'app-create-session-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './create-session-dialog.component.html',
  styleUrls: ['./create-session-dialog.component.scss'],
})
export class CreateSessionDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateSessionDialogComponent>);
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private dialog = inject(MatDialog);

  sessionForm: FormGroup;
  isSubmitting = signal(false);

  sessionTypes: { value: SessionType; label: string }[] = [
    { value: 'running', label: 'RUNNING' },
    { value: 'cycling', label: 'CYCLING' },
    { value: 'swimming', label: 'SWIMMING' },
    { value: 'hiking', label: 'HIKING' },
    { value: 'other', label: 'OTHER' },
  ];

  constructor() {
    this.sessionForm = this.fb.group({
      type: ['running', Validators.required],
      time: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      distance: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.sessionForm.valid && !this.isSubmitting()) {
      const formValue = this.sessionForm.value;

      // Abrir diálogo de alerta de conflictos
      const alertDialogRef = this.dialog.open(ConflictAlertDialogComponent, {
        width: '280px',
        maxWidth: '90vw',
        disableClose: false,
        panelClass: 'conflict-alert-dialog',
        data: {
          sessionType: formValue.type.toUpperCase(),
          time: formValue.time,
          duration: Number(formValue.duration),
          distance: Number(formValue.distance),
        },
      });

      alertDialogRef.afterClosed().subscribe(resolve => {
        if (resolve) {
          // Si el usuario decide resolver el conflicto
          // Aquí se abrirá el diálogo de resolver conflictos
          console.log('Resolver conflicto');
          this.dialogRef.close();
        }
        // Si cancela, no hacemos nada y el diálogo permanece abierto
      });
    }
  }


}
