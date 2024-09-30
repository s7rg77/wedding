import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

import { MainService } from '../main.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
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

  constructor(private fb: FormBuilder, auth: Auth, private mainService: MainService) {

    this.auth = auth;

    this.signupForm = this.fb.group({
      user_mail: ['', [Validators.required, Validators.email]],
      user_pass: ['', [Validators.required]]
    });

    this.signinForm = this.fb.group({
      user_mail: ['', [Validators.required, Validators.email]],
      user_pass: ['', [Validators.required]]
    });

    this.mainForm = this.fb.group({
      users: this.fb.array([])
    });

  }

  ngOnInit() {

    onAuthStateChanged(this.auth, (user: User | null) => {

      this.loggedIn = !!user;
      this.user_mail = user?.email || null;

      if (this.loggedIn) {
        this.loadUserData();
      }

    });

  }

  get users(): FormArray {
    return this.mainForm.get('users') as FormArray;
  }

  addUser() {

    if (this.users.length < 4) {
      this.users.push(this.fb.group({
        user_mail: [''],
        user_name: [''],
        user_last: [''],
        user_age: [''],
        user_bus: [''],
        user_data: ['']
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
          if (response && response.users && response.users.length > 0) {
            this.populateUserForm(response.users);
            this.viewingData = true;
          } else {
            this.viewingData = false;
          }
        },
        error: err => {
          console.error('Error al cargar los datos del usuario:', err);
        }
      });

    }

  }

  populateUserForm(users: any[]) {

    this.users.clear();

    users.forEach(user => {

      const userGroup = this.fb.group({
        user_id: [user.user_id],
        user_mail: [user.user_mail],
        user_name: [user.user_name],
        user_last: [user.user_last],
        user_age: [user.user_age],
        user_bus: [user.user_bus],
        user_data: [user.user_data]
      });

      this.users.push(userGroup);

    });

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

  async signup() {

    const { user_mail, user_pass } = this.signupForm.value;

    try {

      await createUserWithEmailAndPassword(this.auth, user_mail, user_pass);
      this.loggedIn = true;

    } catch (error) {

      console.error('Error al registrarse:', error);

    }

  }

  async signin() {

    const { user_mail, user_pass } = this.signinForm.value;

    try {

      await signInWithEmailAndPassword(this.auth, user_mail, user_pass);
      this.loggedIn = true;

    } catch (error) {

      console.error('Error al iniciar sesión:', error);

    }

  }

  async signout() {

    try {

      await signOut(this.auth);
      this.loggedIn = false;
      this.user_mail = null;
      this.editing = false;
      this.viewingData = false;

    } catch (error) {

      console.error('Error al cerrar sesión:', error);

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

    }

  }

  edit() {

    this.editing = true;
    this.viewingData = false;
    
  }

}