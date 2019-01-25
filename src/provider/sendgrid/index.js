const sgMail = require('@sendgrid/mail');
const client = require('@sendgrid/client');
client.setApiKey(
  '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',
);
sgMail.setApiKey(
  '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',
);

class Sendgrid {
  constructor() {}

  async sendMail(msg) {
    try {
      const mailResponse = await new Promise((resolve, reject) => {
        sgMail.send(msg, (err) => {
          if (err) {
            reject(err);
          }
          resolve(1);
        });
      });
      return mailResponse;
    } catch (err) {
      throw err;
    }
  }

  async getBlockedEmails() {
    try {
      const request = {};
      const queryParams = {};
      request.qs = queryParams;
      request.method = 'GET';
      request.url = '/v3/suppression/blocks';
      return client.request(request).then(([response]) => {
        const {statusCode, body} = response;
        if (statusCode == 200) {
          const emails = body.map((resp) => {
            return resp.email;
          });
          return [...new Set(emails)];
        } else {
          return [];
        }
      });
    } catch (err) {
      throw err;
    }
  }

  async getInvalidEmails() {
    try {
      const request = {};
      const queryParams = {};
      request.qs = queryParams;
      request.method = 'GET';
      request.url = '/v3/suppression/invalid_emails';
      return client.request(request).then(([response]) => {
        const {statusCode, body} = response;
        if (statusCode == 200) {
          const emails = body.map((resp) => {
            return resp.email;
          });
          return [...new Set(emails)];
        } else {
          return [];
        }
      });
    } catch (err) {
      throw err;
    }
  }

  static async getEmailAnalytics(start_date, end_date, id) {
    try {
      const request = {};
      const queryParams = {
        end_date: '2019-01-24',
        categories: 'cat1',
        start_date: '2019-01-24',
      };

      request.qs = queryParams;
      request.method = 'GET';
      request.url = '/v3/categories/stats';
      client.request(request).then(([response, body]) => {
        console.log(response.statusCode);
        console.log(response.body);
        return response;
      });
    } catch (err) {
      throw err;
    }
  }
}

export default Sendgrid;
