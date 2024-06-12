// const AWS = require("aws-sdk");
// require("aws-sdk/lib/maintenance_mode_message").suppress = true;

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.REGION,
// });

// AWS.config.getCredentials(function (err) {
//   if (err) console.log("Error de credenciales, no se puede conectar a AWS");
//   else {
//     console.log("Credenciales correctas, conectado a AWS");
//   }
// });

// const s3 = new AWS.S3();

// function subirArchivoAlBucket(foto) {

//   const file = foto;
//   const bucketName = process.env.AWS_BUCKET;
//   const keyName = `${Date.now()}_${file.originalname}`;

//   const params = {
//     Bucket: bucketName,
//     Key: keyName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'public-read', 
//   };

//   // Subir archivo a S3
//   return new Promise((resolve, reject) => {
//     rekognition.detectCustomLabels(params, (err, data) => {
//       if (err) {
//         console.log(err, err.stack);
//         reject(err);
//       } else {
//         console.log('Labels detected:', data.CustomLabels);
//         resolve(data.CustomLabels);
//       }
//     });

//     s3.upload(params, (err, data) => {
//       if (err) {
//         console.error('Error subiendo el archivo:', err);
//         reject(err);
//       } else {
//         console.log('Archivo subido con éxito:', data);
//         resolve({ fileName: keyName, fileUrl: data.Location });
//       }
//     });
//   });

// }


// module.exports = {
//   subirArchivoAlBucket
// };
