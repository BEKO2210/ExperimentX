# METHOD

ExperimentX uses a forced-choice target-identification design with ranking.

- Chance expectation with 4 candidates is 25% rank-1 hits.
- Hit criterion: only rank 1 equals actual target.
- Double-blind idea: participant should not see actual target before impressions.
- Controls against sensory leakage and expectation effects are explicit goals.
- Cherry picking and post-hoc reinterpretation are discouraged.
- Preregistration and replication are prioritized in later runs.
- Negative results are informative and must be reported.

- Result reporting should include hit rate, chance baseline, binomial tail probability and confidence interval with conservative interpretation language.

- Before session start, preregister trial count, candidates per trial, hypothesis text, and exclusion rules to reduce post-hoc flexibility.

- Target pools may be user-imported JSON, but must pass schema checks and contain at least 4 distinct targets.

- Include bias diagnostics: candidate exposure counts and target-selection counts to detect randomization imbalance.

- Collect per-trial confidence (0-100) and report confidence on hits vs misses to detect possible calibration effects.

- Record pre-session state variables (mood, stress, fatigue, preparation time) to support exploratory context analyses and reduce hidden confounds.


## Erweiterte Statistik (Run 015)
- Berichte neben Hit-Rate und p-Wert auch eine Effektgröße (Cohen's h) relativ zur Zufallserwartung.
- Führe Multi-Session-Summaries nur transparent und explorativ zusammen (Sessions, Gesamttrials, Gesamthits, aggregierte Hit-Rate, aggregierter Binomialtest).
- Auch aggregierte Signale sind kein Beweis, sondern replizierungsbedürftige Beobachtungen.

## Replikationsmodus (Run 016)
- Für Replikationsserien soll ein identisches Protokoll beibehalten werden (gleiche Trial-Anzahl, Kandidatenzahl, Hypothese, Ausschlussregeln).
- Sessions werden mit Participant Code dokumentiert; Replikationsmodus erzeugt zusätzlich eine Protokoll-ID aus dem Design.
- Multi-Session-Vergleiche dürfen nur als explorative Replikationshinweise interpretiert werden, nicht als Beweis.

## Integrity-Modus (Run 017)
- Für abgeschlossene Sessions wird ein kanonisches JSON serialisiert und per SHA-256 gehasht.
- Der Hash dient nur der Integritätsprüfung (Unverändertheit), nicht als Aussage über Datenqualität.
- Verifikation muss reproduzierbar mit derselben Kanonisierung erfolgen.

## Skeptical Review Mode (Run 019)
- Ergebnisse erhalten automatische Warnhinweise bei möglichen Schwachstellen (z. B. kleine Stichprobe, unvollständige Trials, Randomisierungsimbalance, schwache Signifikanz).
- Diese Warnungen ersetzen kein Peer-Review, sondern dienen als konservative Selbstkontrolle.
- Auch bei fehlenden Warnungen bleiben Resultate explorativ und replizierungsbedürftig.
