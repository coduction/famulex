package com.famulex.api.websocket.model;

import lombok.*;

/**
 * Class WebSocketMessage
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 03.11.22
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {

    private WebsocketMessageType type;
    private Object content;

}
