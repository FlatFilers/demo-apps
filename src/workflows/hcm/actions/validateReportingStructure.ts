export const validateReportingStructure = (records) => {
  const reportingErrors = [];
  const employees = {};
  const visited = new Set();
  const managerIds = new Set();
  const employeesWithManagerId = new Set();
  const updatedRecords = []; // Array to store only the modified parts of records

  for (const record of records) {
    if (
      record.values.employeeId.messages &&
      record.values.employeeId.messages.length > 0
    ) {
      updatedRecords.push({
        id: record.id,
        values: {
          employeeId: {
            ...record.values.employeeId,
            messages: [],
          },
        },
      });
    }
  }

  const detectCircularDependency = (employeeId: string, path: string[]) => {
    if (visited.has(employeeId)) {
      const record = employees[employeeId];
      const error = {
        message: `Circular dependency detected: ${path.join(
          ' -> '
        )} -> ${employeeId}`,
        source: 'custom-logic',
        type: 'error',
      };

      const updatedRecord = updatedRecords.find((r) => r.id === record.id);
      if (updatedRecord) {
        updatedRecord.values.employeeId.messages.push(error);
      } else {
        updatedRecords.push({
          id: record.id,
          values: {
            employeeId: {
              ...record.values.employeeId,
              messages: [error],
            },
          },
        });
      }
      reportingErrors.push(record);
    } else {
      visited.add(employeeId);
      const managerId = employees[employeeId]?.values.managerId.value;

      if (managerId && managerId !== employeeId) {
        detectCircularDependency(managerId, [...path, employeeId]);
      }

      visited.delete(employeeId);
    }
  };

  for (const record of records) {
    const employeeId = record.values.employeeId.value;
    const managerId = record.values.managerId.value;

    employees[employeeId] = record;

    if (managerId && managerId !== '') {
      managerIds.add(managerId);

      if (employeeId === managerId) {
        employeesWithManagerId.add(employeeId);
      }
    }
  }

  if (employeesWithManagerId.size > 1) {
    for (const employeeId of employeesWithManagerId) {
      const record = employees[employeeId as string];
      const error = {
        message: `Multiple records have the scenario where employeeId = managerId. Please ensure that only one record has the employeeId = managerId scenario.`,
        source: 'custom-logic',
        type: 'error',
      };

      const updatedRecord = updatedRecords.find((r) => r.id === record.id);
      if (updatedRecord) {
        updatedRecord.values.employeeId.messages.push(error);
      } else {
        updatedRecords.push({
          id: record.id,
          values: {
            employeeId: {
              ...record.values.employeeId,
              messages: [error],
            },
          },
        });
      }
      reportingErrors.push(record);
    }
  }

  for (const record of records) {
    const managerId = record.values.managerId.value;
    if (managerId && managerId !== '' && !employees[managerId]) {
      const error = {
        message: `Manager with ID: ${managerId} does not exist as an employee`,
        source: 'custom-logic',
        type: 'error',
      };

      const updatedRecord = updatedRecords.find((r) => r.id === record.id);
      if (updatedRecord) {
        if (!updatedRecord.values.managerId) {
          updatedRecord.values.managerId = {
            ...record.values.managerId,
            messages: [],
          };
        }
        updatedRecord.values.managerId.messages.push(error);
      } else {
        updatedRecords.push({
          id: record.id,
          values: {
            managerId: {
              ...record.values.managerId,
              messages: [error],
            },
          },
        });
      }
      reportingErrors.push(record);
    }
  }

  for (const employeeId in employees) {
    if (!visited.has(employeeId)) {
      detectCircularDependency(employeeId, []);
    }
  }

  console.log('Reporting Errors: ' + JSON.stringify(reportingErrors));

  return updatedRecords; // Return only the modified records
};
