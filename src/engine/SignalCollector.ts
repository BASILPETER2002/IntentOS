import type { Signal } from './types';

type SignalCallback = (signal: Signal) => void;

export class SignalCollector {
    private listeners: SignalCallback[] = [];
    private lastMousePosition: { x: number; y: number } | null = null;
    private lastClickTime: number = 0;


    constructor() {
        this.initListeners();
    }

    public subscribe(callback: SignalCallback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private emit(signal: Signal) {
        this.listeners.forEach(l => l(signal));
    }

    private initListeners() {
        // Mouse Velocity & Movement
        let throttleTimeout: number | undefined;
        window.addEventListener('mousemove', (e) => {
            if (!this.lastMousePosition) {
                this.lastMousePosition = { x: e.clientX, y: e.clientY };
                return;
            }

            const dx = e.clientX - this.lastMousePosition.x;
            const dy = e.clientY - this.lastMousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Update last position
            this.lastMousePosition = { x: e.clientX, y: e.clientY };

            // Emit velocity signal periodically (not every frame)
            if (!throttleTimeout) {
                throttleTimeout = window.setTimeout(() => {
                    this.emit({
                        type: 'MOUSE_VELOCITY',
                        value: distance, // simplistic 'pixels per 50ms'
                        timestamp: Date.now()
                    });
                    throttleTimeout = undefined;
                }, 100);
            }
        });

        // Clicks
        window.addEventListener('click', () => {
            const now = Date.now();
            const timeSinceLastClick = now - this.lastClickTime;
            this.lastClickTime = now;

            // Detect rapid clicking (rage clicks?)
            if (timeSinceLastClick < 300) {
                this.emit({
                    type: 'CLICK_RATE',
                    value: 1, // High intensity
                    timestamp: now,
                    metadata: { rapid: true }
                });
            }
        });

        // Idle Detection
        let idleTimer: number;
        const resetIdle = () => {
            clearTimeout(idleTimer);
            idleTimer = window.setTimeout(() => {
                this.emit({
                    type: 'IDLE_TIME',
                    value: 5000, // 5 seconds
                    timestamp: Date.now()
                });
            }, 5000); // 5 seconds threshold
        };

        ['mousemove', 'keydown', 'click', 'scroll'].forEach(evt =>
            window.addEventListener(evt, resetIdle)
        );
        resetIdle(); // Start
    }
}
