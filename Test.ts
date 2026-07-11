import { describe, it, expect, vi } from 'vitest';
import { downloadEmployeePayslip } from './downloadHelper';
import axios from 'axios';

// Mock the axios network layer completely
vi.mock('axios');
const mockedAxios = axios as vi.Mocked<typeof axios>;

describe('downloadEmployeePayslip Service Layer', () => {
  it('throws an error wrapper when the API server drops the connection', async () => {
    // Force the mock network layer to throw an exception
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Timeout'));

    await expect(
      downloadEmployeePayslip({
        employeeId: 'EMP123',
        payPeriod: '2026-Q2',
        authToken: 'bad_token'
      })
    ).rejects.toThrow('Could not access remote asset cluster registry.');
  });
});
