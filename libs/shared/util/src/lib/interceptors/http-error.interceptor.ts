import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable }                                                              from "@angular/core";
import { $localize }                                                               from "@angular/localize/init";
import { MessageService }                                                          from "@coduction/primeng/api";
import { DialogService }                                                           from "@coduction/primeng/dynamicdialog";
import { UnauthenticatedComponent, UnauthorizedComponent }                         from "@famulex/shared/security/ui";
import { catchError, Observable, throwError }                                      from "rxjs";

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
      .pipe(catchError(error => {
          if (error) {
            if (error.error instanceof ErrorEvent) {
              // Client side error
            } else if (error instanceof HttpErrorResponse) {
              // Server side error
              switch (error.status) {
                case 400:
                  if (HttpErrorInterceptor.CUSTOM_ERROR_HANDLING) {
                    break;
                  }

                  this.showErrorMessage($localize`Bad Request`, $localize`Something went wrong, please try again later.`);
                  break;
                case 401:
                  this.dialogService.open(UnauthorizedComponent, {
                    width: "60rem",
                    closable: false
                  });
                  break;
                case 403:
                  this.dialogService.open(UnauthenticatedComponent, {
                    width: "60rem",
                    closable: false
                  });
                  break;
                case 404:
                  break;
                case 422:
                  break;
                case 500:
                  if (HttpErrorInterceptor.CUSTOM_ERROR_HANDLING) {
                    break;
                  }

                  this.showErrorMessage($localize`Internal Server Error`, $localize`Something went wrong, please try again later.`);
                  break;
                default:
                  this.showErrorMessage($localize`Connection Error`, $localize`Please try again later and reload the page.`);
                  break;
              }
            }
          }

          // Disable custom error handling after request was intercepted
          HttpErrorInterceptor.CUSTOM_ERROR_HANDLING = false;
          
          return throwError(error);
        })
      );
  }
}
