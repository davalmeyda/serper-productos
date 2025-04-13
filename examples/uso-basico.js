// Ejemplo de uso básico de serper-productos como biblioteca
import { searchProducts } from 'serper-productos';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Función principal
async function main() {
  try {
    // Buscar productos con todos los parámetros
    const resultado = await searchProducts('laptop gaming', {
      gl: 'pe',            // Código de país (Perú) - OBLIGATORIO
      hl: 'es-419',        // Idioma (español latinoamericano) - OBLIGATORIO
      tbs: 'qdr:m',        // Filtro de tiempo (último mes) - OPCIONAL
      num: 15              // Número de resultados - OPCIONAL
    });
    
    // Mostrar resultados
    console.log(resultado);
    
    // También puedes usar solo los parámetros obligatorios
    const resultadoMinimo = await searchProducts('smartphone', {
      gl: 'pe',
      hl: 'es-419'
    });
    console.log('Resultados con parámetros mínimos:', resultadoMinimo);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Ejecutar la función principal
main();
