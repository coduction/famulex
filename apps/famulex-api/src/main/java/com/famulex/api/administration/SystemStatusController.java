package com.famulex.api.administration;

import com.famulex.api.security.model.Rights;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Class SystemStatusController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.10.22
 */

@Tag(name = "SystemStatus")
@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping("/system")
public class SystemStatusController {

    @Secured(Rights.MANAGE_USERS)
    @GetMapping(value = "/hello-world", produces = MediaType.TEXT_PLAIN_VALUE)
    public String helloWorld(@RequestParam(defaultValue = "World")
                             @Size(min = 3, max = 20) String name) {
        return "Hello " + name + "!";
    }

}
