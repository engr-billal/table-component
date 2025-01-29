export default function debounce<F extends (...args: never[]) => void>(
    func: F,
    delay: number
  ): (...args: Parameters<F>) => void {
    let timer: ReturnType<typeof setTimeout>;
  
    return (...args: Parameters<F>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  