package com.famulex.api.user.repository;

import com.famulex.api.core.util.DbHelper;
import com.famulex.api.core.util.TextHelper;
import com.famulex.api.jooq.tables.records.FxUserRecord;
import lombok.RequiredArgsConstructor;
import org.hibernate.internal.util.StringHelper;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import static com.famulex.api.jooq.tables.FxUser.FX_USER;

/**
 * Class UserRepositoryCustomImpl
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 24.05.23
 */
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

  private final DSLContext dsl;

  @Override
  public Page<FxUserRecord> search(String search, Pageable pageable) {
    var condition = DSL.noCondition();

    if (!StringHelper.isBlank(search)) {
      for (var term : TextHelper.prepareFullTextSearch(search)) {
        var termCondition = DSL
          .or(FX_USER.KEY.cast(String.class).containsIgnoreCase(term))
          .or(FX_USER.FIRST_NAME.containsIgnoreCase(term))
          .or(FX_USER.LAST_NAME.containsIgnoreCase(term))
          .or(FX_USER.EMAIL.containsIgnoreCase(term))
          .or(FX_USER.USERNAME.containsIgnoreCase(term));

        condition = condition.and(termCondition);
      }
    }

    var result = dsl.selectFrom(FX_USER)
      .where(condition)
      .orderBy(DbHelper.getSortFields(pageable.getSort(), FX_USER))
      .offset(pageable.getOffset())
      .limit(pageable.getPageSize())
      .fetch();

    var count = dsl.fetchCount(FX_USER, condition);

    return new PageImpl<>(result, pageable, count);
  }
}
