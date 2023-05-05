package com.famulex.api.websocket;

import com.famulex.api.user.UserService;
import com.famulex.api.websocket.model.WebSocketMessage;
import com.famulex.api.websocket.model.WebsocketMessageType;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.UUID;

/**
 * Class WebsocketController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 03.11.22
 */
@Tag(name = "Websocket")
@RequiredArgsConstructor
@RestController
public class WebsocketController {

  private final SimpMessagingTemplate messagingTemplate;
  private final UserService userService;

  @MessageMapping("/system/hello-world")
  @SendTo("/system/hello-world")
  public WebSocketMessage helloWorld(String name) {
    return WebSocketMessage.builder()
      .type(WebsocketMessageType.SYSTEM_HELLO_WORLD)
      .content("Hello " + name + "!")
      .build();
  }

  @MessageMapping("/system/hello-user")
  @SendToUser("/system/hello-user")
  public WebSocketMessage helloUser(@Payload String message, Principal user) {
    return WebSocketMessage.builder()
      .type(WebsocketMessageType.SYSTEM_HELLO_USER)
      .content("Hello " + user.getName() + "!")
      .build();
  }


  @MessageMapping("/profile/latest-activity")
  public void updateLatestActivity(Principal user) {
    UUID userKey = UUID.fromString(user.getName());

    userService.updateLatestActivity(userKey);
  }

  @GetMapping("system/messaging/types")
  public WebsocketMessageType[] getMessageTypes() {
    return WebsocketMessageType.values();
  }
}
