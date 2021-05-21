
export function diff(seconds: number): string {
  if( seconds > 86400) {
    const days = Math.round(seconds / 86400);
    const hours = Math.round( (seconds % 86400) / 3600);
    return `${days}天${hours}小时`;
  }
  if( seconds > 3600) {
    const hours = Math.round(seconds / 3600);
    const minutes = Math.round( (seconds % 3600) / 60);
    return `${hours}小时${minutes}分钟`;
  }
  if(seconds > 60) {
    const minutes = Math.round(seconds / 60);
    const second = seconds % 60;
    return `${minutes}小时${second}秒`;
  }
  if(seconds >= 0) {
    return `${seconds}秒`;
  }
  return '-';
  
}