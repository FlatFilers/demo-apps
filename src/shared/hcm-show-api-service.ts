import { SyncedRecordsResponse } from '@/shared/api-service-base';
import { FlatfileEvent } from '@flatfile/listener';
import axios from 'axios';
import invariant from 'ts-invariant';

type DepartmentResult = {
  id: string;
  departmentName: string;
  departmentCode: string;
};

type EmployeeResult = {
  id: string;
  employeeId: string;
  managerId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  employeeType: string;
  hireDate: string;
  endEmploymentDate: string;
  jobName: string;
  jobCode: string;
  positionTitle: string;
  defaultWeeklyHours: number;
  scheduledWeeklyHours: number;
  emailAddress: string;
  password: string;
  phoneNumber: string;
};

export class HcmShowApiService {
  static syncSpace = async (
    event: FlatfileEvent
  ): Promise<SyncedRecordsResponse> => {
    const { spaceId } = event.context;

    try {
      const apiBaseUrl = await event.secrets('HCM_API_BASE_URL');
      invariant(apiBaseUrl, 'Missing HCM_API_BASE_URL in environment secrets');

      const response = await axios.get(
        `${apiBaseUrl}/api/webhook/sync-space/${spaceId}`,
        {
          headers: await this.headers(event),
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to submit data to webhook');
      }

      return response.data as SyncedRecordsResponse;
    } catch (error) {
      console.log(
        `Error calling sync space: ${
          error.message || JSON.stringify(error, null, 2)
        }`
      );
    }
  };

  private static headers = async (event: FlatfileEvent) => {
    const listenerAuthToken = await event.secrets('LISTENER_AUTH_TOKEN');
    invariant(
      listenerAuthToken,
      'Missing LISTENER_AUTH_TOKEN in environment secrets'
    );

    return {
      'Content-Type': 'application/json',
      'x-listener-auth': listenerAuthToken,
      'x-space-id': event.context.spaceId,
    };
  };

  static fetchDepartments = async (
    event: FlatfileEvent
  ): Promise<DepartmentResult[]> => {
    console.log('Fetching departments from hcm.show');

    const apiBaseUrl = await event.secrets('HCM_API_BASE_URL');
    const url = `${apiBaseUrl}/api/v1/departments`;

    let response;

    try {
      response = await axios.get(url, {
        headers: await this.headers(event),
      });

      if (response.status !== 200) {
        throw new Error(`response status was ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to fetch departments: ${error.message}`);
      response = [];
    }

    const departments = response.data as [];

    console.log('Departments found: ' + JSON.stringify(departments));

    return departments;
  };

  static fetchEmployees = async (
    event: FlatfileEvent
  ): Promise<EmployeeResult[]> => {
    console.log('Fetching employees from hcm.show');

    const apiBaseUrl = await event.secrets('HCM_API_BASE_URL');
    const url = `${apiBaseUrl}/api/v1/employees`;

    let response;

    try {
      response = await axios.get(url, {
        headers: await this.headers(event),
      });

      if (response.status !== 200) {
        throw new Error(`response status was ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to fetch employees: ${error.message}`);
      response = [];
    }

    const employees = response.data.employees as [];

    console.log('Employees found: ' + JSON.stringify(employees));

    return employees;
  };
}
