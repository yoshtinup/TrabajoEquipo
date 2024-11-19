import express from "express";
import signale from "signale";
import cors from "cors";

import { PaymentRouter } from "./v1/Services/Infrestructura/interfaces/http/router/PaymentRouter.js";
import { MessageRouter } from "./v1/Services/Infrestructura/interfaces/http/router/MenssageRouter.js";
import { CorreoRouter } from "./v1/Services/Infrestructura/interfaces/http/router/CorreoRouter.js";
const app = express();

import healthChecker from "./healthCheckerNotification.js";

// Configuración del rate limiting

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/v1", MessageRouter);
app.use("/api/v1", CorreoRouter);
app.use("/api/v1", PaymentRouter);


app.get('/health', async (req, res) => {
    const status = await healthChecker.getStatus();
    res.status(200).json(status);
});
  
const PORT = process.env.PORT || 3003;



app.listen(PORT, () => {
    signale.success(`Server online on port ${PORT}`);
});

