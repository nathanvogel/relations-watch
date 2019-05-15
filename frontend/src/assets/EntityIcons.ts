import eventS from "./e_event_default_96.png";
import groupS from "./e_group_default_96.png";
import pmoralS from "./e_pmoral_default_96.png";
import pphysicalS from "./e_pphysical_default_96.png";
import mediaS from "./e_media_default_96.png";
import stateS from "./e_state_default_96.png";
import eventL from "./e_event_default_512.png";
import groupL from "./e_group_default_512.png";
import pmoralL from "./e_pmoral_default_512.png";
import pphysicalL from "./e_pphysical_default_512.png";
import mediaL from "./e_media_default_512.png";
import stateL from "./e_state_default_512.png";
import { EntityType } from "../utils/types";

export const Person = {
  Event: {
    S: eventS,
    L: eventL
  },
  Group: {
    S: groupS,
    L: groupL
  },
  MoralPerson: {
    S: pmoralS,
    L: pmoralL
  },
  PhysicalPerson: {
    S: pphysicalS,
    L: pphysicalL
  },
  Media: {
    S: mediaS,
    L: mediaL
  },
  State: {
    S: stateS,
    L: stateL
  }
};

export const EntityS = {
  Event: eventS,
  Group: groupS,
  MoralPerson: pmoralS,
  PhysicalPerson: pphysicalS,
  Media: mediaS,
  State: stateS
};

export const getEntitySAsset = (type: EntityType) => {
  switch (type) {
    case EntityType.Human:
      return pphysicalS;
    case EntityType.MoralPerson:
      return pmoralS;
    case EntityType.Event:
      return eventS;
    case EntityType.Group:
      return groupS;
    case EntityType.Media:
      return mediaS;
    case EntityType.State:
      return stateS;
  }
};

export const getEntityLAsset = (type: EntityType) => {
  switch (type) {
    case EntityType.Event:
      return eventL;
    case EntityType.Group:
      return groupL;
    case EntityType.MoralPerson:
      return pmoralL;
    case EntityType.Human:
      return pphysicalL;
    case EntityType.Media:
      return mediaL;
    case EntityType.State:
      return stateL;
  }
};
