import { app }  from './app';


const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
    })
})