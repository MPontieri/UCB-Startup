export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) {
        return 'agora';
    } else if (seconds < 60) {
        return `${seconds} segundos atrás`;
    }

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return minutes === 1 ? '1 minuto atrás' : `${minutes} minutos atrás`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
        return hours === 1 ? '1 hora atrás' : `${hours} horas atrás`;
    }

    const days = Math.round(hours / 24);
    return days === 1 ? '1 dia atrás' : `${days} dias atrás`;
};
