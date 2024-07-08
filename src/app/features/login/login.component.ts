import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@shared/button/button.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '@services/login-service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, 
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {


  form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [ Validators.required, Validators.minLength(5)]],
  });

  showPassword = false;
  status: 'init' | 'loading' | 'success' | 'faild' = 'init';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private serviceLogin: LoginService
  ) { }

  doLogin() {
    console.log("clococococooc")
    if (this.form.valid) {
      console.log('entra validacion-->>>>>')
      this.status = 'loading';
      const { username, password } = this.form.getRawValue();
      
      this.serviceLogin.login(username, password).subscribe({
        next: () =>{
          
          this.status = 'success'
          this.router.navigate(['/dashboard'])
        },
        error: () => {
          this.status = 'faild'
        },
      })

      // TODO
    } else {
      this.form.markAllAsTouched();
    }
  }

}
