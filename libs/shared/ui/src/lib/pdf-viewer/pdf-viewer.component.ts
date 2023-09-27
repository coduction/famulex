import { CommonModule }                                  from "@angular/common";
import { Component, Input }                              from "@angular/core";
import { NgxExtendedPdfViewerModule, pdfDefaultOptions } from "ngx-extended-pdf-viewer";

@Component({
  selector: "ui-pdf-viewer",
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"]
})
export class PdfViewerComponent {

  pdfDefaultOptions = pdfDefaultOptions;

  @Input() src?: string;

  constructor() {
    pdfDefaultOptions.assetsFolder = "assets/pdf/assets";
  }


}
