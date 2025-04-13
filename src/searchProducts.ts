import axios from 'axios';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Cargar variables de entorno
const API_KEY = process.env.SERPER_API_KEY;
const DEFAULT_GL = process.env.SERPER_GL || 'pe';
const DEFAULT_HL = process.env.SERPER_HL || 'es-419';
const DEFAULT_TBS = process.env.SERPER_TBS;
const DEFAULT_NUM = process.env.SERPER_NUM ? parseInt(process.env.SERPER_NUM.toString()) : undefined;

// Verificar que la API key esté definida
if (!API_KEY) {
  console.error('Error: SERPER_API_KEY no está definida en el archivo .env');
  process.exit(1);
}

// Interfaz para los parámetros de búsqueda (todos opcionales ya que se pueden tomar de variables de entorno)
interface SearchOptions {
  gl?: string;    // Código de país (ej: 'pe' para Perú)
  hl?: string;    // Código de idioma (ej: 'es-419' para español latinoamericano)
  tbs?: string;   // Filtro de tiempo (ej: 'qdr:m' para el último mes)
  num?: number;   // Número de resultados (máximo 100)
}

  /**
   * Busca productos en internet utilizando la API de Google Serper.
   * @param query Término de búsqueda para encontrar productos.
   * @param options Opciones para la búsqueda (gl, hl, tbs, num).
   * @returns Una cadena con los productos encontrados, formateados como texto.
   */
export const searchProducts = async (query: string, options?: SearchOptions): Promise<string> => {
  try {
    // Construir el cuerpo de la petición con parámetros obligatorios
    const requestBody: any = {
      q: query,
      gl: options?.gl || DEFAULT_GL,  // Usar valor de options si existe, sino usar variable de entorno
      hl: options?.hl || DEFAULT_HL   // Usar valor de options si existe, sino usar variable de entorno
    };
    
    // Añadir parámetros opcionales solo si están definidos en options o en variables de entorno
    const tbs = options?.tbs || DEFAULT_TBS;
    if (tbs) {
      requestBody.tbs = tbs;
    }
    
    const num = options?.num !== undefined ? options.num : DEFAULT_NUM;
    if (num !== undefined) {
      requestBody.num = num;
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
