package com.famulex.api.security.repository;

import com.famulex.api.core.model.MembershipType;
import com.famulex.api.core.util.DbHelper;
import com.famulex.api.core.util.TextHelper;
import com.famulex.api.security.api.RoleMapper;
import com.famulex.api.security.api.response.RoleAssignmentResponse;
import lombok.RequiredArgsConstructor;
import org.hibernate.internal.util.StringHelper;
import org.jooq.DSLContext;
import org.jooq.SortField;
import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

import static com.famulex.api.jooq.tables.FxGroup.FX_GROUP;
import static com.famulex.api.jooq.tables.FxRole.FX_ROLE;
import static com.famulex.api.jooq.tables.FxRoleAssignment.FX_ROLE_ASSIGNMENT;
import static com.famulex.api.jooq.tables.FxUser.FX_USER;


/**
 * Class RoleRepositoryCustomImpl
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.06.23
 */
@RequiredArgsConstructor
public class RoleAssignmentRepositoryCustomImpl implements RoleAssignmentRepositoryCustom {

  private final DSLContext dsl;

  private final RoleMapper roleMapper;

  @Override
  public Page<RoleAssignmentResponse> searchAssignments(UUID roleKey, MembershipType type, String search, Pageable pageable) {
    var condition = DSL.condition(FX_ROLE.KEY.eq(roleKey));

    if (type != null) {
      condition = condition.and(FX_ROLE_ASSIGNMENT.TYPE.eq(type.name()));
    }

    if (!StringHelper.isBlank(search)) {
      for (var term : TextHelper.prepareFullTextSearch(search)) {
        var termCondition = DSL
          .or(FX_ROLE_ASSIGNMENT.KEY.cast(String.class).containsIgnoreCase(term))
          .or(FX_ROLE_ASSIGNMENT.STATUS.containsIgnoreCase(term))

          .or(FX_USER.KEY.cast(String.class).containsIgnoreCase(term))
          .or(FX_USER.USERNAME.containsIgnoreCase(term))
          .or(FX_USER.FIRST_NAME.containsIgnoreCase(term))
          .or(FX_USER.LAST_NAME.containsIgnoreCase(term))
          .or(FX_USER.EMAIL.containsIgnoreCase(term))

          .or(FX_GROUP.KEY.cast(String.class).containsIgnoreCase(term))
          .or(FX_GROUP.NAME.containsIgnoreCase(term))
          .or(FX_GROUP.DESCRIPTION.containsIgnoreCase(term));

        condition = condition.and(termCondition);
      }
    }

    var result = dsl.select()
      .from(FX_ROLE_ASSIGNMENT
        .join(FX_ROLE).on(FX_ROLE_ASSIGNMENT.FK_ROLE.eq(FX_ROLE.ID))
        .leftJoin(FX_USER).on(FX_ROLE_ASSIGNMENT.FK_USER.eq(FX_USER.ID))
        .leftJoin(FX_GROUP).on(FX_ROLE_ASSIGNMENT.FK_GROUP.eq(FX_GROUP.ID))
      )
      .where(condition)
      .orderBy(determineAssignmentOrder(type, pageable.getSort()))
      .offset(pageable.getOffset())
      .limit(pageable.getPageSize())
      .fetch();

    var assignments = result.into(FX_ROLE_ASSIGNMENT);
    var roles = result.into(FX_ROLE);
    var users = result.into(FX_USER);
    var groups = result.into(FX_GROUP);

    var count = dsl.fetchCount(
      dsl.select(FX_ROLE_ASSIGNMENT.ID)
        .from(FX_ROLE_ASSIGNMENT
          .join(FX_ROLE).on(FX_ROLE_ASSIGNMENT.FK_ROLE.eq(FX_ROLE.ID))
          .leftJoin(FX_USER).on(FX_ROLE_ASSIGNMENT.FK_USER.eq(FX_USER.ID))
          .leftJoin(FX_GROUP).on(FX_ROLE_ASSIGNMENT.FK_GROUP.eq(FX_GROUP.ID))
        )
        .where(condition)
    );

    var pageContent = new ArrayList<RoleAssignmentResponse>();

    for (int i = 0; i < assignments.size(); i++) {
      pageContent.add(roleMapper.toRoleAssignmentResponse(assignments.get(i), roles.get(i), users.get(i), groups.get(i)));
    }

    return new PageImpl<>(pageContent, pageable, count);
  }

  private Collection<SortField<?>> determineAssignmentOrder(MembershipType type, Sort sort) {
    if (type == MembershipType.USER) {
      return DbHelper.getSortFields(sort, FX_USER);
    } else if (type == MembershipType.GROUP) {
      return DbHelper.getSortFields(sort, FX_GROUP);
    } else {
      return DbHelper.getSortFields(sort, FX_ROLE_ASSIGNMENT);
    }
  }
}
