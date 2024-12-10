export const handleError = (res, error) => {
    if (error.name === 'ZodError') {
        const formattedErrors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({ errors: formattedErrors });
    }

    if (error.message && error.message.includes('does not exist')) {
        return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
};
