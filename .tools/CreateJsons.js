const fs = require('fs');
const path = require('path');

const directoryToWatch = './src/project/scenes/LDTKScene/';

// Función para generar o sobreescribir el archivo JSON a partir del archivo LDtk
function generateJsonFromLdtkl(ldtklFilePath) {
    // Verificar si existe el archivo ldtkl
    if (!fs.existsSync(ldtklFilePath)) {
        console.error(`El archivo ${ldtklFilePath} no existe.`);
        return;
    }

    // Generar el nombre del archivo JSON
    const jsonFilePath = ldtklFilePath.replace('.ldtkl', '.json');

    // Copiar el contenido del archivo ldtkl al archivo JSON
    fs.copyFile(ldtklFilePath, jsonFilePath, (err) => {
        if (err) {
            console.error(`Error al copiar el archivo: ${err}`);
            return;
        }
        console.log(`Archivo JSON generado: ${jsonFilePath}`);
    });
}

// Función para observar cambios en el directorio
function watchDirectory(directoryPath) {
    fs.watch(directoryPath, (eventType, fileName) => {
        // Verificar si el evento es una modificación de archivo y si el archivo modificado es un archivo .ldtkl
        if (eventType === 'change' && fileName && path.extname(fileName) === '.ldtkl') {
            const ldtklFilePath = path.join(directoryPath, fileName);
            console.log(`Archivo modificado: ${ldtklFilePath}`);

            // Generar o sobreescribir el archivo JSON correspondiente
            generateJsonFromLdtkl(ldtklFilePath);
        }
    });

    console.log(`Observando cambios en el directorio: ${directoryPath}`);
}

// Iniciar la observación del directorio
watchDirectory(directoryToWatch);
