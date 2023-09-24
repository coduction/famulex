import { CommonModule }                        from "@angular/common";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { FilePermission }                      from "@famulex/shared/famulex-api-client";
import { VgBufferingModule }                   from "@videogular/ngx-videogular/buffering";
import { VgControlsModule }                    from "@videogular/ngx-videogular/controls";
import { VgCoreModule }                        from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule }                 from "@videogular/ngx-videogular/overlay-play";

@Component({
  selector: "ui-video-player",
  standalone: true,
  imports: [CommonModule, VgBufferingModule, VgControlsModule, VgCoreModule, VgOverlayPlayModule],
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VideoPlayerComponent {

  @Input({ required: true }) filePermissions: FilePermission[] = [];

  @Input() playerId = "video-player";

}
