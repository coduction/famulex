import { LocationStrategy } from "@angular/common";
import { HttpClient }       from "@angular/common/http";
import { Injectable }       from "@angular/core";
import { lastValueFrom }    from "rxjs";
import { environment }      from "../../environments/environment";
import { EnvConfig }        from "./env.config";

@Injectable({ providedIn: "root" })
export class EnvService {

  constructor(private http: HttpClient,
              private locationStrategy: LocationStrategy) {
  }

  async loadEnvConfig(): Promise<void> {
    const configUrl = this.locationStrategy.prepareExternalUrl(environment.configPath);
    envConfig = await lastValueFrom(this.http.get<EnvConfig>(configUrl));
  }
}

export let envConfig: EnvConfig;
