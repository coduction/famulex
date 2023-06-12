package com.famulex.api.group.repository;

import com.famulex.api.core.util.DbHelper;
import com.famulex.api.core.util.TextHelper;
import com.famulex.api.jooq.tables.records.FxGroupRecord;
import lombok.RequiredArgsConstructor;
import org.hibernate.internal.util.StringHelper;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import static com.famulex.api.jooq.tables.FxGroup.FX_GROUP;

/**
 * Class GroupRepositoryCustomImpl
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.06.23
 */
@RequiredArgsConstructor
public class GroupRepositoryCustomImpl implements GroupRepositoryCustom {

  private final DSLContext dsl;

  @Override
  public Page<FxGroupRecord> search(String search, Pageable pageable) {
    var condition = DSL.noCondition();

    if (!StringHelper.isBlank(search)) {
      for (var term : TextHelper.prepareFullTextSearch(search)) {
        var termCondition = DSL
          .or(FX_GROUP.KEY.cast(String.class).containsIgnoreCase(term))
          .or(FX_GROUP.NAME.containsIgnoreCase(term))
          .or(FX_GROUP.DESCRIPTION.containsIgnoreCase(term))
          .or(FX_GROUP.TYPE.containsIgnoreCase(term));

        condition = condition.and(termCondition);
      }
    }

    var result = dsl.selectFrom(FX_GROUP)
      .where(condition)
      .orderBy(DbHelper.getSortFields(pageable.getSort(), FX_GROUP))
      .offset(pageable.getOffset())
      .limit(pageable.getPageSize())
      .fetch();

    var count = dsl.fetchCount(FX_GROUP, condition);

    return new PageImpl<>(result, pageable, count);
  }
}
