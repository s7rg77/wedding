import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

import { MainService } from '../main.service';

@Component({

  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'

})

export class FormComponent implements OnInit {

  auth: Auth;
  signupForm: FormGroup;
  signinForm: FormGroup;
  mainForm: FormGroup;
  loggedIn: boolean = false;
  user_mail: string | null = null;
  viewingData: boolean = false;
  editing: boolean = false;
  allUsers: any[] = [];

  constructor(private fb: FormBuilder, auth: Auth, private mainService: MainService) {

    this.auth = auth;

    this.signupForm = this.fb.group({
      user_mail: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      user_pass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });

    this.signinForm = this.fb.group({
      user_mail: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      user_pass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });

    this.mainForm = this.fb.group({
      users: this.fb.array([])
    });

  }

  get users(): FormArray {

    return this.mainForm.get('users') as FormArray;

  }

  ngOnInit() {

    onAuthStateChanged(this.auth, (user: User | null) => {

      this.loggedIn = !!user;
      this.user_mail = user?.email || null;

      if (this.loggedIn) {

        this.loadUserData();

      } else {

        this.users.clear();
        this.allUsers = [];
        this.viewingData = false;
        this.editing = false;

      }

    });

  }

  checkUserState() {

    if (this.users.length === 0) {

      this.viewingData = false;
      this.editing = false;

    }

  }

  loadUserData() {

    if (this.user_mail) {

      this.mainService.getService(this.user_mail).subscribe({
        next: response => {
          console.log('Datos del usuario:', response);

          if (this.user_mail === 'sxrgxx@gmail.com') {

            if (response.admUsers) {

              this.userForm(response.admUsers);

            }

            if (response.allUsers) {

              this.allUsers = response.allUsers;

            }

            this.viewingData = true;

          } else {

            if (response && response.users && response.users.length > 0) {

              this.userForm(response.users);
              this.viewingData = true;

            } else {

              this.viewingData = false;

            }

          }

        },
        error: error => {
          console.error('Error al cargar los datos del usuario:', error);
        }
      });

    }

  }

  userForm(users: any[]) {
    this.users.clear();

    users.forEach(user => {
      const userGroup = this.fb.group({
        user_id: [user.user_id],
        user_mail: [user.user_mail],
        user_name: [user.user_name, [Validators.required, Validators.maxLength(50)]],
        user_last: [user.user_last, [Validators.required, Validators.maxLength(50)]],
        user_age: [user.user_age, Validators.required],
        user_bus: [user.user_bus, Validators.required],
        user_data: [user.user_data, [Validators.maxLength(100)]]
      });

      this.users.push(userGroup);
    });
  }

  async signup() {

    if (this.signupForm.invalid) {

      window.alert(this.getErrorMessage(this.signupForm));
      return;

    }

    const { user_mail, user_pass } = this.signupForm.value;

    try {

      await createUserWithEmailAndPassword(this.auth, user_mail, user_pass);
      this.loggedIn = true;

    } catch (error: any) {

      window.alert('Error al registrarse: ' + (error?.message || 'Desconocido'));

    }

  }

  async signin() {

    if (this.signinForm.invalid) {

      window.alert(this.getErrorMessage(this.signinForm));
      return;

    }

    const { user_mail, user_pass } = this.signinForm.value;

    try {

      await signInWithEmailAndPassword(this.auth, user_mail, user_pass);
      this.loggedIn = true;
      this.loadUserData();

    } catch (error: any) {

      window.alert('Error al iniciar sesión: ' + (error?.message || 'Desconocido'));

    }

  }

  async signout() {

    try {

      await signOut(this.auth);

      this.loggedIn = false;
      this.user_mail = null;
      this.editing = false;
      this.viewingData = false;
      this.users.clear();
      this.allUsers = [];

    } catch (error) {

      console.error('Error al cerrar sesión:', error);

    }

  }

