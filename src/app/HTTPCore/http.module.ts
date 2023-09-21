// import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SecureApiClient } from './secure-api-client.service';

const PROVIDERS = [SecureApiClient];

@NgModule({
  // imports: [CommonModule],
})
export class HttpModule {
  static forRoot(): ModuleWithProviders<HttpModule> {
    return {
      ngModule: HttpModule,
      providers: [...PROVIDERS],
    };
  }
}
