import QueueManager from './queueManager';

const BATCH_SIZE = 2;

class Scheduler {
  createEmailAddressesBatch(emailAddresses) {
    return emailAddresses.reduce((emailBatchChunk, item, index) => {
      const chunkIndex = Math.floor(index / BATCH_SIZE);
      if (!emailBatchChunk[chunkIndex]) {
        emailBatchChunk[chunkIndex] = [];
      }
      emailBatchChunk[chunkIndex].push(item);
      return emailBatchChunk;
    }, []);
  }

  schedule(emailAddresses, emailBody, emailServiceProvider) {
    const emailAddressesBatch = this.createEmailAddressesBatch(emailAddresses);
    const queueManager = new QueueManager();
    queueManager.run(emailAddressesBatch, emailBody, emailServiceProvider);
  }
}

export default Scheduler;
