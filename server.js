import express from "express";
import signale from "signale";
import cors from "cors";

import { clientRouter } from "./v1/Usuarios/Infrestructura/interfaces/http/router/RegistroRouter.js";

const app = express();


app.use(cors());
app.use(express.json());

// Rutas de la API

app.use("/api/v1", clientRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP Usuarios', timestamp: new Date() });
});

const PORT = 3002;
app.listen(PORT, () => {
    signale.success(`Server online on port ${PORT}`);
});

