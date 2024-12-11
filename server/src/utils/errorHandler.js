export const createErrorResponse = (code, message) => ({
    error: {
        code,
        message,
    },
});

export const handleError = (res, error) => {
    if (error.name === 'ZodError') {
        return res.status(400).json(createErrorResponse(400, error.errors[0].message));
    }

    if (error.error && error.error.code) {
        return res.status(error.error.code).json(error);
    }

    if (error.message && error.message.includes('does not exist')) {
        return res.status(400).json(createErrorResponse(400, error.message));
    }

    if (error.status && error.message) {
        return res.status(error.status).json(createErrorResponse(error.status, error.message));
    }

    console.error('Unhandled error:', error);

    res.status(500).json(createErrorResponse(500, 'Internal server error'));
};

