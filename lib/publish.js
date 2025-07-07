import { execa } from 'execa';
import resolveConfig from './resolve-config.js';

export default async (pluginConfig, context) => {
  const {
    cwd,
    env,
    stdout,
    stderr,
    nextRelease: {version},
    logger,
  } = context;

  logger.log(`Publishing version ${version} to CircleCI Orb registry`);

  const {commandName, circleciToken, orbName, orbPath} = resolveConfig(pluginConfig, context);

  let nextVersion = version
  if (version.includes('-rc.')) {
    // rc -> dev:version
    nextVersion = "dev:"+version
  } else if (version.includes('unstable')) {
    // unstable -> dev:first
    nextVersion = "dev:first"
  }

  const orbRef = `${orbName}@${nextVersion}`;

  const result = execa(commandName, ['orb', 'publish', orbPath, orbRef, '--token', circleciToken], {
    cwd,
    env,
  });
  result.stdout.pipe(
    stdout,
    {end: false}
  );
  result.stderr.pipe(
    stderr,
    {end: false}
  );
  await result;

  logger.log(`Published ${orbRef}`);
  return {name: 'CircleCI Orb', url: `https://circleci.com/orbs/registry/orb/${orbRef}`};
};
