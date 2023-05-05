package com.famulex.api.group;

import com.famulex.api.group.api.GroupMapper;
import com.famulex.api.group.api.GroupRequest;
import com.famulex.api.group.api.GroupResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

/**
 * Class GroupController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@RestController
@RequestMapping("/groups")
@Tag(name = "Group")
@RequiredArgsConstructor
public class GroupController {

  private final GroupService groupService;
  private final GroupMapper groupMapper;

  @GetMapping
  @Operation(summary = "Load groups")
  public Page<GroupResponse> loadGroups(@ParameterObject Pageable pagination) {
    return groupService.loadGroups(pagination).map(groupMapper::toGroupResponse);
  }

  @GetMapping("/{key}")
  @Operation(summary = "Load a group by id")
  public Optional<GroupResponse> loadGroup(@PathVariable UUID key) {
    return groupService.loadGroup(key).map(groupMapper::toGroupResponse);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Create a new group")
  public GroupResponse createGroup(@RequestBody GroupRequest groupRequest) {
    return groupMapper.toGroupResponse(groupService.createGroup(groupRequest));
  }

  @PutMapping("/{key}")
  @Operation(summary = "Update an existing group")
  public Optional<GroupResponse> updateGroup(@PathVariable UUID key, @RequestBody GroupRequest groupRequest) {
    return groupService.updateGroup(key, groupRequest).map(groupMapper::toGroupResponse);
  }

  @DeleteMapping("/{key}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Delete a group")
  public void deleteGroup(@PathVariable UUID key) {
    groupService.deleteGroup(key);
  }
}
