import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ConflictResolutionData {
  sessionType: string;
  time: string;
  duration: number;
  distance: number;
}

export interface SuggestedSlot {
  id: string;
  label: string;
  day: string;
  time: string;
}

@Component({
  selector: 'app-resolve-conflict-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './resolve-conflict-dialog.component.html',
  styleUrls: ['./resolve-conflict-dialog.component.scss'],
})
export class ResolveConflictDialogComponent {
  private dialogRef = inject(MatDialogRef<ResolveConflictDialogComponent>);
  private fb = inject(FormBuilder);
  data = inject<ConflictResolutionData>(MAT_DIALOG_DATA);

  manualForm: FormGroup;
  selectedSlot: string | null = null;

  suggestedSlots: SuggestedSlot[] = [
    { id: 'A', label: '[SUGERENCIA A]', day: 'Mañana', time: '07:30 AM' },
    { id: 'B', label: '[SUGERENCIA B]', day: 'Jueves', time: '06:00 AM' },
    { id: 'C', label: '[SUGERENCIA C]', day: 'Viernes', time: '08:00 AM' },
  ];

  constructor() {
    this.manualForm = this.fb.group({
      newDate: ['', Validators.required],
      newTime: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
    });
  }

  selectSlot(slotId: string): void {
    this.selectedSlot = slotId;
    this.manualForm.reset();
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }

  onSave(): void {
    if (this.selectedSlot) {
      const slot = this.suggestedSlots.find(s => s.id === this.selectedSlot);
      this.dialogRef.close({ 
        action: 'save', 
        type: 'suggested',
        slot: slot 
      });
    } else if (this.manualForm.valid) {
      this.dialogRef.close({ 
        action: 'save', 
        type: 'manual',
        date: this.manualForm.value.newDate,
        time: this.manualForm.value.newTime
      });
    }
  }

  onClose(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}
