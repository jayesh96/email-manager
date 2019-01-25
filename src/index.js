import EmailManager from './emailManager';
import Sendgrid from './Provider/Sendgrid';
import {template} from './templates/index';

const emailAddresses = [
  'jayesh@kontext.in',
  'jayesh.bidani@gmail.com',
  'masteroo9_9@hotmail.com',
  'a@a.com',
  '',
  'd@d.com',
  'c@c.com',
  '',
  'b@b.com',
];

const emailBody = {
  _from: 'jayesh@kontext.in',
  subject: 'Hello This is subject',
  categoryId: 'category-n',
  text: 'Hello This is test Mail',
  html: template,
};

const sg = new Sendgrid();
const em = new EmailManager();
em.run(emailAddresses, emailBody, sg);
