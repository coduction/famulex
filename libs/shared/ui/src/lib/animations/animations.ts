import { animate, keyframes, style, transition, trigger } from "@angular/animations";

export const FADE_AND_GROW = trigger("fadeAndGrow", [
  transition(":enter", [
    animate("300ms ease-out", keyframes([
        style({
          opacity: 0,
          width: 0,
          paddingLeft: 0,
          paddingRight: 0,
          whiteSpace: "nowrap",
          scale: 0
        }),
        style({
          width: "*",
          paddingLeft: "*",
          paddingRight: "*"
        }),
        style({
          opacity: 1,
          scale: 1
        })
      ])
    )
  ]),
  transition(":leave", [
    animate("300ms ease-in", keyframes([
        style({
          opacity: 1,
          scale: 1,
          width: "*",
          paddingLeft: "*",
          paddingRight: "*",
          whiteSpace: "nowrap"
        }),
        style({
          scale: 0,
          opacity: 0
        }),
        style({
          width: 0,
          paddingLeft: 0,
          paddingRight: 0
        })
      ])
    )
  ])
]);
