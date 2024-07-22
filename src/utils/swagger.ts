import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Material API',
      version: '1.0.0',
    },
  },
  apis: ['./src/interfaces/routes/material/*.ts'], // ปรับพาธให้ถูกต้อง
};

const specs = swaggerJsdoc(options);
export default specs;
