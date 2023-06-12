package com.famulex.api.security.repository;

import com.famulex.api.jooq.tables.records.FxRoleRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Class RoleRepositoryCustom
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.06.23
 */
public interface RoleRepositoryCustom {

  Page<FxRoleRecord> search(String search, Pageable pageable);

}
