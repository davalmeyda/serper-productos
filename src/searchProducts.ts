import axios from 'axios';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Cargar variables de entorno
const API_KEY = process.env.SERPER_API_KEY;
const DEFAULT_GL = process.env.SERPER_GL || 'pe';
const DEFAULT_HL = process.env.SERPER_HL || 'es-419';

// Verificar que la API key esté definida
if (!API_KEY) {
  console.error('Error: SERPER_API_KEY no está definida en el archivo .env');
  process.exit(1);
}

// Interfaz para los parámetros de búsqueda
interface SearchOptions {
  gl: string;    // Código de país (ej: 'pe' para Perú) - OBLIGATORIO
  hl: string;    // Código de idioma (ej: 'es-419' para español latinoamericano) - OBLIGATORIO
  tbs?: string;  // Filtro de tiempo (ej: 'qdr:m' para el último mes) - OPCIONAL
  num?: number;  // Número de resultados (máximo 100) - OPCIONAL
}

export const searchProducts = async (query: string, options: SearchOptions = { gl: DEFAULT_GL, hl: DEFAULT_HL }): Promise<string> => {
  try {
    // Construir el cuerpo de la petición con parámetros obligatorios
    const requestBody: any = {
      q: query,
      gl: options.gl,
      hl: options.hl
    };
    
    // Añadir parámetros opcionales solo si están definidos
    if (options.tbs !== undefined) {
      requestBody.tbs = options.tbs;
    }
    
    if (options.num !== undefined) {
      requestBody.num = options.num;
    }
    
    const response = await axios.post(
      'https://google.serper.dev/shopping',
      requestBody,
      {
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Obtener los productos
    const products = response.data.shopping || [];
    
    // Verificar si hay productos
    if (products.length === 0) {
      return `No se encontraron productos para "${query}"`;
    }
    
    // Formatear cada producto
    const formattedProducts = products.map((product: any) => {
      // Convertir todas las propiedades del producto a formato de texto
      const productEntries = Object.entries(product);
      const productLines = productEntries.map(([key, value]) => {
        return `${key}: ${value}`;
      });
      return productLines.join('\n') + '\n---';
    });
    
    // Devolver el resultado formateado
    return `Productos encontrados para "${query}":\n\n${formattedProducts.join("\n")}`;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};
