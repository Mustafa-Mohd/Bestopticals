import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type = 'success' }) => {
    const styles = {
        success: {
            bg: 'bg-green-600',
            icon: <CheckCircle size={18} />,
        },
        warning: {
            bg: 'bg-yellow-500',
            icon: <AlertCircle size={18} />,
        },
        error: {
            bg: 'bg-red-600',
            icon: <AlertCircle size={18} />,
        },
        info: {
            bg: 'bg-blue-600',
            icon: <Info size={18} />,
        },
    };

    const { bg, icon } = styles[type] || styles.success;

    return (
        <div className={`${bg} text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 min-w-64 max-w-sm animate-slide-up`}>
            <span className="shrink-0">{icon}</span>
            <span className="text-sm font-semibold flex-1">{message}</span>
        </div>
    );
};

export default Toast;
