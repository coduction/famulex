package com.famulex.api.core.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;


/**
 * Class SecurityConfig
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 06.10.22
 */
@Log4j2
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    private final ApiKeyFilter apiKeyFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Enable CORS and disable CSRF
        http.csrf().disable().cors();

        // TODO Find out why this is necessary
        // http.headers().frameOptions().sameOrigin();

        // Disable usage of any sessions
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Allow certain paths without authentication
        http.authorizeHttpRequests()
            .requestMatchers("/docs").permitAll()
            .requestMatchers("/docs/ui").permitAll()
            .requestMatchers("/docs/swagger-ui/*").permitAll()
            .requestMatchers("/docs/swagger-config").permitAll()
            .requestMatchers("/ws").permitAll()
            .requestMatchers("/files/*").permitAll();

        // On all other paths authentication is required
        http.authorizeHttpRequests()
            .anyRequest().authenticated();

        // Add OAuth2
        http.oauth2Client()
            .and()
            .oauth2ResourceServer().jwt(jwt -> jwt.jwtAuthenticationConverter(grantedAuthoritiesExtractor()));

        // Add an extra filter to allow keycloak informing
        http.addFilterBefore(apiKeyFilter, AbstractPreAuthenticatedProcessingFilter.class);

        return http.build();
    }

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder authBuilder) {
//        SimpleAuthorityMapper mapper = new SimpleAuthorityMapper();
//        mapper.setPrefix("");
//
//        KeycloakAuthenticationProvider authProvider = super.keycloakAuthenticationProvider();
//        authProvider.setGrantedAuthoritiesMapper(mapper);
//
//        authBuilder.authenticationProvider(authProvider);
//    }

    @Bean
    public GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults(""); // Remove the ROLE_ prefix
    }

    @Bean
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        // Since we are not using session based authentication but bearer tokens only
        return new NullAuthenticatedSessionStrategy();
    }

    private Converter<Jwt, AbstractAuthenticationToken> grantedAuthoritiesExtractor() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakAuthoritiesExtractor());

        return converter;
    }
}
