import { HttpEventType }                                   from "@angular/common/http";
import { Injectable }                                      from "@angular/core";
import { MessageService }                                  from "@coduction/primeng/api";
import { CourseDraftService, FileService }                 from "@famulex/shared/famulex-api-client";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store }                                           from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap, tap }   from "rxjs";
import { CourseDraftItemsActions }                         from "./course-draft-items.actions";
import { CourseDraftItemsState }                           from "./course-draft-items.reducer";
import { CourseDraftNodesActions }                         from "./course-draft-nodes.actions";
import { CourseDraftNodesState }                           from "./course-draft-nodes.reducer";
import { CourseDraftActions }                              from "./course-draft.actions";
import { CourseDraftState }                                from "./course-draft.reducer";

@Injectable()
export class CourseDraftItemsEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private courseDraftService: CourseDraftService,
    private fileService: FileService,
    private messageService: MessageService
  ) {
  }

  /*************************************************************************
   * Load
   ************************************************************************/
  selectCourseDraftNode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftNodesActions.selectNode),
      map(() => CourseDraftItemsActions.load())
    );
  });

  loadCourseDraftItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.load),
      concatLatestFrom(() => [
        this.store.select(CourseDraftState.selectKey),
        this.store.select(CourseDraftNodesState.selectCurrentKey)
      ]),
      switchMap(([_, courseDraftKey, nodeKey]) => {
        if (!courseDraftKey || !nodeKey) {
          return of(CourseDraftItemsActions.loadFailure({}));
        }

        return this.courseDraftService.loadCourseDraftItems(courseDraftKey, nodeKey).pipe(
          map(response => CourseDraftItemsActions.loadSuccess({ response })),
          catchError(httpError => of(CourseDraftItemsActions.loadFailure({ httpError })))
        );
      })
    );
  });

  publishSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftActions.publishSuccess),
      map(() => CourseDraftItemsActions.load())
    );
  });

  /*************************************************************************
   * Update
   ************************************************************************/
  updateItemContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.updateContent),
      concatLatestFrom(() => this.store.select(CourseDraftNodesState.selectActionsMap)),
      tap(([{ key }, actions]) => {
        const saveContentActionId = "save_item_content";

        if (!actions[saveContentActionId]) {
          this.store.dispatch(CourseDraftNodesActions.addAction({
            id: saveContentActionId,
            action: {
              primary: true,
              label: $localize`Save Changes`,
              icon: "fa fa-save",
              onClick: () => this.store.dispatch(CourseDraftItemsActions.update({ key }))
            }
          }));
        }
      })
    );
  }, { dispatch: false });

  updateItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.update),
      concatLatestFrom(({ key }) => [
        this.store.select(CourseDraftState.selectKey),
        this.store.select(CourseDraftNodesState.selectCurrentKey),
        this.store.select(CourseDraftItemsState.selectItem(key))
      ]),
      mergeMap(([{ key }, courseDraftKey, nodeKey, item]) => {
        if (!courseDraftKey || !nodeKey || !item) {
          return of(CourseDraftItemsActions.updateFailure({}));
        }

        return this.courseDraftService.updateCourseDraftItem(courseDraftKey, nodeKey, key, item.content ?? "").pipe(
          map(response => CourseDraftItemsActions.updateSuccess({ update: { id: key, changes: response } })),
          catchError(httpError => of(CourseDraftItemsActions.updateFailure({ httpError })))
        );
      })
    );
  });

  updateItemSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.updateSuccess),
      tap(({ update }) => {
        this.messageService.add({ severity: "success", summary: $localize`Changes Saved` });
      }),
      map(CourseDraftNodesActions.clearActions)
    );
  });

  updateItemFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.updateFailure),
      tap(({ httpError }) => {
        if (httpError) {
          this.messageService.add({ severity: "error", summary: $localize`Error while Saving Changes`, detail: $localize`Something went wrong, please try again later.` });
        }
      })
    );
  }, { dispatch: false });


  /*************************************************************************
   * Upload
   ************************************************************************/
  uploadFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.uploadFile),
      concatLatestFrom(() => [
        this.store.select(CourseDraftState.selectKey),
        this.store.select(CourseDraftNodesState.selectCurrentKey)
      ]),
      mergeMap(([{ itemKey, file }, courseDraftKey, nodeKey]) => {
        if (!courseDraftKey || !nodeKey) {
          return of(CourseDraftItemsActions.uploadFileFailure({}));
        }

        return this.courseDraftService.uploadFileForItem(courseDraftKey, nodeKey, itemKey, file, undefined, undefined, 0, "events", true).pipe(
          map(event => {
            if (event.type === HttpEventType.Response && event.body) {
              return CourseDraftItemsActions.uploadFileSuccess({ response: event.body });
            } else if (event.type === HttpEventType.UploadProgress && event.total) {
              const progress = Math.round(100 * event.loaded / event.total);

              return CourseDraftItemsActions.uploadFileProgress({ progress });
            } else if (event.type === HttpEventType.Response && event.body) {
              return CourseDraftItemsActions.uploadFileSuccess({ response: event.body });
            }

            return CourseDraftItemsActions.uploadFileProgress({});
          }),
          catchError(httpError => of(CourseDraftItemsActions.uploadFileFailure({ httpError })))
        );
      })
    );
  });

  uploadFileSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.uploadFileSuccess),
      tap(() => {
        this.messageService.add({ severity: "success", summary: "Upload Successful", detail: "File uploaded successfully" });
      }),
      map(() => CourseDraftItemsActions.load())
    );
  });

  uploadFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.uploadFileFailure),
      tap(({ httpError }) => {
        if (httpError) {
          this.messageService.add({ severity: "error", summary: $localize`Upload Failed`, detail: httpError.message });
        }
      })
    );
  }, { dispatch: false });

  /*************************************************************************
   * Delete
   ************************************************************************/
  deleteFilePermission$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.deleteFilePermission),
      switchMap(({ filePermission }) => {
        return this.fileService.deleteFilePermission(filePermission.key).pipe(
          map(() => CourseDraftItemsActions.deleteFilePermissionSuccess({ deletedFilePermission: filePermission })),
          catchError(httpError => of(CourseDraftItemsActions.deleteFilePermissionFailure({ httpError })))
        );
      })
    );
  });

  deleteFilePermissionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.deleteFilePermissionSuccess),
      tap(({ deletedFilePermission }) => {
        this.messageService.add({ severity: "success", summary: $localize`File Deleted`, detail: deletedFilePermission.file.name });
      }),
      map(() => CourseDraftItemsActions.load())
    );
  });

  deleteFilePermissionFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDraftItemsActions.deleteFilePermissionFailure),
      tap(({ httpError }) => {
        if (httpError) {
          this.messageService.add({ severity: "error", summary: $localize`Could Not Delete File`, detail: httpError.message });
        }
      })
    );
  }, { dispatch: false });

}
