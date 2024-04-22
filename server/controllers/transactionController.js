const Transaction = require("../model/transactionSchema");

const getAllTransactions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const search = req.query.search;
        const selectedMonth = req.query.month;
        const query = {};
    
        if (search && search.trim() !== '') {
            query.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { productDescription: { $regex: search, $options: 'i' } },
                { productCategory: { $regex: search, $options: 'i' } },
                { productPrice: isNaN(search) ? undefined : parseFloat(search) }
            ];
        }
    
        if (selectedMonth) {
            query.saleMonth = selectedMonth;
        }
    
        const totalItems = await Transaction.countDocuments(query);
        const totalPages = Math.ceil(totalItems / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
    
        const results = {};
        if (endIndex < totalItems) {
            results.next = {
                page: page + 1,
                perPage: perPage
            };
        }
    
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                perPage: perPage
            };
        }
    
        results.totalPages = totalPages;
    
        results.results = await Transaction.find(query)
            .skip(startIndex)
            .limit(perPage);
    
        res.json(results);
    } catch (error) {
        console.error('Error in getAllTransactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getStatistics = async (req, res, next) => {
    try {
        const selectedMonth = req.query.month;
        const totalSaleAmount = await Transaction.aggregate([
            {
                $match: {
                    saleMonth: selectedMonth,
                    isSold: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$productPrice" }
                }
            }
        ]);

        const totalSoldItems = await Transaction.countDocuments({
            saleMonth: selectedMonth,
            isSold: true
        });

        const totalNotSoldItems = await Transaction.countDocuments({
            saleMonth: selectedMonth,
            isSold: false
        });

        const statistics = {
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        };

        res.json(statistics);
    } catch (error) {
        next(error);
    }
};

const getBarChartData = async (req, res, next) => {
    try {
        const selectedMonth = req.query.month;

        const priceRangeTemplate = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity }
        ];
        const barChartData = await Promise.all(
            priceRangeTemplate.map(async (range) => {
                const itemsCount = await Transaction.countDocuments({
                    saleMonth: selectedMonth,
                    productPrice: { $gte: range.min, $lt: range.max }
                });
                return {
                    priceRange: `${range.min}-${range.max === Infinity ? 'above' : range.max}`,
                    itemsCount
                };
            })
        );

        res.json(barChartData);
    } catch (error) {
        next(error);
    }
};

const getPieChartData = async (req, res, next) => {
    try {
        const selectedMonth = req.query.month;

        const uniqueCategories = await Transaction.distinct("productCategory", {
            monthOfSale: selectedMonth
        });

        const pieChartData = await Promise.all(
            uniqueCategories.map(async (category) => {
                const itemsCount = await Transaction.countDocuments({
                    monthOfSale: selectedMonth,
                    productCategory: category
                });
                return {
                    category,
                    itemsCount
                };
            })
        );

        res.json(pieChartData);
    } catch (error) {
        next(error);
    }
};

const combineData = async (req, res, next) => {
    try {
        const statisticsData = await fetch(`${process.env.BACKEND_URL}/statistics`).then((res) => res.json());
        const barChartData = await fetch(`${process.env.BACKEND_URL}/bar-chart`).then((res) => res.json());
        const pieChartData = await fetch(`${process.env.BACKEND_URL}/pie-chart`).then((res) => res.json());
        const combinedData = {
            statistics: statisticsData,
            barChart: barChartData,
            pieChart: pieChartData
        };
        res.json(combinedData);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    combineData,
};
