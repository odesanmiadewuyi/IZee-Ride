import { Router } from "express";
import { listCauses, createCause } from "../controllers/causes.controller";

const router = Router();

router.get('/', listCauses);
router.post('/', createCause);

export default router;
