import { createClient, defineScript } from 'redis';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
      return redis.call('SET', KEYS[1], 1+ tonumber(ARGV[1]))
      `,
			transformArguments(key: string, value: number) {
				return [key, value.toString()];
			},
			transformReply(reply: any) {
				return reply;
			}
		})
	}
});

client.on('connect', async () => {
	await client.addOneAndStore('book:count', 5);
	const result = await client.get('book:count');
	console.log(result);
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
