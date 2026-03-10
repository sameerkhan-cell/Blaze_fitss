// app/footballs/page.jsx
import CategoryPageLayout from '../../components/CategoryPageLayout'
export const dynamic = 'force-dynamic'
export default function FootballsPage() {
  return <CategoryPageLayout slug="footballs" title="Footballs" subtitle="Match balls, training balls, and everything in between." heroLabel="MATCH QUALITY" />
}
