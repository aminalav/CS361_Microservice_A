// Grabbing necessary imports 
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

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

// Helper to parse single-quoted JSON-like list
const parseLine = (line) => {
    try {
        return JSON.parse(line.replace(/'/g, '"'));
    } catch {
        return null;
    }
};

// New Endpoint: Process assignment data from text file
app.get('/process-assignments', (req, res) => {
    const inputFile = path.join('.', 'assignments.txt');
    const outputFile = path.join('.', 'results.txt');

    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('[Microservice] Error reading assignments.txt:', err);
            return res.status(500).json({ error: 'File read error' });
        }

        const lines = data.trim().split('\n');
        let totalHours = 0;
        let nullCount = 0;

        for (const line of lines) {
            const entry = parseLine(line);
            if (!entry || entry.length < 5) continue;

            const hoursStr = entry[3].trim();
            const hours = parseFloat(hoursStr);

            if (!hoursStr || isNaN(hours) || hours === 0) {
                nullCount++;
            } else {
                totalHours += hours;
            }
        }

        const outputText = `Total Hours: ${totalHours}\nNull or Zero Hour Entries: ${nullCount}\n`;

        fs.writeFile(outputFile, outputText, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('[Microservice] Error writing results.txt:', writeErr);
                return res.status(500).json({ error: 'File write error' });
            }

            console.log('[Microservice] Results saved to results.txt');
            res.json({ message: 'Assignment data processed', totalHours, nullCount });
        });
    });
});

// For browser visibility 
app.get('/', (req, res) => {
    res.send('Microservice is running. Use /hours/:assignmentId, /hours/:assignmentId/range, or /process-assignments.');
});

// Starting the service 
app.listen(PORT, () => {
    console.log(`Microservice is running on http://localhost:${PORT}`);
});