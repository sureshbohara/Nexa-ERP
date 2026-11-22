import { Eye, EyeOff } from 'lucide-react';

export default function FormInput({
    label,
    name,
    value,
    onChange,
    error,
    icon: Icon,
    type = 'text',
    required = false,
    disabled = false,
    placeholder,
    autoComplete,
    rows = 4,
    options = [],
    showPassword = false,
    onTogglePassword,
}) {
    const leftPaddingClass = Icon && type !== 'password' ? 'pl-10' : 'pl-4';
    
    const baseInputClasses = `w-full ${leftPaddingClass} pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all outline-none ${
        disabled ? 'text-gray-500 dark:text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-slate-800' : ''
    } ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`;

    const renderInput = () => {
        switch (type) {
            case 'password':
                return (
                    <>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            name={name} 
                            value={value} 
                            onChange={(e) => onChange(e.target.value)} 
                            disabled={disabled} 
                            placeholder={placeholder} 
                            autoComplete={autoComplete} 
                            className={`w-full ${leftPaddingClass} pr-10 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all outline-none ${error ? 'border-red-500' : ''}`} 
                        />
                        {onTogglePassword && (
                            <button 
                                type="button" 
                                onClick={onTogglePassword} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        )}
                    </>
                );
            case 'select':
                return (
                    <>
                        <select 
                            name={name} 
                            value={value || ''} 
                            onChange={(e) => onChange(e.target.value)} 
                            disabled={disabled}
                            className={`${baseInputClasses} appearance-none cursor-pointer pr-10`}
                        >
                            <option value="">Select an option</option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </>
                );
            case 'textarea':
                return (
                    <textarea 
                        name={name} 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)} 
                        rows={rows} 
                        disabled={disabled}
                        placeholder={placeholder} 
                        className={`${baseInputClasses} resize-none`} 
                    />
                );
            default:
                return (
                    <input 
                        type={type} 
                        name={name} 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)} 
                        disabled={disabled} 
                        placeholder={placeholder} 
                        autoComplete={autoComplete} 
                        className={baseInputClasses} 
                    />
                );
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && type !== 'password' && type !== 'date' && type !== 'number' && type !== 'select' && type !== 'textarea' && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                )}

                {renderInput()}
            </div>

            {error && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}