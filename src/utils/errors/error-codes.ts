export const ERROR_CODES = {
  // General Errors (GEN)
  GEN_001: 'Unexpected error occurred',
  GEN_002: 'Invalid input data',
  GEN_003: 'Operation not supported',

  // Validation Errors (VAL)
  VAL_001: 'Validation failed',
  VAL_002: 'Required field missing',
  VAL_003: 'Invalid data type',
  VAL_004: 'Value out of range',

  // Database Errors (DB)
  DB_001: 'Database connection failed',
  DB_002: 'Query execution failed',
  DB_003: 'Transaction failed',
  DB_004: 'Duplicate entry',

  // Not Found Errors (NF)
  NF_001: 'Resource not found',
  NF_002: 'Page not found',

  // Authorization Errors (AUTH)
  AUTH_001: 'Unauthorized access',
  AUTH_002: 'Invalid credentials',
  AUTH_003: 'Token expired',
  AUTH_004: 'Insufficient permissions',

  // Operation Errors (OP)
  OP_001: 'Failed to create resource',
  OP_002: 'Failed to update resource',
  OP_003: 'Failed to delete resource',
  OP_004: 'Failed to retrieve resource',

  // File Operation Errors (FILE)
  FILE_001: 'Failed to read file',
  FILE_002: 'Failed to write file',
  FILE_003: 'File not found',
  FILE_004: 'Invalid file format',

  // Network Errors (NET)
  NET_001: 'Network connection failed',
  NET_002: 'Request timeout',
  NET_003: 'Invalid response from server',

  // Configuration Errors (CONF)
  CONF_001: 'Missing configuration',
  CONF_002: 'Invalid configuration',

  // External Service Errors (EXT)
  EXT_001: 'External service unavailable',
  EXT_002: 'External service returned an error',

  // Rate Limiting Errors (RATE)
  RATE_001: 'Rate limit exceeded',

  // Data Integrity Errors (DATA)
  DATA_001: 'Data integrity violation',
  DATA_002: 'Inconsistent data state',

  // Performance Errors (PERF)
  PERF_001: 'Operation timed out',
  PERF_002: 'Resource exhausted',
} as const;
