# Assignment Hours Microservice

This microservice provides total work hours for assignments via a simple REST API. It allows the user to do the following things:

- Request total hours by assignment ID
- Filter hours within a specific date range

**Communication Contract**

---

## Communication Contract (API Endpoints)

### 1. Get total hours for an assignment

Below will show what the request will look like. Requesting data will work as follows. 
An HTTP GET request will be sent to the endpoint, which will replace the :assignmentId, as shown below, with the actual assignment ID.

**Request:**  
```
GET /hours/:assignmentId
```

Here, we see that we have now gotten an example of the actual assignment ID.

**Example:**  
```
GET /hours/a1
```

Now for the response. The server will look up the assignment, and it will return a JSON object with the total hours.

**Response:**  
```json
{ "totalHours": 34 }
```

---

### 2. Get total hours for an assignment within a date range

This will work similarly. For an assignment date range, an HTTP GET request is still sent to the endpoint, with start and end as the parameters for the query.
This will be in ISO date format. Observe the example below.

**Request:**  
```
GET /hours/:assignmentId/range?start=YYYY-MM-DD&end=YYYY-MM-DD
```

We see here that it has gotten the start and end points for the dates.

**Example:**  
```
GET /hours/a1/range?start=2024-04-01&end=2024-04-03
```

**Success Response:**  

The server then filters the assignment's hours only by those specified date ranges, and it returns a JSON object.
An example result is below. 
```json
{ "totalHours": 15 }
```

This is an example of error handling. If start and end dates are not inputted, then it will give an error.

**Error Response (if start or end date missing):**  
```json
{ "error": "Start and end dates required" }
```

---

## Example JavaScript Calls (How to Request and Receive Data)

Below are example JS calls for requesting and receiving data.

The first block is to request data for total hours of assignment with ID a1.

The second block is for that same assignment but within a specific date range.

```js
// Request total hours for assignment "a1"
fetch("http://localhost:2824/hours/a1")
  .then(res => res.json())
  .then(data => console.log("Total hours:", data));

// Request total hours for "a1" in date range
fetch("http://localhost:2824/hours/a1/range?start=2024-04-01&end=2024-04-03")
  .then(res => res.json())
  .then(data => console.log("Hours in range:", data));
```

The response will always be in JSON format.  
You will receive either `{ "totalHours": number }` or `{ "error": "..." }`.

---

## UML Sequence Diagram

![UML Diagram](uml_diagram.png)


---

## Notes for Teammate

- Do **not** use the test program (`test.js`)
- Write your own HTTP requests using JavaScript or your preferred language
- The microservice is **stateless** — you can safely call it any time

---

## Running the Microservice

To run locally:

```bash
npm install
node Microservice_A.js
```

The service will be available at:  
`http://localhost:2824`

---
