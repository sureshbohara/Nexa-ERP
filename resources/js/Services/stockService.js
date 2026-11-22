export const STOCK_ADJUSTMENT_OPTIONS = [
    {
        value: 'stock_in',
        label: 'Stock In',
        description: 'Add stock quantity.',
    },
    {
        value: 'stock_out',
        label: 'Stock Out',
        description: 'Remove stock quantity.',
    },
    {
        value: 'adjustment',
        label: 'Adjustment',
        description: 'Set the exact stock quantity.',
    },
];

export const getStockSummary = (stocks = []) => {
    return stocks.reduce(
        (summary, stock) => {
            const quantity = Number(stock.quantity || 0);

            summary.totalQuantity += quantity;

            if (quantity <= 0) {
                summary.outOfStock += 1;
            } else if (quantity <= 10) {
                summary.lowStock += 1;
            } else {
                summary.inStock += 1;
            }

            return summary;
        },
        {
            totalQuantity: 0,
            inStock: 0,
            lowStock: 0,
            outOfStock: 0,
        }
    );
};

export const filterStocks = (stocks = [], search = '') => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
        return stocks;
    }

    return stocks.filter((stock) => {
        const searchableValues = [
            stock.product?.name,
            stock.product?.sku,
            stock.warehouse?.name,
            stock.batch_number,
        ];

        return searchableValues.some((value) =>
            String(value || '').toLowerCase().includes(keyword)
        );
    });
};

export const getStockStatus = (quantity) => {
    const value = Number(quantity || 0);

    if (value <= 0) {
        return {
            label: 'Out of Stock',
            className: 'bg-red-100 text-red-700',
        };
    }

    if (value <= 10) {
        return {
            label: 'Low Stock',
            className: 'bg-amber-100 text-amber-700',
        };
    }

    return {
        label: 'In Stock',
        className: 'bg-green-100 text-green-700',
    };
};

export const formatStockDate = (date) => {
    if (!date) {
        return '—';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(parsedDate);
};
