import { Injectable }                      from "@angular/core";
import { MessageService }                  from "@coduction/primeng/api";
import { CourseDraftService, FileService } from "@famulex/shared/famulex-api-client";
import { Actions }                         from "@ngrx/effects";
import { Store }                           from "@ngrx/store";

@Injectable()
export class AnswerDraftEffects {

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
  // selectCourseDraftNode$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(CourseDraftNodesActions.selectNode),
  //     map(() => AnswerDraftActions.load())
  //   );
  // });
  //
  // loadCourseDraftItems$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.load),
  //     concatLatestFrom(() => [
  //       this.store.select(CourseDraftState.selectKey),
  //       this.store.select(CourseDraftNodesState.selectCurrentKey)
  //     ]),
  //     switchMap(([_, courseDraftKey, nodeKey]) => {
  //       if (!courseDraftKey || !nodeKey) {
  //         return of(AnswerDraftActions.loadFailure({}));
  //       }
  //
  //       return this.courseDraftService.loadCourseDraftItems(courseDraftKey, nodeKey).pipe(
  //         map(response => AnswerDraftActions.loadSuccess({ response })),
  //         catchError(httpError => of(AnswerDraftActions.loadFailure({ httpError })))
  //       );
  //     })
  //   );
  // });
  //
  // publishSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(CourseDraftActions.publishSuccess),
  //     map(() => AnswerDraftActions.load())
  //   );
  // });
  //
  // /*************************************************************************
  //  * Update
  //  ************************************************************************/
  // updateItemContent$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.updateContent),
  //     concatLatestFrom(() => this.store.select(CourseDraftNodesState.selectActionsMap)),
  //     tap(([{ key }, actions]) => {
  //       const saveContentActionId = "save_item_content";
  //
  //       if (!actions[saveContentActionId]) {
  //         this.store.dispatch(CourseDraftNodesActions.addAction({
  //           id: saveContentActionId,
  //           action: {
  //             primary: true,
  //             label: $localize`Save Changes`,
  //             icon: "fa fa-save",
  //             onClick: () => this.store.dispatch(AnswerDraftActions.update({ key }))
  //           }
  //         }));
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  // updateItem$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.update),
  //     concatLatestFrom(({ key }) => [
  //       this.store.select(CourseDraftState.selectKey),
  //       this.store.select(CourseDraftNodesState.selectCurrentKey),
  //       this.store.select(CourseDraftItemsState.selectItem(key))
  //     ]),
  //     mergeMap(([{ key }, courseDraftKey, nodeKey, item]) => {
  //       if (!courseDraftKey || !nodeKey || !item) {
  //         return of(AnswerDraftActions.updateFailure({}));
  //       }
  //
  //       return this.courseDraftService.updateCourseDraftItem(courseDraftKey, nodeKey, key, item.content ?? "").pipe(
  //         map(response => AnswerDraftActions.updateSuccess({ update: { id: key, changes: response } })),
  //         catchError(httpError => of(AnswerDraftActions.updateFailure({ httpError })))
  //       );
  //     })
  //   );
  // });
  //
  // updateItemSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.updateSuccess),
  //     tap(({ update }) => {
  //       this.messageService.add({ severity: "success", summary: $localize`Changes Saved` });
  //     }),
  //     map(CourseDraftNodesActions.clearActions)
  //   );
  // });
  //
  // updateItemFailure$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.updateFailure),
  //     tap(({ httpError }) => {
  //       if (httpError) {
  //         this.messageService.add({ severity: "error", summary: $localize`Error while Saving Changes`, detail: $localize`Something went wrong, please try again later.` });
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  //
  // /*************************************************************************
  //  * Upload
  //  ************************************************************************/
  // uploadFile$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.uploadFile),
  //     concatLatestFrom(() => [
  //       this.store.select(CourseDraftState.selectKey),
  //       this.store.select(CourseDraftNodesState.selectCurrentKey)
  //     ]),
  //     mergeMap(([{ itemKey, file }, courseDraftKey, nodeKey]) => {
  //       if (!courseDraftKey || !nodeKey) {
  //         return of(AnswerDraftActions.uploadFileFailure({}));
  //       }
  //
  //       return this.courseDraftService.uploadFileForItem(courseDraftKey, nodeKey, itemKey, file, undefined, undefined, 0, "events", true).pipe(
  //         map(event => {
  //           if (event.type === HttpEventType.Response && event.body) {
  //             return AnswerDraftActions.uploadFileSuccess({ response: event.body });
  //           } else if (event.type === HttpEventType.UploadProgress && event.total) {
  //             const progress = Math.round(100 * event.loaded / event.total);
  //
  //             return AnswerDraftActions.uploadFileProgress({ progress });
  //           } else if (event.type === HttpEventType.Response && event.body) {
  //             return AnswerDraftActions.uploadFileSuccess({ response: event.body });
  //           }
  //
  //           return AnswerDraftActions.uploadFileProgress({});
  //         }),
  //         catchError(httpError => of(AnswerDraftActions.uploadFileFailure({ httpError })))
  //       );
  //     })
  //   );
  // });
  //
  // uploadFileSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.uploadFileSuccess),
  //     tap(() => {
  //       this.messageService.add({ severity: "success", summary: "Upload Successful", detail: "File uploaded successfully" });
  //     }),
  //     map(() => AnswerDraftActions.load())
  //   );
  // });
  //
  // uploadFailure$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.uploadFileFailure),
  //     tap(({ httpError }) => {
  //       if (httpError) {
  //         this.messageService.add({ severity: "error", summary: $localize`Upload Failed`, detail: httpError.message });
  //       }
  //     })
  //   );
  // }, { dispatch: false });
  //
  // /*************************************************************************
  //  * Delete
  //  ************************************************************************/
  // deleteFilePermission$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.deleteFilePermission),
  //     switchMap(({ filePermission }) => {
  //       return this.fileService.deleteFilePermission(filePermission.key).pipe(
  //         map(() => AnswerDraftActions.deleteFilePermissionSuccess({ deletedFilePermission: filePermission })),
  //         catchError(httpError => of(AnswerDraftActions.deleteFilePermissionFailure({ httpError })))
  //       );
  //     })
  //   );
  // });
  //
  // deleteFilePermissionSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.deleteFilePermissionSuccess),
  //     tap(({ deletedFilePermission }) => {
  //       this.messageService.add({ severity: "success", summary: $localize`File Deleted`, detail: deletedFilePermission.file.name });
  //     }),
  //     map(() => AnswerDraftActions.load())
  //   );
  // });
  //
  // deleteFilePermissionFailure$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(AnswerDraftActions.deleteFilePermissionFailure),
  //     tap(({ httpError }) => {
  //       if (httpError) {
  //         this.messageService.add({ severity: "error", summary: $localize`Could Not Delete File`, detail: httpError.message });
  //       }
  //     })
  //   );
  // }, { dispatch: false });

}
