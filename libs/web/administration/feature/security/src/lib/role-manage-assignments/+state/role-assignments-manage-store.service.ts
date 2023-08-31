import { Injectable }                                                                                                           from "@angular/core";
import { MessageService }                                                                                                       from "@coduction/primeng/api";
import { MembershipType, PageRoleAssignment, Role, RoleAssignment, RoleAssignmentRequestCreate, SecurityService, Status, User } from "@famulex/shared/famulex-api-client";
import { LoadDataEvent, TableMetaData }                                                                                         from "@famulex/web/shared/table";
import { ComponentStore }                                                                                                       from "@ngrx/component-store";
import { concatLatestFrom }                                                                                                     from "@ngrx/effects";
import { produce }                                                                                                              from "immer";
import { catchError, EMPTY, forkJoin, map, mergeMap, Observable, of, switchMap, tap }                                           from "rxjs";

export interface RoleAssignmentsManageState {
  role: Role | undefined;
  type: MembershipType | undefined;

  loading: boolean;
  actionInProgress: boolean;

  pageIndex: number;
  pageSize: number;
  sortedBy: string[];
  search: string | undefined;

  page: PageRoleAssignment | undefined;
}

const initialState: RoleAssignmentsManageState = {
  role: undefined,
  type: undefined,

  loading: false,
  actionInProgress: false,

  pageIndex: 0,
  pageSize: 5,
  sortedBy: ["firstName,asc"],
  search: undefined,

  page: undefined
};

@Injectable()
export class RoleAssignmentsManageStore extends ComponentStore<RoleAssignmentsManageState> {

  readonly loading$ = this.select(state => state.loading);
  readonly role$ = this.select(state => state.role);
  readonly type$ = this.select(state => state.type);
  readonly assignments$ = this.select(state => state.page?.content);
  readonly tableMetaData$ = this.select(state => ({
    loading: state.loading,
    totalEntries: state.page?.totalElements || null,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    sortedBy: state.sortedBy,
    search: state.search,
    actionInProgress: state.actionInProgress
  } as TableMetaData));


  constructor(private securityService: SecurityService,
              private messageService: MessageService) {
    super(initialState);
  }

  setRoleAndType = this.updater((state, params: { role: Role, type: MembershipType }) => {
    return produce(state, draft => {
      draft.role = params.role;
      draft.type = params.type;
    });
  });

  loadAssignments = this.effect((loadDataEvent$: Observable<LoadDataEvent | void>) => {
    return loadDataEvent$.pipe(
      tap(event => {
        if (event) {
          this._updateTableMetaData(event);
        }
      }),
      concatLatestFrom(() => [this.tableMetaData$, this.role$, this.type$]),
      switchMap(([_, metaData, role, type]) => {
        if (!role || !type) {
          throw new Error("Role and type must be set before loading assignments!");
        }

        return this.securityService.loadRoleAssignments(
          role.key,
          type,
          metaData.pageIndex, metaData.pageSize, metaData.sortedBy,
          metaData.search)
          .pipe(
            tap(page => this._setAssignments(page)),
            catchError(error => {
              console.error(error);
              return EMPTY;
            })
          );
      })
    );
  });

  removeAssignment = this.effect((assignment$: Observable<RoleAssignment>) => {
    return assignment$.pipe(
      mergeMap(assignment => {
          return this.securityService.deleteRoleAssignment(assignment.key).pipe(
            tap(() => {
              this.messageService.add({
                severity: "success",
                summary: $localize`Assignment Removed`,
                detail: $localize`The assignment was successfully removed.`
              });
            }),
            map(() => this.loadAssignments()),
            catchError(error => {
                console.error(error);

                this.messageService.add({
                  severity: "error",
                  summary: $localize`Error while Removing Assignment`,
                  detail: $localize`Could not remove assignment. Please try again later.`
                });

                return EMPTY;
              }
            )
          );
        }
      ));
  });

