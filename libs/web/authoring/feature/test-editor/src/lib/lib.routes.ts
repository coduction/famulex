import { Route }                                                                                                               from "@angular/router";
import { Right }                                                                                                               from "@famulex/shared/famulex-api-client";
import { AuthGuard }                                                                                                           from "@famulex/shared/security/util";
import { AnswerDraftEffects, AnswerDraftsState, QuestionDraftEffects, QuestionDraftsState, TestDraftEffects, TestDraftsState } from "@famulex/web/authoring/data-access/test-draft-editor-state";
import { MainLayoutComponent }                                                                                                 from "@famulex/web/shared/layout";
import { provideEffects }                                                                                                      from "@ngrx/effects";
import { provideState }                                                                                                        from "@ngrx/store";
import { TestDraftContentComponent }                                                                                           from "./test-draft-content/test-draft-content.component";
import { TestDraftEditorComponent }                                                                                            from "./test-draft-editor/test-draft-editor.component";
import { testDraftStateGuard }                                                                                                 from "./test-draft-editor/test-draft-state.guard";
import { TestDraftListComponent }                                                                                              from "./test-draft-list/test-draft-list.component";
import { TestDraftNodeContentComponent }                                                                                       from "./test-draft-node-content/test-draft-node-content.component";

export const testDraftEditorRoutes: Route[] = [{
  path: "",
  component: MainLayoutComponent,
  canActivate: [AuthGuard],
  data: {
    rights: [Right.ManageTests, Right.CreateTests]
  },
  providers: [
    provideState(TestDraftsState),
    provideEffects(TestDraftEffects)
  ],
  children: [
    {
      path: "",
      component: TestDraftListComponent
    },
    {
      path: ":testDraftKey",
      component: TestDraftEditorComponent,
      providers: [
        provideState(QuestionDraftsState),
        provideState(AnswerDraftsState),
        provideEffects(QuestionDraftEffects),
        provideEffects(AnswerDraftEffects)
      ],
      canActivate: [testDraftStateGuard],
      children: [
        {
          path: "content",
          component: TestDraftContentComponent,
          children: [
            {
              path: ":nodeKey",
              component: TestDraftNodeContentComponent
            },
            {
              path: "**",
              children: []
            }
          ]
        },
        {
          path: "configuration",
          component: TestDraftContentComponent
        },
        {
          path: "**",
          redirectTo: "content"
        }
      ]
    }
  ]
}];
