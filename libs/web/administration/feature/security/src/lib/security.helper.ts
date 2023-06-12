import { Injectable }                                          from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { SecurityService }                                     from "@famulex/shared/famulex-api-client";
import { catchError, delay, map, Observable, of, switchMap }   from "rxjs";

@Injectable({ providedIn: "root" })
export class SecurityHelper {

  constructor(private securityService: SecurityService) {
  }

  validateRoleName(originalName?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const currentValue = control.value;

      // Check if the originalName is equal to the currentValue
      if (originalName === currentValue) {
        return of(null); // Return null immediately
      }

      return of(currentValue).pipe(
        delay(500),
        switchMap(roleName => this.securityService.checkRoleExistence(roleName)
          .pipe(
            map(roleExists => {
              if (roleExists) {
                return { taken: true };
              }
              return null;
            }),
            catchError(() => {
              return of({ asyncError: true });
            })
          )
        )
      );
    };
  }
}