  addUser() {

    if (this.users.length < 4) {

      this.users.push(this.fb.group({
        user_mail: [''],
        user_name: ['', [Validators.required, Validators.maxLength(50)]],
        user_last: ['', [Validators.required, Validators.maxLength(50)]],
        user_age: [null, Validators.required],
        user_bus: [null, Validators.required],
        user_data: ['', [Validators.maxLength(100)]]
      }));

    }

  }

  removeUser(index: number) {

    const userGroup = this.users.at(index);
    const user_id = userGroup.get('user_id')?.value;

    if (user_id !== undefined && !isNaN(user_id)) {

      const userIdNumber = Number(user_id);

      this.mainService.delService(userIdNumber).subscribe({
        next: (response) => {
          console.log(response.message || `Usuario con ID ${userIdNumber} eliminado de la base de datos.`);
          this.users.removeAt(index);
          this.checkUserState();
        },
        error: (error) => {
          console.error(`Error al eliminar el usuario con ID ${userIdNumber}:`, error);
        }
      });

    } else {

      this.users.removeAt(index);
      console.log('Usuario eliminado visualmente.');
      this.checkUserState();

    }

  }

  confirm() {
    if (this.mainForm.valid) {
      const formData = this.buildUserArray();

      if (this.editing) {
        this.mainService.modService({ users: formData }).subscribe({
          next: response => {
            console.log('Datos actualizados con éxito:', response);
            this.viewingData = true;
            this.editing = false;
            this.loadUserData();
          },
          error: error => {
            console.error('Error al actualizar los datos:', error);
          }
        });
      } else {
        this.mainService.addService({ users: formData }).subscribe({
          next: response => {
            console.log('Datos guardados con éxito:', response);
            this.viewingData = true;
            this.loadUserData();
          },
          error: error => {
            console.error('Error al guardar los datos:', error);
          }
        });
      }
    } else {

      this.showValidationAlerts();
    }
  }

  buildUserArray() {

    const formValues = this.mainForm.value;

    return formValues.users.map((user: any) => {

      if (user.user_id) {

        return {
          user_id: user.user_id,
          user_mail: this.user_mail,
          user_name: user.user_name,
          user_last: user.user_last,
          user_age: user.user_age,
          user_bus: user.user_bus,
          user_data: user.user_data,
        };

      } else {

        return {
          user_mail: this.user_mail,
          user_name: user.user_name,
          user_last: user.user_last,
          user_age: user.user_age,
          user_bus: user.user_bus,
          user_data: user.user_data,
        };

      }

    });

  }

  edit() {

    this.editing = true;
    this.viewingData = false;

  }

  getErrorMessage(formGroup: FormGroup): string {

    const mailCtrl = formGroup.get('user_mail');
    const passCtrl = formGroup.get('user_pass');

    if (mailCtrl?.hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }

    if (mailCtrl?.hasError('email')) {
      return 'El correo electrónico no es válido.';
    }

    if (mailCtrl?.hasError('maxlength')) {
      return 'El correo electrónico no debe exceder los 50 caracteres.';
    }

    if (passCtrl?.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }

    if (passCtrl?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (passCtrl?.hasError('maxlength')) {
      return 'La contraseña no puede exceder los 12 caracteres.';
    }

    return '';

  }

  showValidationAlerts() {
    this.users.controls.forEach((userGroup, index) => {
      if (userGroup.get('user_name')?.invalid) {
        window.alert(`Error en invitado ${index + 1}: Nombre es obligatorio y debe tener un máximo de 50 caracteres.`);
      }
      if (userGroup.get('user_last')?.invalid) {
        window.alert(`Error en invitado ${index + 1}: Apellidos son obligatorios y deben tener un máximo de 50 caracteres.`);
      }
      if (userGroup.get('user_age')?.invalid) {
        window.alert(`Error en invitado ${index + 1}: Debes seleccionar si es adulto o niño.`);
      }
      if (userGroup.get('user_bus')?.invalid) {
        window.alert(`Error en invitado ${index + 1}: Debes seleccionar si necesita autobús.`);
      }
      if (userGroup.get('user_data')?.invalid) {
        window.alert(`Error en invitado ${index + 1}: Las alergias deben tener un máximo de 100 caracteres.`);
      }
    });
  }

}