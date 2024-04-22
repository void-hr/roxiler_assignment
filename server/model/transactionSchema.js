const mongoose = require("mongoose");
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const transactionSchema = mongoose.Schema({
    productCode: {
        type: String,
        required: [true, "Please add a product code"],
    },
    productName: {
        type: String,
        required: [true, "Please add a name for your product"],
    },
    productPrice: {
        type: Number,
        required: [true, "Please set a price for your product"],
        min: 0,
    },
    productDescription: {
        type: String,
        required: [true, "Please add a description for your product"],
    },
    productCategory: {
        type: String,
        required: [true, "Please add a category"],
        enum: {
            values: ["women's clothing", "electronics", "jewelery", "men's clothing"],
            message: "{value} is not a supported category",
        },
    },
    productImage: {
        type: String,
    },
    isSold: {
        type: Boolean,
        required: [true, "Please set the sales status"],
    },
    saleDate: {
        type: Date,
        required: [true, "Please set a sale date"],
    },
    saleMonth: {
        type: String,
        enum: {
            values: monthNames,
            message: "{value} is not a supported month",
        },
    },
});

function getMonthName(dateString) {
    const dateObj = new Date(dateString);
    const month = dateObj.getMonth();
    const monthName = monthNames[month];
    return monthName;
}

transactionSchema.pre("save", function (next) {
    this.saleMonth = getMonthName(this.saleDate);
    next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
