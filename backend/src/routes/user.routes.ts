import { NextFunction, Request, Response, Router } from 'express';

const router = Router();


router.get('/users', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "test": "Hello world"
    })
});

router.get('/events', (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    }

    sendEvent({ message: 'SSE connection Established!' })

    const interval = setInterval(() => {
        sendEvent({ time: new Date().toISOString() });
    }, 3000)

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    })



})

export default router;