  removeAssignments = this.effect((keys$: Observable<string[]>) => {
    return keys$.pipe(
      mergeMap(keys => {
        const deletedKeys: string[] = [];
        const errorKeys: string[] = [];

        const requests = keys.map(key => {
          return this.securityService.deleteRoleAssignment(key).pipe(
            tap(() => deletedKeys.push(key)),
            catchError(error => {
              errorKeys.push(key);
              return of(error);
            })
          );
        });

        return forkJoin(requests).pipe(
          tap(() => {
            if (deletedKeys.length > 0) {
              this.messageService.add({
                severity: "success",
                summary: $localize`Assignments Removed`,
                detail: $localize`${deletedKeys.length} assignments were removed.`
              });
            }

            if (errorKeys.length > 0) {
              this.messageService.add({
                severity: "error",
                summary: $localize`Error while Removing Assignments`,
                detail: $localize`Could not remove ${errorKeys.length} assignments. Please try again later.`
              });
            }
          }),
          map(() => this.loadAssignments())
        );
      })
    );
  });

  addUser = this.effect((user$: Observable<User>) => {
    return user$.pipe(
      concatLatestFrom(() => this.role$),
      mergeMap(([user, role]) => {
        if (!role) {
          throw new Error("Role must be set before adding user!");
        }

        const request: RoleAssignmentRequestCreate = {
          roleKey: role.key,
          userKey: user.key,
          type: MembershipType.User,
          status: Status.Active
        };

        return this.securityService.createRoleAssignment(request).pipe(
          tap(() => {
            this.messageService.add({
              severity: "success",
              summary: $localize`User Added`,
              detail: $localize`The user was added successfully.`
            });
          }),
          map(() => this.loadAssignments()),
          catchError(error => {
            console.error(error);

            this.messageService.add({
              severity: "error",
              summary: $localize`Error while Adding User`,
              detail: $localize`Could not add user. Please try again later.`
            });

            return EMPTY;
          })
        );
      })
    );
  });

  addUsers = this.effect((keys$: Observable<string[]>) => {
    return keys$.pipe(
      concatLatestFrom(() => this.role$),
      mergeMap(([keys, role]) => {
        if (!role) {
          throw new Error("Role must be set before adding users!");
        }

        const addedKeys: string[] = [];
        const errorKeys: string[] = [];

        const requests = keys.map(key => {
          const request: RoleAssignmentRequestCreate = {
            roleKey: role.key,
            userKey: key,
            type: MembershipType.User,
            status: Status.Active
          };

          return this.securityService.createRoleAssignment(request).pipe(
            tap(() => addedKeys.push(key)),
            catchError(error => {
              errorKeys.push(key);
              return of(error);
            })
          );
        });

        return forkJoin(requests).pipe(
          tap(() => {
            if (addedKeys.length > 0) {
              this.messageService.add({
                severity: "success",
                summary: $localize`Assignments Created`,
                detail: $localize`${addedKeys.length} assignments were created.`
              });
            }

            if (errorKeys.length > 0) {
              this.messageService.add({
                severity: "error",
                summary: $localize`Error while Creating Assignments`,
                detail: $localize`Could not create ${errorKeys.length} assignments. Please try again later.`
              });
            }
          }),
          map(() => this.loadAssignments())
        );
      })
    );
  });

  private _setAssignments = this.updater((state, page: PageRoleAssignment) => {
    return produce(state, draft => {
      draft.page = page;
      draft.loading = false;
    });
  });

  private _updateTableMetaData = this.updater((state, loadDataEvent: LoadDataEvent) => {
    return produce(state, draft => {
      draft.loading = true;
      draft.pageIndex = loadDataEvent.pageIndex;
      draft.pageSize = loadDataEvent.pageSize;
      draft.sortedBy = loadDataEvent.sortedBy;
      draft.search = loadDataEvent.search;
    });
  });
}
