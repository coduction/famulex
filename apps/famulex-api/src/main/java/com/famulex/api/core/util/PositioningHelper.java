package com.famulex.api.core.util;

import com.famulex.api.core.model.Positionable;

import java.util.Comparator;
import java.util.List;

/**
 * Class PositioningHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 18.12.22
 */
public class PositioningHelper {

  public static void shiftIndex(List<? extends Positionable> existingObjects, Integer oldPosition, Integer newPosition) {
    if (existingObjects.isEmpty()) {
      return;
    }

    // Fix all positions in case they are corrupted
    existingObjects.sort(Comparator.comparing(Positionable::getPosition));
    for (int i = 0; i < existingObjects.size(); i++) {
      existingObjects.get(i).setPosition(i);
    }

    if (oldPosition == null) {
      return;
    }

    if (newPosition == null) {
      return;
    }

    if (oldPosition < 0) {
      oldPosition = 0;
    } else if (oldPosition >= existingObjects.size()) {
      oldPosition = existingObjects.size() - 1;
    }

    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition >= existingObjects.size()) {
      newPosition = existingObjects.size() - 1;
    }

    if (oldPosition.equals(newPosition)) {
      return;
    }

    if (oldPosition < newPosition) {
      List<? extends Positionable> objectsToShift = existingObjects.subList(oldPosition + 1, newPosition + 1);
      objectsToShift.forEach(node -> node.setPosition(node.getPosition() - 1));
    } else {
      List<? extends Positionable> objectsToShift = existingObjects.subList(newPosition, oldPosition);
      objectsToShift.forEach(node -> node.setPosition(node.getPosition() + 1));
    }

    existingObjects.get(oldPosition).setPosition(newPosition);
    existingObjects.sort(Comparator.comparing(Positionable::getPosition));
  }

  public static void shiftIndexOnInsertion(List<? extends Positionable> existingObjects, Positionable objectToInsert) {
    if (existingObjects.isEmpty()) {
      objectToInsert.setPosition(0);
      return;
    }

    // Fix all positions in case they are corrupted
    existingObjects.sort(Comparator.comparing(Positionable::getPosition));
    for (int i = 0; i < existingObjects.size(); i++) {
      existingObjects.get(i).setPosition(i);
    }

    if (objectToInsert.getPosition() == null) {
      objectToInsert.setPosition(existingObjects.size());
      return;
    }

    if (objectToInsert.getPosition() == existingObjects.size()) {
      return;
    }

    if (objectToInsert.getPosition() > existingObjects.size()) {
      objectToInsert.setPosition(existingObjects.size());
      return;
    }

    if (objectToInsert.getPosition() < 0) {
      objectToInsert.setPosition(0);
    }

    List<? extends Positionable> objectsToShift = existingObjects.subList(objectToInsert.getPosition(), existingObjects.size());
    objectsToShift.forEach(node -> node.setPosition(node.getPosition() + 1));
  }


  public static void shiftIndexOnDeletion(List<? extends Positionable> existingObjects, Positionable objectToDelete) {
    if (existingObjects.isEmpty()) {
      return;
    }

    // Fix all positions in case they are corrupted
    existingObjects.sort(Comparator.comparing(Positionable::getPosition));
    for (int i = 0; i < existingObjects.size(); i++) {
      existingObjects.get(i).setPosition(i);
    }

    if (objectToDelete.getPosition() == null) {
      return;
    }

    if (objectToDelete.getPosition() >= existingObjects.size() - 1) {
      return;
    }

    if (objectToDelete.getPosition() < 0) {
      return;
    }

    List<? extends Positionable> objectsToShift = existingObjects.subList(objectToDelete.getPosition(), existingObjects.size());
    objectsToShift.forEach(node -> node.setPosition(node.getPosition() - 1));
  }

}
