const tf = require("@tensorflow/tfjs-node");
const { CategoriaServicio } = require("../constant/constantes");
const path = require("path");
const { ExceptionMessages } = require("@google-cloud/storage/build/src/storage");

async function loadImageFromBuffer(buffer) {
  const img_height = 180;
  const img_width = 180;
  const targetSize = [
    img_height,
    img_width,
  ];
  // Convertir el buffer de la imagen a un tensor
  let tensor = tf.node.decodeImage(buffer, 3);

  // Redimensionar la imagen si se especifica un tamaño objetivo
  tensor = tf.image.resizeBilinear(tensor, targetSize); // [180, 180, 3]

  // Redimensionar el tensor para que tenga la forma correcta [-1, 180, 180, 3]
  const reshapedTensor = tf.expandDims(tensor, 0);

  return reshapedTensor;
}

async function analizarImagen(imagen) {
  try {
    const nombreModelo = 'model.json';
    const direccionModelo = path.resolve(__dirname, nombreModelo);
    const modelPath = `file://${direccionModelo}`;


   // ['abolladura', 'farolRoto', 'grieta', 'llantaPinchada', 'rayadura', 'vidrioRoto']

    const class_names = [
      CategoriaServicio.ABOLLADURA,
      CategoriaServicio.FAROL_ROTO,
      CategoriaServicio.GRIETA,
      CategoriaServicio.LLANTA_PINCHADA,
      CategoriaServicio.RAYADURA,
      CategoriaServicio.VIDRIO_ROTO
    ];

    const processedTensor = await loadImageFromBuffer(imagen);

    const model = await tf.loadGraphModel(modelPath);

    const predictions = model.predict(processedTensor);

    // Para obtener las probabilidades de cada clase
    const scores = tf.softmax(predictions).dataSync();

    // Obtiene la clase con mayor probabilidad
    const classIndex = scores.indexOf(Math.max(...scores));

    const etiqueta = class_names[classIndex];
    const confianza = scores[classIndex];

    return { label: etiqueta, confidence: confianza };

  } catch (error) {
    throw new Error('Error al procesar la imagen');
  }
}



module.exports = { analizarImagen };
