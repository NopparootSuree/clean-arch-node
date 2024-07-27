import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

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
  apis: ['./src/interfaces/routes/material/*.ts'],
};

const userOptions: swaggerJsdoc.OAS3Options = {
  ...baseOptions,
  definition: {
    ...baseOptions.definition,
    tags: [{ name: 'Users', description: 'User management' }],
  },
  apis: ['./src/interfaces/routes/user/*.ts'],
};

export const materialSpecs = swaggerJsdoc(materialOptions);
export const userSpecs = swaggerJsdoc(userOptions);

export function setupSwagger(app: Express) {
  // Swagger UI for Materials
  app.use(
    '/api-docs/materials',
    swaggerUi.serve,
    swaggerUi.setup(materialSpecs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    }),
  );

  // Swagger UI for Users
  app.use(
    '/api-docs/users',
    swaggerUi.serve,
    swaggerUi.setup(userSpecs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    }),
  );
}
