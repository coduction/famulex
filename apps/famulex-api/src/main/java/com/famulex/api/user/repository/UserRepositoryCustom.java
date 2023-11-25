package com.famulex.api.user.repository;

import com.famulex.api.jooq.tables.records.FxUserRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Class UserRepositoryCustom
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 24.05.23
 */
public interface UserRepositoryCustom {

  Page<FxUserRecord> search(String search, Pageable pageable);

}
