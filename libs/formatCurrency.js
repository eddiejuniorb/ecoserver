const formatCurrency = (amount) => {
    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting',
    }).format(amount).replace("$", "₵")

    return currency
}

module.exports = formatCurrency