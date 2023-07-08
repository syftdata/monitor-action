const { parse } = require("yaml");

function compareField(oldField, newField) {
  if (oldField == null || newField == null) {
    return null;
  }
  if (oldField.type !== newField.type) {
    return oldField.name;
  }
  return null;
}

function compareSchema(oldSchema, newSchema) {
  if (oldSchema == null || newSchema == null) {
    return null;
  }
  const oldFields = oldSchema.fields.map((f) => f.name);
  const newFields = newSchema.fields.map((f) => f.name);
  const addedFields = newFields.filter((f) => !oldFields.includes(f));
  const removedFields = oldFields.filter((f) => !newFields.includes(f));
  const changedFields = newFields
    .map((f) =>
      compareField(
        oldSchema.fields[oldFields.indexOf(f)],
        newSchema.fields[newFields.indexOf(f)]
      )
    )
    .filter((f) => f != null);

  if (
    addedFields.length > 0 ||
    removedFields.length > 0 ||
    changedFields.length > 0
  ) {
    return {
      name: oldSchema.name,
      addedFields,
      removedFields,
      changedFields,
    };
  }
  return null;
}

// produces summary by comparing old and new schemas.
function compareSchemas(oldSchema, newSchema) {
  const oldEvents = parse(oldSchema) ?? [];
  const newEvents = parse(newSchema) ?? [];
  const oldEventNames = oldEvents.map((e) => e.name);
  const newEventNames = newEvents.map((e) => e.name);

  const oldEventsMap = new Map(oldEvents.map((e) => [e.name, e]));
  const newEventsMap = new Map(newEvents.map((e) => [e.name, e]));

  const addedEvents = newEventNames.filter((e) => !oldEventNames.includes(e));
  const removedEvents = oldEventNames.filter((e) => !newEventNames.includes(e));
  const changedEvents = newEventNames
    .map((e) => compareSchema(oldEventsMap.get(e), newEventsMap.get(e)))
    .filter((e) => e != null);

  return {
    addedEvents,
    removedEvents,
    changedEvents,
  };
}

module.exports = {
  compareSchemas,
};
