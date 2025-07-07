import AggregateError from 'aggregate-error';
import verifyOrb from './lib/verify.js';
import publishOrb from './lib/publish.js';

let verified;

export async function verifyConditions(pluginConfig, context) {
  const errors = await verifyOrb(pluginConfig, context);

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  verified = true;
}

export async function publish(pluginConfig, context) {
  const errors = verified ? [] : await verifyOrb(pluginConfig, context);

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  return publishOrb(pluginConfig, context);
}
