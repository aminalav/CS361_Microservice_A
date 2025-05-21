// Grabbing necessary imports 
import express from 'express';
import cors from 'cors';

// Setting port and express
const app = express();
const PORT = 2824;
app.use(cors());

// Using mock data for purpose of demo
const workLogs = [
    { assignmentId: 'ai', date: '2024-04-01', hours: 2 },
    { assignmentId: 'ai', date: '2024-04-01', hours: 4 },
    { assignmentId: 'ai', date: '2024-04-01', hours: 5 },
    { assignmentId: 'ai', date: '2024-04-02', hours: 5 },
    { assignmentId: 'ai', date: '2024-04-02', hours: 9 },
    { assignmentId: 'ai', date: '2024-04-02', hours: 1 },
    { assignmentId: 'ai', date: '2024-04-03', hours: 2 },
    { assignmentId: 'ai', date: '2024-04-03', hours: 3 },
    { assignmentId: 'ai', date: '2024-04-04', hours: 4 },
    { assignmentId: 'ai', date: '2024-04-04', hours: 8 },
];

// Setting a helper to parse strings
const parseDate = (dateStr) => new Date(dateStr + 'T00:00:00Z');

// Endpoint: Getting total hours for an assignment 
app.get('/hours/:assignmentId', (req, res) => {
    const { assignmentId } = req.params;
    console.log(`[Microservice] Received GET /hours/${assignmentId}`);

    const totalHours = workLogs
        .filter(log => log.assignmentId === assignmentId)
        .reduce((sum, log) => sum + log.hours, 0);

    console.log(`[Microservice] Responding with totalHours: ${totalHours}`);
    res.json({ totalHours });
});

// Endpoint: Getting total hours for assignments within a specified date range
app.get('/hours/:assignmentId/range', (req, res) => {
    const { assignmentId } = req.params;
    const { start, end } = req.query;

    console.log(`[Microservice] Received GET /hours/${assignmentId}/range?start=${start}&end=${end}`);

    if (!start || !end) {
        console.log(`[Microservice] Missing start or end date. Sending error.`);
        return res.status(400).json({ error: 'Start and end dates required' });
    }

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    const totalHours = workLogs
        .filter(log => log.assignmentId === assignmentId)
        .filter(log => {
            const logDate = parseDate(log.date);
            return logDate >= startDate && logDate <= endDate;
        })
        .reduce((sum, log) => sum + log.hours, 0);

    console.log(`[Microservice] Responding with totalHours: ${totalHours}`);
    res.json({ totalHours });
});

// For browser visibility 
app.get('/', (req, res) => {
    res.send('Microservice is running. Use /hours/:assignmentId or /hours/:assignmentId/range.');
});

// Starting the service 
app.listen(PORT, () => {
    console.log(`Microservice is running on http://localhost:${PORT}`);
});