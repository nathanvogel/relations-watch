"use strict";
// Manually copied and maintained from /frontend/src/utils for now...
Object.defineProperty(exports, "__esModule", { value: true });
var EntityType;
(function (EntityType) {
    EntityType[EntityType["Human"] = 1] = "Human";
    EntityType[EntityType["MoralPerson"] = 2] = "MoralPerson";
    EntityType[EntityType["Event"] = 10] = "Event";
    EntityType[EntityType["Group"] = 100] = "Group";
    EntityType[EntityType["Media"] = 200] = "Media";
    EntityType[EntityType["State"] = 300] = "State";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
var RelationType;
(function (RelationType) {
    RelationType[RelationType["IsOwned"] = 1] = "IsOwned";
    RelationType[RelationType["JobDependsOn"] = 30] = "JobDependsOn";
    RelationType[RelationType["IsControlled"] = 50] = "IsControlled";
    RelationType[RelationType["ValueExchange"] = 100] = "ValueExchange";
    RelationType[RelationType["Family"] = 300] = "Family";
    RelationType[RelationType["Friendship"] = 310] = "Friendship";
    RelationType[RelationType["Love"] = 320] = "Love";
    RelationType[RelationType["Opposition"] = 330] = "Opposition";
    RelationType[RelationType["Influences"] = 500] = "Influences";
    RelationType[RelationType["Attendance"] = 1000] = "Attendance";
    RelationType[RelationType["GroupMember"] = 2000] = "GroupMember";
    RelationType[RelationType["Other"] = 3000] = "Other";
})(RelationType = exports.RelationType || (exports.RelationType = {}));
var FamilialLink;
(function (FamilialLink) {
    FamilialLink[FamilialLink["childOf"] = 1] = "childOf";
    FamilialLink[FamilialLink["siblingOf"] = 2] = "siblingOf";
    FamilialLink[FamilialLink["spouseOf"] = 3] = "spouseOf";
    FamilialLink[FamilialLink["grandchildOf"] = 14] = "grandchildOf";
    FamilialLink[FamilialLink["cousinOf"] = 15] = "cousinOf";
    FamilialLink[FamilialLink["niblingOf"] = 16] = "niblingOf";
    FamilialLink[FamilialLink["other"] = 100] = "other"; // son-in-law, etc.
})(FamilialLink = exports.FamilialLink || (exports.FamilialLink = {}));
var SourceType;
(function (SourceType) {
    SourceType[SourceType["Link"] = 1] = "Link";
    SourceType[SourceType["TextRef"] = 2] = "TextRef";
})(SourceType = exports.SourceType || (exports.SourceType = {}));
var SourceLinkType;
(function (SourceLinkType) {
    SourceLinkType[SourceLinkType["Neutral"] = 0] = "Neutral";
    SourceLinkType[SourceLinkType["Confirms"] = 1] = "Confirms";
    SourceLinkType[SourceLinkType["Refutes"] = 2] = "Refutes";
})(SourceLinkType = exports.SourceLinkType || (exports.SourceLinkType = {}));
