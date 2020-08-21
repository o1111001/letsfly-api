## MESSAGES.GG API
It's a symbiosis of a **simple messenger** for communication between people and **effective sales funnel builder**

### Just a few renders

![Render](assets/render1.png?raw=true "Render")
![Render](assets/render2.png?raw=true "Render")

### DB ER diagram
![ER diagram](assets/ER_diagram_DB.png?raw=true "ER diagram")

### Requirements:
- node 12.16.1
- postgres 11.5
- redis 5.0.9

### Installation
1. npm install
2. configure .env(see .env.example)
3. npm install -g knex
4. knex migrate:latest
5. node index.js
