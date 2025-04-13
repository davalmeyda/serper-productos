# Serper Productos

Un servidor MCP (Model Context Protocol) para buscar productos en línea utilizando la API de Google Serper.

## Descripción

Este paquete proporciona una herramienta para buscar productos en línea a través de la API de Google Serper. Está diseñado para ser utilizado como un servidor MCP, lo que permite integrarlo fácilmente con asistentes de IA compatibles con MCP.

## Instalación

```bash
npm install serper-productos
```

## Requisitos

Para utilizar este paquete, necesitarás:

1. Una clave API de [Google Serper](https://serper.dev/)
2. Node.js (versión 16 o superior)

## Configuración

1. Crea un archivo `.env` en la raíz de tu proyecto con la siguiente variable:

```
# Obligatorio
SERPER_API_KEY=tu_clave_api_aquí

# Valores predeterminados para parámetros obligatorios
SERPER_GL=pe           # Código de país (ej: pe para Perú)
SERPER_HL=es-419       # Código de idioma (ej: es-419 para español latinoamericano)
```

2. Asegúrate de añadir `.env` a tu archivo `.gitignore` para no exponer tu clave API.

## Uso

### Como herramienta de línea de comandos

Después de instalar el paquete globalmente:

```bash
npm install -g serper-productos
serper-productos
```

### Como dependencia en tu proyecto

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchProducts } from "serper-productos";

// Crear un servidor MCP
const server = new McpServer({
  name: "Mi Aplicación",
  version: "1.0.0",
});

// Añadir la herramienta de búsqueda de productos
server.tool(
  "search",
  "Buscador de productos en internet",
  { query: z.string() },
  async ({ query }) => {
    try {
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
```

## API

### `searchProducts(query: string, options: SearchOptions): Promise<string>`

Busca productos basados en la consulta proporcionada y opciones adicionales.

#### Parámetros

- `query` (string): El término de búsqueda para encontrar productos.
- `options` (objeto): Opciones para personalizar la búsqueda:
  - `gl` (string, **obligatorio**): Código de país (ej: 'pe' para Perú). Predeterminado: valor de SERPER_GL o 'pe'.
  - `hl` (string, **obligatorio**): Código de idioma (ej: 'es-419' para español latinoamericano). Predeterminado: valor de SERPER_HL o 'es-419'.
  - `tbs` (string, opcional): Filtro de tiempo (ej: 'qdr:m' para el último mes). Solo se incluye en la petición si se proporciona.
  - `num` (number, opcional): Número de resultados (máximo 100). Solo se incluye en la petición si se proporciona.

#### Retorno

- Promise<string>: Una cadena formateada con los resultados de la búsqueda.

## Ejemplo de respuesta

```
Productos encontrados para "laptop":

title: Laptop HP 15.6" HD, Intel Core i5-1135G7, 8GB RAM, 256GB SSD, Windows 11
price: S/1,799.00
source: Falabella
link: https://www.falabella.com.pe/...
---
title: Laptop Lenovo IdeaPad 3, AMD Ryzen 5, 8GB RAM, 512GB SSD
price: S/1,599.00
source: Ripley
link: https://simple.ripley.com.pe/...
---
```

## Licencia

MIT

## Contribuciones

Las contribuciones son bienvenidas. Por favor, siente libre de abrir un issue o enviar un pull request.

## Autor

David Almeyda
