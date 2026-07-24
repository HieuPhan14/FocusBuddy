import BigCard from "../components/BigCard";

const AboutPage = () => {
    return (
    <>
        <BigCard>
            <div className="flex flex-col gap-4 mx-1 p-4">
                <h1 className="text-center text-2xl font-display text-text mt-1">About</h1>

                <section>
                    <p className="font-display text-text text-center">
                        Focus Ducky is a cozy focus timer that schedules your breaks using research on attention and recovery. 🐤🐥🐣
                    </p>
                </section>

                <section className="flex flex-col gap-3">

                    <h2 className="font-display text-lg text-text border-b-2 border-border-light pb-1">The Science 🐤</h2>

                    <p className="body-text text-muted text-sm">
                        Two principles drive every mode: breaks should be roughly 20-25% of total session time, and recovering from
                        demanding work needs a break longer than ~10 minutes to actually work.
                    </p>

                    <div className="inner-panel-row">
                        <div className="font-display text-accent">Light - <span className="font-number text-xl">90</span> min focus · <span className="font-number text-xl">20</span> min break</div>
                        <p className="body-text text-sm text-muted mt-1">
                            Built around the body's natural ~90-minute ultradian rest-activity cycle (Kleitman, BRAC) and studies of expert practice (Ericsson, K.A., Krampe, R.T., & Tesch-Römer, C. (1993).
                            "The Role of Deliberate Practice in the Acquisition of Expert Performance." Psychological Review, 100(3), 363-406).                           
                        </p>   
                    </div>

                    <div className="inner-panel-row">
                        <div className="font-display text-accent">Normal - <span className="font-number text-xl">52</span> min focus · <span className="font-number text-xl">17</span> min break</div>
                        <p className="body-text text-sm text-muted mt-1">
                            Based on the DeskTime/Draugiem Group workplace productivity analysis (2014), which found the most productive workers naturally settled into ~52 minutes of focus followed by a ~17-minute break.                           
                        </p>   
                    </div>

                    <div className="inner-panel-row">
                        <div className="font-display text-accent">Intense - <span className="font-number text-xl">25</span> min focus · <span className="font-number text-xl">5</span> min break</div>
                        <p className="body-text text-sm text-muted mt-1">
                            The Pomodoro Technique (Cirillo), supported by micro-break recovery research: Albulescu, P., Macsinga, I., Rusu, A., Sulea, C., Bodnaru, A., & Tulbure, B.T. (2022). "'Give me a break!'
                            A systematic review and meta-analysis on the efficacy of micro-breaks for increasing well-being and performance." PLOS ONE, 17(8), e0272460.                               
                        </p>   
                    </div>

                </section>

                <section className="flex flex-col gap-2">
                    <h2 className="font-display text-lg text-text border-b-2 border-border-light pb-1">Credits 🐥</h2>

                    <ul className="body-text text-sm text-muted flex flex-col gap-1">
                        <li>Art: Assets from Little Dreamyland by Starmixu & Utaskuas</li>
                        <li>Map: Designed and built by Trung Hieu Phan using Little Dreamyland tiles</li>
                        <li>Background: Art from CraftPix.net, assembled from multiple packs</li>
                        <li>Icons: Lucid Icons by Midhil M (CC0 1.0), plus a few hand-drawn</li>
                        <li>Music: "Calm Ambient Tender Piano" via{" "}
                            <a
                                href="https://pixabay.com/music/modern-classical-calm-ambient-tender-piano-354930/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-accent"
                            >Pixabay</a>
                        </li>
                        <li>Fonts: Pixelify Sans, Nunito & VT323 via Google Fonts</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-display text-lg text-text border-b-2 border-border-light pb-1">Who Made It 🐣</h2>

                    <p className="body-text text-sm text-muted mt-2">Trung Hieu Phan -{" "}
                        <a
                            href="https://github.com/HieuPhan14"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent"
                        >
                            github.com/HieuPhan14
                        </a>
                    </p>
                </section>
            </div>
        </BigCard>
    </>
    )
}

export default AboutPage;