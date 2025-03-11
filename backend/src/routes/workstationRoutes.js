const express = require('express');
const router = express.Router();
const workstationController = require('../controllers/workstationController');

router.get('/', workstationController.getAllWorkstations);
router.post('/', workstationController.createWorkstation);
router.get('/:id', workstationController.getWorkstationById);
router.put('/:id', workstationController.updateWorkstation);
router.delete('/:id', workstationController.deleteWorkstation);
router.get('/client/:clientId', workstationController.getWorkstationsByClient);

module.exports = router;