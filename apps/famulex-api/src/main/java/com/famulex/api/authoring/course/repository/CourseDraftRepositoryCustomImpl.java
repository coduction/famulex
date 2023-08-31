package com.famulex.api.authoring.course.repository;

import com.famulex.api.authoring.course.api.request.CourseDraftFilter;
import com.famulex.api.core.util.DbHelper;
import com.famulex.api.core.util.TextHelper;
import com.famulex.api.jooq.tables.FxUser;
import com.famulex.api.jooq.tables.records.FxCourseDraftRecord;
import com.famulex.api.membership.model.CourseRole;
import lombok.RequiredArgsConstructor;
import org.hibernate.internal.util.StringHelper;
import org.jooq.Record;
import org.jooq.*;
import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;

import static com.famulex.api.jooq.tables.FxCourseDraft.FX_COURSE_DRAFT;
import static com.famulex.api.jooq.tables.FxCourseMembership.FX_COURSE_MEMBERSHIP;
import static com.famulex.api.jooq.tables.FxGroup.FX_GROUP;
import static com.famulex.api.jooq.tables.FxGroupMembership.FX_GROUP_MEMBERSHIP;
import static com.famulex.api.jooq.tables.FxUser.FX_USER;

/**
 * Class UserRepositoryCustomImpl
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 24.05.23
 */
@RequiredArgsConstructor
public class CourseDraftRepositoryCustomImpl implements CourseDraftRepositoryCustom {

  private final DSLContext dsl;

  @Override
  public Page<FxCourseDraftRecord> searchCourseDrafts(CourseDraftFilter filter, Pageable pageable) {
    var USER_ALIAS = FX_USER.as("user_group_member");

    var query = dsl.select()
      .distinctOn(distinctFields(filter, pageable))
      .from(fromClause(filter, USER_ALIAS))
      .where(whereClause(filter, USER_ALIAS));

    var count = dsl.fetchCount(query);

    var result = query
      .orderBy(orderByClause(filter, pageable))
      .offset(pageable.getOffset())
      .limit(pageable.getPageSize())
      .fetch()
      .into(FX_COURSE_DRAFT);

    return new PageImpl<>(result, pageable, count);
  }


  private Collection<? extends SelectFieldOrAsterisk> distinctFields(CourseDraftFilter filter, Pageable pageable) {
    if (filter.isMyCourses()) {
      return DbHelper.getDistinctFields(pageable.getSort(), FX_COURSE_DRAFT);
    }

    return List.of();
  }

  private Table<? extends Record> fromClause(CourseDraftFilter filter, FxUser groupMember) {
    if (filter.isMyCourses()) {
      return FX_COURSE_DRAFT.innerJoin(FX_COURSE_MEMBERSHIP).on(FX_COURSE_MEMBERSHIP.FK_COURSE_DRAFT.eq(FX_COURSE_DRAFT.ID))
        .leftOuterJoin(FX_USER).on(FX_USER.ID.eq(FX_COURSE_MEMBERSHIP.FK_USER))
        .leftOuterJoin(FX_GROUP).on(FX_GROUP.ID.eq(FX_COURSE_MEMBERSHIP.FK_GROUP))
        .leftOuterJoin(FX_GROUP_MEMBERSHIP).on(FX_GROUP_MEMBERSHIP.FK_GROUP.eq(FX_GROUP.ID))
        .leftOuterJoin(groupMember).on(groupMember.ID.eq(FX_GROUP_MEMBERSHIP.FK_USER));
    }

    return FX_COURSE_DRAFT;
  }

  private Condition whereClause(CourseDraftFilter filter, FxUser groupMember) {
    var condition = DSL.noCondition();

    if (filter.isMyCourses()) {
      var authoringAccess = DSL.condition(FX_COURSE_MEMBERSHIP.ROLE.in(CourseRole.EDITOR.name(), CourseRole.OWNER.name()));

      var directMemberCondition = DSL.condition(FX_USER.KEY.eq(filter.getOwnerKey()))
        .and(FX_COURSE_MEMBERSHIP.VALID_FROM.isNull()
          .or(FX_COURSE_MEMBERSHIP.VALID_FROM.lessOrEqual(DSL.currentOffsetDateTime())))
        .and(FX_COURSE_MEMBERSHIP.VALID_UNTIL.isNull()
          .or(FX_COURSE_MEMBERSHIP.VALID_UNTIL.greaterOrEqual(DSL.currentOffsetDateTime())));


      var groupMemberCondition = DSL.condition(groupMember.KEY.eq(filter.getOwnerKey()))
        .and(FX_GROUP_MEMBERSHIP.VALID_FROM.isNull()
          .or(FX_GROUP_MEMBERSHIP.VALID_FROM.lessOrEqual(DSL.currentOffsetDateTime())))
        .and(FX_GROUP_MEMBERSHIP.VALID_UNTIL.isNull()
          .or(FX_GROUP_MEMBERSHIP.VALID_UNTIL.greaterOrEqual(DSL.currentOffsetDateTime())))
        .and(FX_COURSE_MEMBERSHIP.VALID_FROM.isNull()
          .or(FX_COURSE_MEMBERSHIP.VALID_FROM.lessOrEqual(DSL.currentOffsetDateTime())))
        .and(FX_COURSE_MEMBERSHIP.VALID_UNTIL.isNull()
          .or(FX_COURSE_MEMBERSHIP.VALID_UNTIL.greaterOrEqual(DSL.currentOffsetDateTime())));

      condition = condition.and(authoringAccess).and(directMemberCondition.or(groupMemberCondition));
    }

    if (!StringHelper.isBlank(filter.getSearch())) {
      for (var term : TextHelper.prepareFullTextSearch(filter.getSearch())) {
        var termCondition = DSL
          .or(FX_COURSE_DRAFT.KEY.cast(String.class).containsIgnoreCase(term))
          .or(FX_COURSE_DRAFT.TITLE.containsIgnoreCase(term))
          .or(FX_COURSE_DRAFT.DESCRIPTION.containsIgnoreCase(term))
          .or(FX_COURSE_DRAFT.AUTHOR.containsIgnoreCase(term));

        condition = condition.and(termCondition);
      }
    }

    if (!filter.getStatuses().isEmpty()) {
      condition = condition.and(FX_COURSE_DRAFT.STATUS.in(filter.getStatuses()));
    }

    return condition;
  }

  private Collection<SortField<?>> orderByClause(CourseDraftFilter filter, Pageable pageable) {
    return DbHelper.getSortFields(pageable.getSort(), FX_COURSE_DRAFT, filter.isMyCourses());
  }
}
