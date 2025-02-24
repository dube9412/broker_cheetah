const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  try {
    const { customName, loanPrograms, uploadedBy } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const document = new Document({
      originalName: file.originalname,
      customName,
      filePath: file.path,
      loanPrograms: JSON.parse(loanPrograms), // frontend sends array as JSON.stringify
      uploadedBy,
    });

    await document.save();

    res.status(200).json({ success: true, document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
};
