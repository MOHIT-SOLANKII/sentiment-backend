const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { TextAnalyticsClient, AzureKeyCredential } = require('@azure/ai-text-analytics');

const app = express();
const port = 5000;

// Replace with your Azure key and endpoint
const key = '383023942a7a43c6bce2734e94ae2bcf';
const endpoint = 'https://varun-singh-2004.cognitiveservices.azure.com/';

const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { stockName } = req.body;
  const filePath = path.join(__dirname, 'stocks.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const stockDocument = jsonData.find(doc => doc.stockName === stockName);

  if (stockDocument) {
    const sentimentResult = await textAnalyticsClient.analyzeSentiment([stockDocument.text]);
    res.json({ sentiment: sentimentResult[0].sentiment });
  } else {
    res.status(404).send('Stock name not found.');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});