const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();

// CONFIGURAMOS LA CONEXIÓN DE LA IA Y EL MODELO
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'us-central1';
const modelName = 'gemini-2.5-flash-preview-04-17';
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

function initGenerativeModel() {
  const vertexAI = new VertexAI({
    project: projectId,
    location,
    credentials: credentialsPath ? require(credentialsPath) : undefined,
  });

  return vertexAI.preview.getGenerativeModel({ model: modelName });
}

module.exports = initGenerativeModel;