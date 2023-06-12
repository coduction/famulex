import { animate, keyframes, style, transition, trigger } from "@angular/animations";

export const FADE_AND_SCALE_X = trigger("fadeAndScaleX", [
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

export const FADE_AND_GROW_Y = trigger("fadeAndGrowY", [
  transition(":enter", [
    animate("300ms ease-out", keyframes([
        style({
          opacity: 0,
          height: 0
        }),
        style({
          height: "*"
        }),
        style({
          opacity: 1
        })
      ])
    )
  ]),
  transition(":leave", [
    animate("300ms ease-in", keyframes([
        style({
          opacity: 1,
          height: "*"
        }),
        style({
          opacity: 0
        }),
        style({
          height: 0
        })
      ])
    )
  ])
]);

export const FADE_IN_OUT = trigger("fadeInOut", [
  transition(":enter", [
    animate("300ms ease-in", keyframes([
        style({
          opacity: 0
        }),
        style({
          opacity: 1
        })
      ])
    )
  ]),
  transition(":leave", [
    animate("200ms ease-in", keyframes([
        style({
          opacity: 1
        }),
        style({
          opacity: 0
        })
      ])
    )
  ])
]);
