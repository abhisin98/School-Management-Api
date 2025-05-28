import { Router } from "express";

import { GET_List_Schools, POST_Add_School } from "../controllers/schools";

const router = Router();

// --------------------------------------------------------------------
// TODO: move all controllers in the controllers folder
router.get("/listSchools", GET_List_Schools);
router.post("/addSchool", POST_Add_School);

// --------------------------------------------------------------------
export { router as schoolsRouter };
// export default router;
