package com.famulex.api.core.config;

import com.famulex.api.security.model.Right;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Class KeycloakAuthoritiesExtractor
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.02.23
 */
public class KeycloakAuthoritiesExtractor implements Converter<Jwt, Collection<GrantedAuthority>> {

    private final static List<String> VALUES = new ArrayList<>();

    static {
        for (Right right : Right.values()) {
            VALUES.add(right.toString());
        }
    }

    @Override
    public Collection<GrantedAuthority> convert(Jwt source) {
        if (!source.hasClaim("realm_access")) {
            return null;
        }

        // Load array "roles" from claim "realm_access"
        ArrayList<String> roles = new ArrayList<>(Arrays.asList(source
            .getClaimAsMap("realm_access")
            .get("roles")
            .toString()
            .replace("[", "")
            .replace("]", "")
            .replace(" ", "")
            .split(",")));

        // Filter by available roles and rights
        roles.retainAll(VALUES);

        return roles.stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
    }
}
