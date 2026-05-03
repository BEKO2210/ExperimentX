# CODEX.md — ExperimentX

## Projektdefinition
ExperimentX ist ein lokal ausführbares Open-Science-Werkzeug für kontrollierte Forced-Choice-Target-Image-Experimente mit dokumentierter Auswertung.

## Wissenschaftliche Grundhaltung
- offen, aber skeptisch
- methodisch streng
- keine Beweisbehauptung aus Einzelfällen
- negative Ergebnisse sind wertvoll
- Replikation vor Sensation

## Sicherheitsregeln
Keine Nahtod-Simulation, kein Sauerstoffmangel, keine Hyperventilation, keine Drogen, kein Schlafentzug, keine medizinischen Selbstversuche, keine Panikinduktion.

## Hypothesen
- H0: Trefferquote entspricht Zufallserwartung.
- H1 (explorativ): Trefferquote liegt unter kontrollierten Bedingungen über Zufall.
- Forschungsfrage (nicht Behauptung): Gehirn könnte teilweise als Filter/Interface für nicht-lokale Information wirken.

## Experimentdesign
- Forced-choice mit 4 Kandidaten pro Trial
- tatsächliches Ziel zufällig aus Kandidaten
- Impressionstext vor Ranking
- Treffer nur bei Rang 1
- Session-Score: Trefferquote, Zufallserwartung, Binomialwahrscheinlichkeit

## Technische Architektur
- Vite + React + TypeScript + Vitest
- V1 ohne Backend; lokale Ausführung
- Domainlogik in `src/domain/*`
- Demo-Targetpool in `src/data/demoTargets.ts`

## Roadmap (20 Runs)
1. Run 001 Foundation
2. Run 002 Vollständiger Trial-Flow + Persistenz
3. Run 003 JSON Export/Import
4. Run 004 Erweiterte Ergebnisansicht
5. Run 005 Präregistrierung
6. Run 006 Doppelblind-Härtung
7. Run 007 Target-Pool-Management
8. Run 008 Audit-Log
9. Run 009 Bias-Kontrollen
10. Run 010 Confidence-Tracking
11. Run 011 Zustandsprotokoll
12. Run 012 GitHub Pages Readiness
13. Run 013 UI/UX Politur
14. Run 014 Accessibility
15. Run 015 Erweiterte Statistik
16. Run 016 Replikationsmodus
17. Run 017 Integrity Hashing
18. Run 018 Documentation Hardening
19. Run 019 Skeptical Review Mode
20. Run 020 Public Research Release

## Per-Run-Protokoll
1) CODEX.md lesen
2) ROADMAP prüfen
3) Stand prüfen
4) nächsten offenen Run wählen
5) nur diesen Run umsetzen
6) Claims nicht verschärfen
7) Tests schreiben/aktualisieren
8) Tests ausführen
9) CODEX.md Run-Log aktualisieren
10) Docs aktualisieren
11) Commit vorbereiten

## Akzeptanzkriterien
Run gilt als erledigt, wenn Deliverables implementiert, getestet und dokumentiert sind.

## Teststrategie
- Unit-Tests für Randomisierung, Scoring, Statistik
- deterministische RNG-Tests
- bei Fehlern: transparente Dokumentation

## Statistikstrategie
- Primärmetrik: Rank-1 Hit-Rate
- Vergleich gegen Zufallsrate (1/k Kandidaten)
- Binomial P(X>=k) explorativ
- keine p-hacking-freundlichen Mehrfachanalysen in V1

## Dokumentationsregeln
- Jede Änderung in CODEX.md Run-Log dokumentieren
- Methoden- und Safety-Dokumente synchron halten

## Claim-Disziplin
Nur Formulierungen wie „exploratory“, „above chance“, „requires replication“. Keine metaphysischen Beweisclaims.

## Nächster Run
Run abgeschlossen: v0.1.0 erreicht. Nächster Zyklus optional als Post-v0.1 Maintenance/Feedback.

## Run-Log
- Run 001 (2026-05-03): Foundation umgesetzt: Vite/React/TypeScript Projektstruktur, Domainmodelle, Randomisierung, Statistik, Dokumentation, Basis-UI mit Demo-Session (10 Trials), Tests ergänzt und ausgeführt (siehe Testergebnisse unten). Bekannte Grenzen: V1 nutzt Demo-Targets und reine Client-seitige Speicherung ohne Persistenz.

- Run 002 (2026-05-03): Trial-Flow auf zwei Phasen (Impression -> Ranking) umgestellt, direkte Mutationen entfernt, Session-Fortschritt über localStorage persistiert (save/load/clear), Ergebnisansicht mit sauberem Abschlussfluss ergänzt, Persistenz-Tests ergänzt. Bekannte Grenzen: noch kein JSON Export/Import und kein Audit-Log.

- Run 003 (2026-05-03): JSON Export/Import ergänzt. Sessions können als JSON-Datei exportiert und wieder importiert werden; Import validiert Basisschema. UI um Importfeld auf Startseite und Export-Button im Session-Flow erweitert. Neue Unit-Tests für IO hinzugefügt. Grenzen: noch keine erweiterte Ergebnisinterpretation pro Subgruppe/CI.

- Run 004 (2026-05-03): Ergebnisansicht erweitert um 95%-Wilson-Konfidenzintervall, klaren Binomialtest-Output und konservative automatische Interpretation (exploratory only, replication required, kein Beweis-Claim). Grenzen: noch keine Präregistrierungsmaske.

