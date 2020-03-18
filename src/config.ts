import clrs from 'colors';

const requiredEnv = [
  'EMAIL',
  'EMAIL_PASSWORD',
  'MONGODB_URL',
  'JWT_SECRET_KEY',
];

export function check(): void {
  const unsetEnv = requiredEnv.filter(env => process.env[env] === undefined);

  if (unsetEnv.length > 0) {
    const errMsg = clrs.red(
      `🤨 Required env variables are not set: [${clrs.yellow(unsetEnv.join(', '.red)).bold}]`,
    );
    throw new Error(errMsg);
  }
  console.info(clrs.green(`🤟 Configuration`));
}
