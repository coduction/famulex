import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable }                                                              from "@angular/core";
import { MessageService }                                                          from "@coduction/primeng/api";
import { DialogService }                                                           from "@coduction/primeng/dynamicdialog";
import { ForbiddenComponent, UnauthorizedComponent }                               from "@famulex/shared/security/ui";
import { catchError, EMPTY, Observable, tap, throwError }                          from "rxjs";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  static CUSTOM_ERROR_HANDLING = false;

  constructor(private dialogService: DialogService,
              private messageService: MessageService) {

  }

  showErrorMessage(summery: string, message: string) {
    console.error(summery + ": " + message);
    this.messageService.add({ severity: "error", summary: summery, detail: message });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        tap({
          complete: () => {
            HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = false;
          }
        }),
        catchError(error => {
          if (error) {
            if (error.error instanceof ErrorEvent) {
              // Client side error
            } else if (error instanceof HttpErrorResponse) {
              // Server side error
              if (!error.status) {
                this.showErrorMessage($localize`Connection Error`, $localize`Please try again later and reload the page.`);
                return throwError(() => error);
              }

              switch (error.status) {
                case 400:
                  if (!HttpErrorInterceptor.CUSTOM_ERROR_HANDLING) {
                    this.showErrorMessage($localize`Bad Request`, $localize`Something went wrong, please try again later.`);
                    return throwError(() => error);
                  }

                  break;
                case 401:
                  this.dialogService.open(UnauthorizedComponent, {
                    width: "60rem",
                    closable: false
                  });

                  return EMPTY;
                case 403:
                  this.dialogService.open(ForbiddenComponent, {
                    width: "60rem",
                    closable: false
                  });

                  return EMPTY;
                case 404:
                  this.messageService.add({
                    severity: "error",
                    summary: $localize`Not Found`,
                    detail: $localize`The requested resource could not be found. This indicates a problem with the application. Please contact your administrator.`
                  });

                  return EMPTY;
                default:
                  if (!HttpErrorInterceptor.CUSTOM_ERROR_HANDLING) {
                    this.showErrorMessage($localize`Internal Server Error`, $localize`Something went wrong, please try again later.`);
                  }
              }
            }
          }

          // Disable custom error handling after request was intercepted
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = false;

          return throwError(() => error);
        })
      );
  }
}
