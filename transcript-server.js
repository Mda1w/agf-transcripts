// transcript-server.js
// Simple Express server to host your ticket transcripts

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from transcripts directory
app.use('/transcripts', express.static(path.join(__dirname, 'transcripts')));

// Homepage - List all transcripts
app.get('/', (req, res) => {
  const transcriptsDir = path.join(__dirname, 'transcripts');
  
  if (!fs.existsSync(transcriptsDir)) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>AGF Transcripts</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            padding: 40px;
            text-align: center;
          }
          h1 { color: #60a5fa; }
        </style>
      </head>
      <body>
        <h1>🎫 AGF Transcripts</h1>
        <p>No transcripts found yet. Close a ticket to generate one!</p>
      </body>
      </html>
    `);
  }

  const files = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.html'));
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AGF Ticket Transcripts</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0f172a;
          color: #e2e8f0;
          padding: 40px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 40px;
          text-align: center;
        }
        h1 {
          font-size: 36px;
          margin-bottom: 10px;
        }
        .subtitle {
          opacity: 0.9;
          font-size: 16px;
        }
        .stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 20px;
        }
        .stat {
          background: rgba(255,255,255,0.1);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
        }
        .transcript-list {
          display: grid;
          gap: 15px;
        }
        .transcript-item {
          background: #1e293b;
          padding: 24px;
          border-left: 4px solid #667eea;
          border-radius: 8px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .transcript-item:hover {
          transform: translateX(8px);
          border-left-color: #60a5fa;
          background: #334155;
        }
        .transcript-item a {
          color: #60a5fa;
          text-decoration: none;
          font-size: 18px;
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
        }
        .date {
          color: #94a3b8;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid #334155;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎫 AGF Ticket Transcripts</h1>
          <p class="subtitle">Anti Gangs Force • Ticket History</p>
          <div class="stats">
            <div class="stat">📊 Total Transcripts: ${files.length}</div>
            <div class="stat">🏢 Anti Gangs Force</div>
          </div>
        </div>
        
        <div class="transcript-list">
  `;

  if (files.length === 0) {
    html += `
      <div class="transcript-item">
        <p style="text-align: center; color: #94a3b8;">
          No transcripts available yet. Transcripts will appear here when tickets are closed.
        </p>
      </div>
    `;
  } else {
    files.reverse().forEach(file => {
      const stats = fs.statSync(path.join(transcriptsDir, file));
      const date = new Date(stats.mtime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const ticketName = file.replace('transcript-', '').replace('.html', '');
      html += `
        <div class="transcript-item">
          <a href="/transcripts/${file}">📄 ${ticketName}</a>
          <div class="date">🕒 ${date}</div>
        </div>
      `;
    });
  }

  html += `
        </div>
        
        <div class="footer">
          <p>Powered by AGF Bot</p>
          <p style="margin-top: 8px; font-size: 14px;">Generated ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`✅ Transcript server running!`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📂 Serving: ${path.join(__dirname, 'transcripts')}`);
});
