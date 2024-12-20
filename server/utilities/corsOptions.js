export const corsOptions = {
    origin: [
        'https://expense-tracker-8uqfakdkk-sethzarkovich.vercel.app',   
        'https://http-tester.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}