/**
 * Validation error factories for domain entities.
 * @see specs/phase_5_2_game_domain_model.md, phase_6_1_edge_cases.md
 */

function missingMandatoryField(field) {
  return {
    code: "MISSING_MANDATORY_FIELD",
    message: `Le champ obligatoire "${field}" est manquant.`,
    field,
  };
}

function invalidEnumValue(field, value, allowedValues) {
  return {
    code: "INVALID_ENUM_VALUE",
    message: `La valeur "${value}" pour le champ "${field}" est invalide. Valeurs autorisées : ${allowedValues.join(", ")}.`,
    field,
    value,
    allowedValues,
  };
}

function invalidPlayerRange(min, max) {
  return {
    code: "INVALID_PLAYER_RANGE",
    message: `La plage de joueurs est invalide : le minimum (${min}) doit être inférieur ou égal au maximum (${max}).`,
    min,
    max,
  };
}

module.exports = {
  missingMandatoryField,
  invalidEnumValue,
  invalidPlayerRange,
};
