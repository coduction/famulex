package com.famulex.api.security.repository;

import com.famulex.api.core.util.DbHelper;
import com.famulex.api.core.util.TextHelper;
import com.famulex.api.jooq.tables.records.FxRoleRecord;
import lombok.RequiredArgsConstructor;
import org.hibernate.internal.util.StringHelper;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import static com.famulex.api.jooq.tables.FxRole.FX_ROLE;


/**
 * Class RoleRepositoryCustomImpl
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.06.23
 */
@RequiredArgsConstructor
public class RoleRepositoryCustomImpl implements RoleRepositoryCustom {

  private final DSLContext dsl;

  @Override
  public Page<FxRoleRecord> search(String search, Pageable pageable) {
    var condition = DSL.noCondition();

    if (!StringHelper.isBlank(search)) {
      for (var term : TextHelper.prepareFullTextSearch(search)) {
        var termCondition = DSL
          .or(FX_ROLE.KEY.cast(String.class).containsIgnoreCase(term))
          .or(FX_ROLE.NAME.containsIgnoreCase(term))
          .or(FX_ROLE.DESCRIPTION.containsIgnoreCase(term));

        condition = condition.and(termCondition);
      }
    }

    var result = dsl.selectFrom(FX_ROLE)
      .where(condition)
      .orderBy(DbHelper.getSortFields(pageable.getSort(), FX_ROLE))
      .offset(pageable.getOffset())
      .limit(pageable.getPageSize())
      .fetch();

    var count = dsl.fetchCount(FX_ROLE, condition);

    return new PageImpl<>(result, pageable, count);
  }
}
