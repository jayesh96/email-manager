import {queue} from 'async';
const CONCURRENCY_INDEX = 5;

class QueueManager {
  sendEmailToEmailProvider(emailAddresses,provider,callback){
    provider
        .sendMail(emailAddresses)
        .then((response) => {
          if (response === 1) callback(null, response);
          else callback(response);
        })
        .catch((error) => {
          const {code, response} = error;
          const {body} = response;
          console.log(code, body);
        });
  }

  createQueue(provider, emailBody) {
    const {_from, subject, html, categoryId, text} = emailBody;
    return queue((batch, callback) => {
      const emailAddresses = batch.email.map((email) => {
        return {
          to: email,
          from: _from,
          subject: subject,
          text: text,
          html: html,
          categories: [categoryId],
        };
      });

      this.sendEmailToEmailProvider(emailAddresses,provider,callback)
    }, CONCURRENCY_INDEX);
  }

  pushToQueue(q, emailAddresses) {
    q.push(
      emailAddresses.map((emailAddress) => {
        return {email: emailAddress};
      }),
      (err) => {
        if (err) {
          console.log(err);
          console.log('Error Occured');
        }
      },
    );
  }

  drainQueue(q) {
    q.drain = () => {
      console.log('All mails have been processed');
    };
  }

  run(emailAddresses, emailBody, emailServiceProvider) {
    const emailQueue = this.createQueue(emailServiceProvider, emailBody);
    this.pushToQueue(emailQueue, emailAddresses);
    this.drainQueue(emailQueue);
  }
}

export default QueueManager;
