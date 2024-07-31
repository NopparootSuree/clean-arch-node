import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response, NextFunction } from 'express';
// import path from 'path';

const baseOptionsMaterial = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Material API Document',
      version: '1.0.0',
      description: 'API documentation for materials',
    },
  },
};

const baseOptionsUser = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API Document',
      version: '1.0.0',
      description: 'API documentation for users',
    },
  },
};

const materialOptions: swaggerJsdoc.OAS3Options = {
  ...baseOptionsMaterial,
  definition: {
    ...baseOptionsMaterial.definition,
    tags: [{ name: 'Materials', description: 'Material management' }],
  },
  apis: ['./src/interfaces/routes/material/*.ts'],
};

const userOptions: swaggerJsdoc.OAS3Options = {
  ...baseOptionsUser,
  definition: {
    ...baseOptionsUser.definition,
    tags: [{ name: 'Users', description: 'User management' }],
  },
  apis: ['./src/interfaces/routes/user/*.ts'],
};

export const materialSpecs = swaggerJsdoc(materialOptions);
export const userSpecs = swaggerJsdoc(userOptions);

export function setupSwagger(app: Express) {
  // ... (ส่วนอื่นๆ ของ function คงเดิม) ...

  const customCss = `
  .swagger-ui .topbar { display: none }
  .home-link-container {
    padding: 10px 30px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
  }
  .home-link {
    padding: 6px 15px;
    display: inline-block;
    border-radius: 4px;
    border: 2px solid #4990e2;
    color: #4990e2;
    background-color: transparent;
    font-size: 14px;
    font-family: sans-serif;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .home-link:hover {
    background-color: #4990e2;
    color: #fff;
    }
`;

  const customSiteTitle = 'API Documentation';

  const customOptions = {
    customCss,
    customSiteTitle,
    customJs: '/custom.js',
  };

  // Custom middleware to serve the correct Swagger UI
  const swaggerUiHandler = (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    let swaggerSpec;
    let swaggerOptions;

    if (url.startsWith('/api-docs/materials')) {
      swaggerSpec = materialSpecs;
      swaggerOptions = {
        swaggerOptions: {
          url: '/api-docs/materials.json',
        },
      };
    } else if (url.startsWith('/api-docs/users')) {
      swaggerSpec = userSpecs;
      swaggerOptions = {
        swaggerOptions: {
          url: '/api-docs/users.json',
        },
      };
    } else {
      return next();
    }

    const html = swaggerUi.generateHTML(swaggerSpec, {
      ...customOptions,
      ...swaggerOptions,
    });

    // Insert home link
    const modifiedHtml = html.replace(
      '<div id="swagger-ui"></div>',
      `<div class="home-link-container">
        <a href="/api-docs" class="home-link">Back to API Index</a>
       </div>
       <div id="swagger-ui"></div>`,
    );

    res.send(modifiedHtml);
  };

  // Serve Swagger UI
  app.use(['/api-docs/materials', '/api-docs/users'], swaggerUi.serve, swaggerUiHandler);
}
