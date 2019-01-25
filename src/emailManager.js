import Scheduler from './scheduler';

class EmailManager {
  constructor() {}

  async getInvalidEmailAddresses(emailServiceProvider) {
    return [
      ...(await emailServiceProvider.getBlockedEmails()),
      ...(await emailServiceProvider.getInvalidEmails()),
    ];
  }

  filterNonEmailStrings(emailAddresses) {
    return emailAddresses.filter((emailAddress) => {
      return emailAddress.length > 0;
    });
  }

  removeInvalidEmailAddresses(emailAddresses, invalidEmails) {
    return emailAddresses.filter(
      (emailAddress) => !invalidEmails.includes(emailAddress),
    );
  }

  async run(emailAddresses, emailBody, emailServiceProvider) {
    emailAddresses = this.filterNonEmailStrings(emailAddresses);
    const invalidEmails = await this.getInvalidEmailAddresses(
      emailServiceProvider,
    );
    const validEmails = this.removeInvalidEmailAddresses(
      emailAddresses,
      invalidEmails,
    );
    const scheduler = new Scheduler();
    scheduler.schedule(validEmails, emailBody, emailServiceProvider);
  }
}

export default EmailManager;
