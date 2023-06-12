package com.famulex.api.group.repository;

import com.famulex.api.jooq.tables.records.FxGroupRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Class GroupRepositoryCustom
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.06.23
 */
public interface GroupRepositoryCustom {

  Page<FxGroupRecord> search(String search, Pageable pageable);
}
