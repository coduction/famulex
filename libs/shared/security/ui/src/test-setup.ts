import "@angular/localize/init";
import "jest-preset-angular/setup-jest";
import { TextEncoder } from "util";

global.TextEncoder = TextEncoder;
