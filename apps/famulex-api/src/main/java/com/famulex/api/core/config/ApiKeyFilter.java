package com.famulex.api.core.config;

import com.famulex.api.security.model.Rights;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.internal.util.StringHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Class ApiKeyFilter
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 09.11.22
 */
@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    private final RequestMatcher userSyncMatcher = new AntPathRequestMatcher("/users/sync", HttpMethod.POST.name());
    private final RequestMatcher securitySyncMatcher = new AntPathRequestMatcher("/security/sync", HttpMethod.POST.name());

    @Value("${api.key.header}")
    private String apiKeyHeader;
    @Value("${api.key}")
    private String apiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

        final String providedKey = request.getHeader(apiKeyHeader);

        if (StringHelper.isBlank(providedKey) || !providedKey.equals(apiKey)) {
            chain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(null, null, List.of(new SimpleGrantedAuthority(Rights.SYNC_KEYCLOAK)));

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !(userSyncMatcher.matches(request) || securitySyncMatcher.matches(request));
    }
}
