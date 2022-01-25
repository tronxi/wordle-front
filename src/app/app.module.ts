import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WordleComponent } from './wordle/wordle.component';
import {APP_BASE_HREF} from "@angular/common";
import {environment} from "../environments/environment";
import { SquareComponent } from './square/square.component';
import { KeyComponent } from './key/key.component';
import {HttpClientModule} from "@angular/common/http";
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from "ngx-sharebuttons/icons";
import {ClipboardModule} from "ngx-clipboard";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    WordleComponent,
    SquareComponent,
    KeyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ShareButtonsModule,
    ShareIconsModule,
    ClipboardModule,
    FontAwesomeModule
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: environment.baseRef
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
