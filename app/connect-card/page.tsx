import { redirect } from 'next/navigation';

// The Instagram bio links to /connect-card; the card lives on the Connect page.
export default function ConnectCardRedirect() {
  redirect('/connect#card');
}
