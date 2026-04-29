export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    'confirmed': 'Confirmado',
    'completed': 'Concluído',
    'cancelled': 'Cancelado',
    'no-show': 'Não compareceu'
  };
  return labels[status] || status;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // retorna em minutos
}
