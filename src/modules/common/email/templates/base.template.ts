export const baseTemplate = (title: string, content: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      }
      .header {
        background: #007bff;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px 25px;
        line-height: 1.6;
      }
      .footer {
        background: #f1f1f1;
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #777;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        background: #007bff;
        color: white;
        padding: 12px 24px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
      }
      .button:hover {
        background: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h2>${title}</h2>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;
