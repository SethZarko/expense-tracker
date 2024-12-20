export const corsOptions = {
    origin: [
        'https://expense-tracker-pi-azure.vercel.app',   
        'https://http-tester.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}