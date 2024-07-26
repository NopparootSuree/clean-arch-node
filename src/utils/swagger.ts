import swaggerJsdoc from 'swagger-jsdoc';

const baseOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Name',
      version: '1.0.0',
      description: 'API documentation for your project',
    },
  },
};

const materialOptions: swaggerJsdoc.OAS3Options = {
  ...baseOptions,
  definition: {
    ...baseOptions.definition,
    tags: [{ name: 'Materials', description: 'Material management' }],
  },
  apis: ['./src/interfaces/routes/material/*.ts'], // ปรับ path ตามโครงสร้างโปรเจคของคุณ
};

const userOptions: swaggerJsdoc.OAS3Options = {
  ...baseOptions,
  definition: {
    ...baseOptions.definition,
    tags: [{ name: 'Users', description: 'User management' }],
  },
  apis: ['./src/interfaces/routes/user/*.ts'], // ปรับ path ตามโครงสร้างโปรเจคของคุณ
};

export const materialSpecs = swaggerJsdoc(materialOptions);
export const userSpecs = swaggerJsdoc(userOptions);

// Add this new constant for the main page
export const mainSpecs = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Name',
    version: '1.0.0',
    description: 'API documentation for your project',
  },
};