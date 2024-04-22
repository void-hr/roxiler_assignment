const express = require("express");
const router = express.Router();
const {
    getAllTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    combineData,
} = require("../controllers/transactionController");

router.get("/transactions", getAllTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChartData);
router.get("/pie-chart", getPieChartData);
router.get("/combined-data", combineData);



module.exports = router;