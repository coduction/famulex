package com.famulex.api.group;

import com.famulex.api.group.api.GroupRequest;
import com.famulex.api.group.model.Group;
import com.famulex.api.group.repository.GroupRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * Class GroupService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Service
@RequiredArgsConstructor
public class GroupService {

  private final GroupRepository groupRepository;

  public Page<Group> loadGroups(Pageable pagination) {
    return groupRepository.findAll(pagination);
  }

  public Optional<Group> loadGroup(UUID key) {
    return groupRepository.findByKey(key);
  }

  public Group createGroup(GroupRequest groupInput) {
    Group group = Group.builder()
      .type(groupInput.getType())
      .name(groupInput.getName())
      .description(groupInput.getDescription())
      .build();

    return groupRepository.save(group);
  }

  public Optional<Group> updateGroup(UUID key, GroupRequest groupInput) {
    Optional<Group> groupOptional = groupRepository.findByKey(key);

    if (groupOptional.isPresent()) {
      Group group = groupOptional.get();

      group.setType(groupInput.getType());    // TODO Conversion of groups need to be handled
      group.setName(groupInput.getName());
      group.setDescription(groupInput.getDescription());

      return Optional.of(groupRepository.save(group));
    }

    return groupOptional;
  }

  public void deleteGroup(UUID key) {
    Group group = groupRepository.findByKey(key).orElseThrow(() -> new EntityNotFoundException("No group found: " + key));

    groupRepository.delete(group);
  }


}
