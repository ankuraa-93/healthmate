import ShareDashboard from './ShareDashboard';

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ShareDashboard token={token} />;
}
