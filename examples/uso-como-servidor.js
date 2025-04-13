// Ejemplo de uso de serper-productos como servidor MCP personalizado
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchProducts } from 'serper-productos/searchProducts';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear un servidor MCP personalizado
const server = new McpServer({
  name: "Mi Aplicación Personalizada",
  version: "1.0.0",
});

// Añadir la herramienta de búsqueda de productos con configuración personalizada
server.tool(
  "buscar_productos",
  "Busca productos con opciones personalizadas",
  { 
    consulta: z.string(),
    pais: z.string().default('pe').describe('Código de país (ej: pe para Perú) - OBLIGATORIO'),
    idioma: z.string().default('es-419').describe('Código de idioma (ej: es-419 para español latinoamericano) - OBLIGATORIO'),
    limite: z.number().optional().describe('Número máximo de resultados - OPCIONAL'),
    filtro_tiempo: z.string().optional().describe('Filtro de tiempo (ej: qdr:m para el último mes) - OPCIONAL')
  },
  async ({ consulta, pais, idioma, limite, filtro_tiempo }) => {
    try {
      // Preparar los parámetros obligatorios
      const opciones = {
        gl: pais,
        hl: idioma
      };
      
      // Añadir parámetros opcionales solo si están definidos
      if (filtro_tiempo !== undefined) {
        opciones.tbs = filtro_tiempo;
      }
      
      if (limite !== undefined) {
        opciones.num = limite;
      }
      
      // Usar la función de búsqueda de productos con parámetros personalizados
      const resultado = await searchProducts(consulta, opciones);
      
      // Procesar el resultado según tus necesidades
      const resultadoPersonalizado = `Resultados personalizados para "${consulta}" en ${pais} (máximo ${limite}): \n\n${resultado}`;
      
      return {
        content: [{ type: "text", text: resultadoPersonalizado }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: "Error al buscar productos: " + error.message }],
      };
    }
  }
);

// Iniciar el servidor
const transport = new StdioServerTransport();
await server.connect(transport);
