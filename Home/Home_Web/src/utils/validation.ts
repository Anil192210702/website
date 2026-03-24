export const validateFullName = (name: string): boolean => {
    // Only letters, numbers, and spaces
    return /^[a-zA-Z0-9\s]+$/.test(name);
};

export const validateEmail = (email: string): boolean => {
    // Basic email validation, must contain @ and end with .com
    const lowerEmail = email.trim().toLowerCase();
    return lowerEmail.includes('@') && lowerEmail.endsWith('.com');
};

export const validatePhone = (phone: string): boolean => {
    // Starts with 6,7,8,9 and 10 digits total
    return /^[6789]\d{9}$/.test(phone);
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one capital letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one special character' };
    }
    return { isValid: true };
};
