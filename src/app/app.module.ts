import { SecureApiClient } from './HTTPCore/secure-api-client.service';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './state/states';
import { TriviaDataEffects } from './state/triviaDataNgrx';
import { HttpModule } from './HTTPCore/http.module';
import { TriviaData } from './ngrx-classes/triviadata.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
const Effects = [
  // ActionItemsEffects,
  TriviaDataEffects
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule.forRoot(),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictActionImmutability: false,
        strictActionSerializability: false,
        strictActionTypeUniqueness: true,
  
        strictStateImmutability: false,
  
        strictStateSerializability: false,
  
      },
  
    }),
  
    EntityDataModule.forRoot({}),
    EffectsModule.forRoot([...Effects]),
    
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [TriviaData],
  bootstrap: [AppComponent]
})
export class AppModule { }