- Run 005 (2026-05-03): Präregistrierungsmodul implementiert (Trial-Anzahl, Kandidatenzahl, Hypothese, Ausschlussregeln, Zeitstempel). Session-Generierung folgt dem registrierten Plan; Ergebnisansicht zeigt registrierte Parameter. Tests und JSON-IO für Prereg-Daten aktualisiert.

- Run 006 (2026-05-03): Doppelblind-Härtung ergänzt: Kandidaten bleiben bis zum Locken des Impressionstextes verborgen; danach wird eine zufällige Anzeige-Reihenfolge pro Trial erzeugt. Ranking-UI zeigt nur neutrale Optionen mit Reihenfolgenummer, ohne Zielhinweise.

- Run 007 (2026-05-03): Target-Pool-Management ergänzt. Nutzer können Zielsets als JSON importieren/exportieren; Validierung prüft Mindestgröße, Pflichtfelder und doppelte IDs. Session-Generierung verwendet den aktuell geladenen Pool.

- Run 008 (2026-05-03): Audit-Log eingeführt. Session-Ereignisse (Start, Import, Impression gespeichert, Ranking abgegeben, Abschluss) werden mit ISO-Zeitstempel dokumentiert. Ergebnisansicht zeigt Anzahl Audit-Events.

- Run 009 (2026-05-03): Bias-Kontrollen ergänzt. Ergebnisse zeigen Kandidatenverteilung (wie oft angezeigt/als Ziel gezogen) und Imbalance-Scores für Sichtbarkeit und Zielauswahl, um mögliche Randomisierungs-Schieflagen früh zu erkennen.

- Run 010 (2026-05-03): Confidence-Tracking ergänzt. Pro Trial wird vor dem Absenden eine Confidence (0-100) erfasst und gespeichert. Ergebnisansicht berichtet Mittelwert gesamt sowie getrennt für Treffer und Nicht-Treffer.

- Run 011 (2026-05-03): Zustandsprotokoll ergänzt. Vor Sessionstart werden Stimmung, Stress, Müdigkeit, Vorbereitungszeit und optionale Notizen erfasst und mit der Session gespeichert. Ergebnisansicht zeigt die Zustandswerte zur transparenten Kontextualisierung.

- Run 012 (2026-05-03): GitHub-Pages-Readiness umgesetzt. Vite `base` konfigurierbar über ENV, `build:pages`/`preview:pages` Skripte ergänzt, Pages-Deployment-Doku und GitHub Actions Workflow hinzugefügt.

- Run 013 (2026-05-03): UI/UX-Politur umgesetzt: ruhigeres wissenschaftliches Layout (Panel/Card), bessere Typografie/Abstände, klarere Formularfelder, tabellarische Lesbarkeit verbessert und mobile Breakpoints für kleine Displays ergänzt.

- Run 014 (2026-05-03): Accessibility-Pass umgesetzt: Skip-Link, Fokusindikator für Keyboard-Navigation, semantische Landmark/Tabellen-Scopes, aria-live für Ergebnisupdates und Reduced-Motion-Regeln via `prefers-reduced-motion`.


- Run 015 (2026-05-03): Erweiterte Statistik umgesetzt. Ergebnisdarstellung ergänzt um Effektgröße (Cohen's h gegenüber Zufall) sowie lokale Multi-Session-Aggregation (zusammengeführte Sessions, aggregierte Trefferquote und Binomial-p-Wert). Session-Historie lokal speicherbar/löschbar; Statistiktests für Effektgröße und Aggregation ergänzt.

- Run 016 (2026-05-03): Replikationsmodus ergänzt. Session-Setup erfasst nun Participant Code und optionalen Replikationsmodus mit Cohort-Label. Für replizierte Sessions wird eine Protokoll-ID aus dem Studiendesign erzeugt; in der Ergebnisansicht wird gezählt, wie viele lokal gespeicherte Sessions dasselbe Protokoll replizieren. Neue Unit-Tests prüfen Protokoll-ID und Matching-Logik.

- Run 017 (2026-05-03): Integrity-Modus ergänzt. Für abgeschlossene Sessions wird kanonisches JSON erzeugt und ein SHA-256 Hash berechnet/angezeigt. Zusätzlich erfolgt eine lokale Verifikationsprüfung des Hashes. Neue Unit-Tests decken deterministische Kanonisierung und Hash-Verifikation ab.

- Run 018 (2026-05-03): Documentation Hardening umgesetzt. FAQ und Glossar ergänzt, README-Dokumentationsübersicht erweitert, methodische/claim-konservative Begriffe vereinheitlicht. Fokus: bessere Reproduzierbarkeit, Verständlichkeit und verantwortungsvolle Ergebnis-Kommunikation.

- Run 019 (2026-05-03): Skeptical Review Mode ergänzt. Abschlussansicht enthält jetzt automatische Warnhinweise für potenzielle methodische Schwachstellen (kleine Stichprobe, unvollständige Trials, Randomisierungsimbalance, schwache Signifikanz, fehlende Preregistration, dünnes Audit-Log). Neue Unit-Tests für Warnlogik ergänzt.

- Run 020 (2026-05-03): Public Research Release v0.1.0 abgeschlossen. Release-Dokument erstellt, Beispielprotokoll ergänzt, README auf Release-Artefakte erweitert und Build/Test/Pages-Build als Abschlussvalidierung gefahren. Ergebnis: Roadmap 001-020 vollständig umgesetzt.

- Post-v0.1 Zyklus 001 (2026-05-03): Bugfix-Hardening für Session-Import umgesetzt. `sessionIO` prüft jetzt Trial-Konsistenz strenger (Kandidatenanzahl, Ziel-ID in Kandidaten, Ranking-Länge, Confidence-Bereich). Zusätzliche Regressionstests und Release-Notiz v0.1.1 ergänzt.
