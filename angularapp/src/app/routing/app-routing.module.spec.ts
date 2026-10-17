import { ComponentFixture, TestBed, async, inject, TestBedStatic } from "@angular/core/testing";
import { Router } from "@angular/router";

import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "../app.component";
import { HomeComponent } from "../home/home.component";
import { Location } from "@angular/common";
import { AdminComponent } from "../admin/admin.component";
import { OrganizerComponent } from "../organizer/organizer.component";
import { LoginComponent } from "../login/login.component";
import { RegistrationComponent } from "../registration/registration.component";
import { ErrorComponent } from "../error/error.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NavbarComponent } from "../navbar/navbar.component";

describe("App Routing",() => {
    let router: Router;
    let fixture: ComponentFixture<AppComponent>;
    let location: Location

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(
                [
                  { path: '', component: HomeComponent },
                  { path: 'admin', component: AdminComponent },
                  { path: 'organizer', component: OrganizerComponent },
                  { path: 'login', component: LoginComponent },
                  { path: 'register', component: RegistrationComponent },
                  { path: 'error', component: ErrorComponent, data: { message: 'Oops! Something went wrong.' } },
                  { path: '**', redirectTo: '/error', pathMatch: 'full' },
                ]), HttpClientTestingModule
            ],
            declarations:[
                NavbarComponent,
                AppComponent,
                HomeComponent,
                AdminComponent,
                OrganizerComponent,
                LoginComponent,
                RegistrationComponent,
                ErrorComponent
            ]

        }).compileComponents();
    }));

    beforeEach(() => {
        router=TestBed.get(Router);
        location = TestBed.get(Location);
        router.initialNavigation();
        fixture = TestBed.createComponent(AppComponent)
    });


    fit('Frontend_day34_should route to admin page', async () => {
      await router.navigate(['/admin']);
      expect(location.path()).toBe('/admin');
    });

    fit('Frontend_day34_should route to organizer page', async () => {
      await router.navigate(['/organizer']);
      expect(location.path()).toBe('/organizer');
    });

})
