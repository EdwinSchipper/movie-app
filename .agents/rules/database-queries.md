# Database & Query Richtlijnen (Database & Query Policy)

In dit project hanteren we strikte kwaliteits- en performance-eisen voor alle database queries (Supabase / PostgreSQL).

## 1. Verbod op Wildcards (`select('*')`)
- **GEBRUIK NOOIT `select('*')`**:
  - Het gebruik van wildcards (`*`) in database queries is strikt verboden.
  - Vraag altijd **exact en expliciet** alleen de benodigde kolommen op (bijv. `.select('id, user_id, title, ...')`).

## 2. Redenen & Waarborgen
1. **Performance & Bandbreedte**:
   - Voorkomt onnodige datatransmissie over het netwerk tussen Supabase en de Next.js Server Actions.
2. **Type-Safety & Sluitende Contracten**:
   - Garandeert dat de geretourneerde data exact 1-op-1 aansluit op de gedefinieerde TypeScript interfaces in `types/`.
3. **Data-lekkage Preventie**:
   - Voorkomt dat eventuele toekomstige interne of gevoelige kolommen onbedoeld meegestuurd worden naar client componenten.

