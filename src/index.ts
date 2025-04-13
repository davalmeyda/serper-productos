import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchProducts } from "./searchProducts.js";

// Exportar la función searchProducts para uso como biblioteca
export { searchProducts };

// Este código solo se ejecuta cuando se usa como servidor MCP
if (import.meta.url === `file://${process.argv[1]}`) {
  // Create an MCP server
  const server = new McpServer({
    name: "Serper Productos",
    version: "1.0.0",
  });

  // Add search tool
  server.tool(
    "search",
    "Buscador de productos en internet",
    { 
      query: z.string(),
      gl: z.string().describe('Código de país (ej: pe para Perú)').default('pe'),
      hl: z.string().describe('Código de idioma (ej: es-419 para español latinoamericano)').default('es-419'),
      tbs: z.string().optional().describe('Filtro de tiempo (ej: qdr:m para el último mes)'),
      num: z.number().optional().describe('Número de resultados (máximo 100)')
    },
    async ({ query, gl, hl, tbs, num }) => {
      try {
        const result = await searchProducts(query, { gl, hl, tbs, num });
        return {
          content: [{ type: "text", text: result }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: "Error al buscar productos" }],
        };
      }
    }
  );

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
