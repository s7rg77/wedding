import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({

  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'

})

export class NotesComponent implements OnInit {

  isLoading: boolean = true;

  @ViewChild('fileInput') fileInput!: ElementRef;

  notes: any[] = [];
  notesForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder) {

    this.notesForm = this.formBuilder.group({

      notesText: ['', [Validators.required, Validators.maxLength(500)]]

    });

  }

  ngOnInit(): void {

    this.getNotes();

  }

  getNotes(): void {

    this.http.get<any[]>('https://onnetwo.com/notes_get.php').subscribe({

      next: (data: any[]) => {

        this.notes = data.map(note => ({

          ...note,
          notesImage: note.notes_image ? `img/${note.notes_image}` : null,
          notesText: note.notes_text,
          notesDate: note.notes_date

        }));

        this.isLoading = false;

      },

      error: () => {

        alert('Error al recuperar las firmas');
        return;

      },

    });

  }

  onFileSelected(event: any): void {

    const file = event.target.files[0];

    if (file) {

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {

        alert('Solo se permiten archivos de tipo JPG, JPEG, PNG o GIF.');
        return;

      }

      const maxSizeInKB = 500;

      if (file.size > maxSizeInKB * 1024) {

        alert('El tamaño máximo permitido es de 500 KB');
        return;

      }

      this.selectedFile = file;

    }

  }

  addNote(): void {

    if (this.notesForm.invalid) {

      alert('Firma no válida');
        return;

    }

    const formData = new FormData();

    formData.append('notesText', this.notesForm.get('notesText')?.value);

    if (this.selectedFile) {

      formData.append('notesImage', this.selectedFile, this.selectedFile.name);

    }

    this.http.post('https://onnetwo.com/notes_add.php', formData).subscribe({

      next: () => {

        this.getNotes();
        this.notesForm.reset();
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';

      },

      error: () => {

        alert('Error al agregar la firma');
        return;

      },

      complete: () => {

        alert('Firma agregada');
        return;

      }

    });

  }

  exit() {

    this.router.navigate(['/']);

  }

}