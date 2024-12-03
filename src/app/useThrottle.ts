import {useRef, useCallback} from 'react';

function useThrottle<Args extends unknown[], Return>(
    callback: (...args: Args) => Return,
    delay: number
): (...args: Args) => void {
    const lastCall = useRef<number>(0);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const throttledFunction = useCallback(
        (...args: Args) => {
            const now = Date.now();

            if (now - lastCall.current >= delay) {
                lastCall.current = now;
                callback(...args);
            } else if (!timeout.current) {
                const remainingTime = delay - (now - lastCall.current);
                timeout.current = setTimeout(() => {
                    lastCall.current = Date.now();
                    callback(...args);
                    timeout.current = null;
                }, remainingTime);
            }
        },
        [callback, delay]
    );

    return throttledFunction;
}

export default useThrottle;
