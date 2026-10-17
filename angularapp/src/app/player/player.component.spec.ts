import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('PlayerComponent', () => {

  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        PlayerComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule
      ]
    });

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });


  fit('Frontend_day32_should create PlayerComponent with player array', () => {

    expect(component).toBeTruthy();
    expect((component as any).players).toBeTruthy();

  });

});