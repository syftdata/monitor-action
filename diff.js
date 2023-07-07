const { parse } = require("yaml");

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
  const changedEventNames = newEventNames.filter(
    (e) => oldEventNames.includes(e) && newEventsMap[e] !== oldEventsMap[e]
  );
  const changedEvents = changedEventNames.map((e) => {
    // get the fields that changed.
    const oldEvent = oldEventsMap[e];
    const newEvent = newEventsMap[e];
    const oldFields = oldEvent.fields.map((f) => f.name);
    const newFields = newEvent.fields.map((f) => f.name);
    const addedFields = newFields.filter((f) => !oldFields.includes(f));
    const removedFields = oldFields.filter((f) => !newFields.includes(f));
    const changedFields = newFields.filter(
      (f) =>
        oldFields.includes(f) &&
        newEvent.fields[newFields.indexOf(f)] !==
          oldEvent.fields[oldFields.indexOf(f)]
    );
    return {
      name: e,
      addedFields,
      removedFields,
      changedFields,
    };
  });

  return {
    addedEvents,
    removedEvents,
    changedEvents,
  };
}

module.exports = {
  compareSchemas,
};
