package com.famulex.api.websocket.config;

import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Class WebsocketJwtInterceptor
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 04.11.22
 */
public final class WebsocketJwtInterceptor implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Value("${authority.jwt.claim}")
    private String authoritiesClaimName;
    @Value("${authority.jwt.claim.identifier}")
    private String authoritiesIdentifier;

    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();

        for (String authority : this.getAuthorities(jwt)) {
            grantedAuthorities.add(new SimpleGrantedAuthority(authority));
        }

        return grantedAuthorities;
    }

    private Collection<String> getAuthorities(Jwt jwt) {
        try {
            Object authorities = jwt.getClaim(authoritiesClaimName);
            JsonArray rights = ((JsonObject) authorities).get(authoritiesIdentifier).getAsJsonArray();

            ArrayList<String> result = new ArrayList<>();

            rights.forEach(right -> result.add(right.getAsString()));
            return result;
        } catch (Exception exception) {
            return new ArrayList<>();
        }
    }

}
