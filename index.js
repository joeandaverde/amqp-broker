const BrokerRegistrar = require('./broker_registrar')
const AmqpManager = require('./amqp_manager')
const AmqpBroker = require('./amqp_broker')

module.exports = {
   BrokerRegistrar: BrokerRegistrar,

   AmqpManager: AmqpManager,

   AmqpBroker: AmqpBroker,

   configure: (config) => {
      const amqpManager = new AmqpManager(config)

      const registrar = new BrokerRegistrar()

      const registerBroker = (messageType, exchange, queue, pattern) => {
         registrar.register(messageType, () => {
            return new AmqpBroker(amqpManager, {
               consume: {
                  queue: queue,
               },
               publish: {
                  pattern: pattern,
                  exchange: exchange,
                  options: {
                     persistent: true,
                     mandatory: true,
                  }
               }
            })
         })
      }

      return {
         registerBroker: registerBroker,
         amqpManager: amqpManager,
         registrar: registrar,
      }
   }
}
