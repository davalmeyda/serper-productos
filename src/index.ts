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
      query: z.string()
    },
    async ({ query }) => {
      try {
        // Usar la función searchProducts con los valores de las variables de entorno
        const result = await searchProducts(query);
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
