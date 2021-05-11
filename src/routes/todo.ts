import { Router } from 'express'; // this will help us to use routers.

import { createUser , billings ,getBillingDetails } from '../controller/todo';

const router = Router();

router.post('/createUser',createUser);

router.post('/createBills',billings);
//
router.get('/bills/:id',getBillingDetails);
//
// router.delete('/:id',deleteTodo);

export default router;
