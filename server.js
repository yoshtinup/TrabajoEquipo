import express from "express";
import signale from "signale";
import cors from "cors";
import { db } from "./database/mysql.js";

import { clientRouter } from "./v1/Usuarios/Infrestructura/interfaces/http/router/RegistroRouter.js";

const app = express();


app.use(cors());
app.use(express.json());

// Rutas de la API

app.use("/api/v1", clientRouter);

app.get('/health', async (req, res) => {
    try {
        // Intentamos la conexión a la base de datos
        const [rows] = await db.query('SELECT 1');
        
        if (rows) {
            res.status(200).json({
              service: "User Service",
              status: 'healthy',
              message: 'Database connection is healthy',
              timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
              service: "User Service",
              status: 'degraded',
              message: 'Database connection is degraded, but operational',
              timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        signale.error('Database connection failed:', error);
        res.status(500).json({
            service: "User Service",
            status: 'unhealthy',
            message: 'Database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
  });
  


const PORT = 3002;
app.listen(PORT, () => {
    signale.success(`Server online on port ${PORT}`);
});

