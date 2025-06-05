
// Main auto-fill utilities - re-exporting from focused modules
export {
  getPersonDataFromContactInfo,
  createAuthorizedPersonFromContactInfo,
  createActualOwnerFromContactInfo
} from "./personFactories";

export {
  createDefaultBusinessLocation,
  updateBusinessLocationsContactPerson
} from "./businessLocationFactories";

export {
  shouldAutoFillBasedOnRole,
  hasContactInfoChanged,
  formatPhoneForDisplay,
  requiresBusinessLocation,
  requiresActualOwner,
  requiresAuthorizedPerson,
  requiresTechnicalPerson
} from "./autoFillHelpers";

export {
  getAutoFillUpdates,
  handleMajitelRole,
  handleKonatelRole,
  handleTechnicalContactRole,
  handleBusinessContactRole
} from "./autoFillRoleHandlers";
