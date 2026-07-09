import type { SessionMode } from "../components/SessionConfig"

type ModeInfo = {
    title: React.ReactNode
    summary: string
    detail: React.ReactNode
}

const modeInfo: Record<SessionMode, ModeInfo> = {
    light: {
        title: (
            <div className="flex items-baseline gap-2">
                <span className="font-display text-lg text-accent">Light</span>
                <span className="body-text text-muted text-sm ml-2">90 min focus · 20 min break</span>
            </div>
        ),
        summary: "Best for deep, demanding work like studying, essay writing, coding, or anything that needs you fully in the zone.",
        detail: (
            <>
                <p className="mb-4">Built around your body's natual ~90-minutes focus-and-rest cycle. Longer stretches suit deep immersion, with a fuller
                    break to recharge before the next cycle.
                </p>

                <p>Based on ultradian rhythm research (Kleitman) and studies of expert practice 
                    (Ericssion et al., 1993).
                </p>
                
                <p>Kleitman, N. - Basic Rest-Activity Cycle (BRAC) research. And: Ericsson, K.A., Krampe, R.T., & Tesch-Römer, C. (1993). 
                    "The Role of Deliberate Practice in the Acquisition of Expert Performance." Psychological Review, 100(3), 363–406.
                </p>
            </>
        )
    },
    normal: {
        title: (
            <div className="flex items-baseline gap-2">
                <span className="font-display text-lg text-accent">Normal</span>
                <span className="body-text text-muted text-sm ml-2">52 min focus · 17 min break</span>
            </div>
        ),
        summary: "A comfy, balanced rhythm for everyday focused work - reading, organizing, or general study.",
        detail: (
            <>
                <p className="mb-4">Based on a study of the most productive workers, who naturally settled into ~52 minutes of focus followed
                    by a ~17-minute break - enough to recover without losing momentum.
                </p>

                <p>Based on the DeskTime workplace data analysis (2014).
                </p>
                
                <p>The DeskTime/Draugiem Group productivity analysis (2014) - the widely-cited source of the 52/17 finding.
                </p>
            </>
        )
    },
    intense: {
        title: (
            <div className="flex items-baseline gap-2">
                <span className="font-display text-lg text-accent">Intense</span>
                <span className="body-text text-muted text-sm ml-2">25 min focus · 5 min break</span>
            </div>
        ),
        summary: "Perfect for shorter tasks, or when getting started feels hard.",
        detail: (
            <>
                <p className="mb-4">Short, frequent sprints (the Pomodoro Technique) make focus easier to begin and keep your 
                    energy steady - with a longer break every 4th round for deeper rest.
                </p>

                <p>The Pomodoro Technique (Cirillo), supported by micro-break research (Albulescu et al., 2022).
                </p>
                
                <p>The Pomodoro Technique — Francesco Cirillo (technique, not a study). Supported by micro-break recovery research: Albulescu, P., Macsinga, I., Rusu,
                    A., Sulea, C., Bodnaru, A., & Tulbure, B.T. (2022). "'Give me a break!' A systematic review and meta-analysis on the efficacy of micro-breaks for
                    increasing well-being and performance." PLOS ONE, 17(8), e0272460.
                </p>
            </>
        )
    },
    custom: {
        title: (
            <div className="flex items-baseline gap-2">
                <span className="font-display text-lg text-accent">Custom</span>
            </div>
        ),
        summary: "Your rhythm, your rules - set your own focus and break lengths.",
        detail: (
            <>
                <p className="mb-4">After about 3 hours of accumulated focus, a longer break (~25 min) is added automatically. Following the same recovery principles as
                    the preset.
                </p>

                <p>Principle 1: Breaks should be ~20-25% of total session time (ratio principle, DeskTime).
                </p>

                <p>Principle 2: Long focus stretches need breaks over ~10 minutes to fully recover (recovery-threshold principle, Albulescu 2022).
                </p>
            </>
        )
    }
}

export default modeInfo