package com.famulex.api.core.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.io.IOException;
import java.util.Optional;

/**
 * Class RestResponseExceptionHandler
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 09.10.22
 */

@ControllerAdvice
@SecurityScheme(
    type = SecuritySchemeType.OAUTH2,
    name = "Keycloak",
    in = SecuritySchemeIn.HEADER,
    bearerFormat = "Bearer ",
    flows = @OAuthFlows(password = @OAuthFlow(tokenUrl = "${keycloak.auth-server-url}/realms/${keycloak.realm}/protocol/openid-connect/token")))
@OpenAPIDefinition(
    servers = {@Server(url = "${server.servlet.context-path}", description = "Famulex")},
    info = @Info(title = "Famulex API", version = "0.0.1"),
    security = @SecurityRequirement(name = "Keycloak"))
public class ApiConfig implements ResponseBodyAdvice {

    static {
        // Convert all enums to types by default
        io.swagger.v3.core.jackson.ModelResolver.enumsAsRef = true;
    }

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return returnType.getParameterType().equals(Optional.class);
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        if (returnType.getParameterType().equals(Optional.class)) {
            return ((Optional<?>) body).orElseThrow(() -> new EntityNotFoundException("Entity not found: " + request.getURI()));
        }
        return body;
    }

    // Return 404 if entity not found
    @ExceptionHandler(EntityNotFoundException.class)
    public void handleEntityNotFoundException(EntityNotFoundException exception, ServletWebRequest webRequest) throws IOException {
        webRequest.getResponse().sendError(HttpStatus.NOT_FOUND.value(), exception.getMessage());
    }

    // Return 400 when Hibernate can't persist entities because of missing attributes
    @ExceptionHandler(ConstraintViolationException.class)
    public void handleConstraintViolationException(ConstraintViolationException exception, ServletWebRequest webRequest) throws IOException {
        webRequest.getResponse().sendError(HttpStatus.BAD_REQUEST.value(), exception.getMessage());
    }


}
