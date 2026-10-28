# Import-integriteit & Refactoring Beleid (Import Integrity & Cleanup Policy)

Na elke herstructurering, verplaatsing van bestanden (`git mv`), hernoeming of refactoring MOET de agent altijd proactief en zonder dat de gebruiker hierom hoeft te vragen de volgende controles uitvoeren:

1. **Codebase-breed zoeken op oude paden en exports**:
   - Controleer via grep of verouderde relatieve paden (bijv. `./Header`, `components/ui/Header`) of oude identifiers ergens zijn achtergebleven.
   - Loop alle betrokken `index.ts` (barrel) bestanden na: verwijder verouderde exports en zorg dat nieuwe paden correct zijn opgenomen.
2. **Afhankelijkheids- & typecontrole**:
   - Voer altijd `npx tsc --noEmit` uit om te verifiëren dat alle TypeScript imports en types sluitend zijn.
   - Voer altijd `pnpm lint` uit om te garanderen dat de linter geen ongebruikte variabelen of verouderde imports signaleert.
3. **Documentatie & referenties**:
   - Controleer of documentatiebestanden (zoals `README.md`) of tests nog verwijzen naar verouderde structuren en werk deze direct bij.
4. **Proactieve rapportage**:
   - Meld de uitkomst van deze import- en syntaxcontroles altijd expliciet in de samenvatting aan de gebruiker.
