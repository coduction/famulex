import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { FamulexApiConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';


@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class FamulexApiModule {
    public static forRoot(configurationFactory: () => FamulexApiConfiguration): ModuleWithProviders<FamulexApiModule> {
        return {
            ngModule: FamulexApiModule,
            providers: [ { provide: FamulexApiConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: FamulexApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('FamulexApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
