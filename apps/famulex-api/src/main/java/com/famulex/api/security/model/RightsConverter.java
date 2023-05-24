package com.famulex.api.security.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Class RightsConverter
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 20.05.23
 */
@Converter
public class RightsConverter implements AttributeConverter<List<Right>, String> {

  private final static String SEPARATOR = ",";

  @Override
  public String convertToDatabaseColumn(List<Right> rights) {
    return rights.stream()
      .map(Right::name)
      .collect(Collectors.joining(SEPARATOR));
  }

  @Override
  public List<Right> convertToEntityAttribute(String rightsString) {
    return Stream.of(rightsString.split(SEPARATOR))
      .map(Right::valueOf)
      .toList();
  }
}
